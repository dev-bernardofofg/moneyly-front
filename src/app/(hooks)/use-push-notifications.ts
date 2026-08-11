'use client';

import { useAuth } from '@/app/(contexts)/auth-provider';
import {
  getMessagingClient,
  isPushConfigured,
  messagingSwUrl,
  PUSH_FID_STORAGE_KEY,
  VAPID_KEY,
} from '@/app/(utils)/firebase';
import {
  deleteNotificationsDevicesFid,
  getGetNotificationsQueryKey,
  postNotificationsDevices,
} from '@/app/(resources)/(generated)/hooks/notifications/notifications';
import { useQueryClient } from '@tanstack/react-query';
import {
  onMessage,
  onRegistered,
  onUnregistered,
  register,
  unregister,
  type Messaging,
} from 'firebase/messaging';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export type PushStatus =
  | 'checking' // ainda verificando suporte/permissão
  | 'unavailable' // sem envs do Firebase ou browser sem suporte
  | 'default' // suportado, permissão ainda não pedida
  | 'granted'
  | 'denied';

/**
 * O escopo isola este SW do /sw.js do PWA (que controla '/'). É o mesmo escopo
 * que o SDK do Firebase usa quando registra sozinho.
 */
const MESSAGING_SW_SCOPE = '/firebase-cloud-messaging-push-scope';

const registerMessagingSw = (): Promise<ServiceWorkerRegistration> =>
  navigator.serviceWorker.register(messagingSwUrl(), { scope: MESSAGING_SW_SCOPE });

export const usePushNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<PushStatus>('checking');
  const [fid, setFid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * register() não devolve o FID — ele chega pelo handler de onRegistered, e o
   * SDK recusa registrar sem esse handler montado. Por isso o attach é feito
   * aqui e chamado tanto no efeito inicial quanto no enable().
   * Reatribuir o handler é seguro: o SDK guarda apenas o último.
   */
  const attachRegistrationHandlers = useCallback(
    (messaging: Messaging): Array<() => void> => [
      onRegistered(messaging, (registeredFid) => {
        void postNotificationsDevices({ fid: registeredFid })
          .then(() => {
            localStorage.setItem(PUSH_FID_STORAGE_KEY, registeredFid);
            setFid(registeredFid);
          })
          .catch((error) => console.error('[push] falha ao registrar device', error));
      }),
      onUnregistered(messaging, (removedFid) => {
        localStorage.removeItem(PUSH_FID_STORAGE_KEY);
        setFid(null);
        void deleteNotificationsDevicesFid(removedFid).catch((error) =>
          console.error('[push] falha ao remover device', error)
        );
      }),
    ],
    []
  );

  // Estado inicial, listeners de registro e renovação silenciosa a cada sessão
  // (o SDK pode rotacionar o FID, e o backend precisa saber do novo).
  useEffect(() => {
    let active = true;
    let unsubscribes: Array<() => void> = [];

    const setup = async () => {
      const messaging = await getMessagingClient();
      if (!active) return;

      if (!messaging) {
        setStatus('unavailable');
        return;
      }

      const permission = Notification.permission;
      setStatus(permission);
      setFid(localStorage.getItem(PUSH_FID_STORAGE_KEY));
      unsubscribes = attachRegistrationHandlers(messaging);

      if (permission !== 'granted' || !user) return;

      try {
        await register(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: await registerMessagingSw(),
        });
      } catch (error) {
        console.error('[push] falha ao sincronizar registro', error);
      }
    };

    void setup();

    return () => {
      active = false;
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [user, attachRegistrationHandlers]);

  // Push com o app em foco não passa pelo service worker: o Firebase entrega
  // aqui e nós mostramos um toast, além de atualizar o sino.
  useEffect(() => {
    if (status !== 'granted') return;

    let unsubscribe: (() => void) | undefined;

    const listen = async () => {
      const messaging = await getMessagingClient();
      if (!messaging) return;

      unsubscribe = onMessage(messaging, (payload) => {
        const { title, body } = payload.data ?? {};
        if (title) toast(title, { description: body });

        void queryClient.invalidateQueries({
          queryKey: getGetNotificationsQueryKey({ page: 1, limit: 20 }),
        });
      });
    };

    void listen();

    return () => unsubscribe?.();
  }, [status, queryClient]);

  const enable = useCallback(async () => {
    setIsLoading(true);
    try {
      const messaging = await getMessagingClient();
      if (!messaging) {
        setStatus('unavailable');
        return;
      }

      const permission = await Notification.requestPermission();
      setStatus(permission);

      if (permission !== 'granted') {
        if (permission === 'denied') {
          toast.error('Notificações bloqueadas', {
            description: 'Libere as notificações nas configurações do navegador para este site.',
          });
        }
        return;
      }

      attachRegistrationHandlers(messaging);
      await register(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: await registerMessagingSw(),
      });
      toast.success('Notificações ativadas');
    } catch (error) {
      console.error('[push] falha ao ativar notificações', error);
      toast.error('Não foi possível ativar as notificações');
    } finally {
      setIsLoading(false);
    }
  }, [attachRegistrationHandlers]);

  const disable = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedFid = localStorage.getItem(PUSH_FID_STORAGE_KEY);

      const messaging = await getMessagingClient();
      if (messaging) await unregister(messaging);

      // Rede de segurança: se o unregister não emitiu onUnregistered (device
      // que já não estava registrado no FCM), removemos do backend na mão.
      if (storedFid) {
        await deleteNotificationsDevicesFid(storedFid);
        localStorage.removeItem(PUSH_FID_STORAGE_KEY);
      }

      setFid(null);
      toast.success('Notificações desativadas neste dispositivo');
    } catch (error) {
      console.error('[push] falha ao desativar notificações', error);
      toast.error('Não foi possível desativar as notificações');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    status,
    isLoading,
    isEnabled: status === 'granted' && Boolean(fid),
    isConfigured: isPushConfigured,
    enable,
    disable,
  };
};
