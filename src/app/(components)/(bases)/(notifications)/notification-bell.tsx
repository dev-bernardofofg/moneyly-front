'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  getGetNotificationsQueryKey,
  useGetNotifications,
  usePatchNotificationsIdRead,
  usePatchNotificationsReadAll,
} from '@/app/(resources)/(generated)/hooks/notifications/notifications';
import { Notification } from '@/app/(resources)/(generated)/types/Notification';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Bell, Check, Info, XCircle } from 'lucide-react';
import { useState } from 'react';

const severityIcon = (severity: Notification['severity']) => {
  switch (severity) {
    case 'danger':
      return <XCircle className="size-4 text-expense" />;
    case 'warning':
      return <AlertTriangle className="size-4 text-warn" />;
    default:
      return <Info className="size-4 text-info" />;
  }
};

const severityColor = (severity: Notification['severity']) => {
  switch (severity) {
    case 'danger':
      return 'border-l-expense bg-expense/5';
    case 'warning':
      return 'border-l-warn bg-warn/5';
    default:
      return 'border-l-info bg-info/5';
  }
};

export const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data } = useGetNotifications(
    { page: 1, limit: 20 },
    { query: { queryKey: getGetNotificationsQueryKey({ page: 1, limit: 20 }) } }
  );

  const notifications = data?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: getGetNotificationsQueryKey({ page: 1, limit: 20 }),
    });

  const { mutate: markRead } = usePatchNotificationsIdRead({
    mutation: { onSuccess: invalidate },
  });
  const { mutate: markAllRead } = usePatchNotificationsReadAll({
    mutation: { onSuccess: invalidate },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Notificações${unreadCount ? ` (${unreadCount} não lidas)` : ''}`}
          className="relative flex size-9 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-expense px-1 text-[10px] font-bold leading-4 text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="max-h-96 w-80 overflow-hidden" align="end">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold">Notificações</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllRead()}
              className="h-6 px-2 text-xs"
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>

        <Separator className="mb-3" />

        <div className="max-h-64 space-y-2 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Bell className="mx-auto mb-2 size-8 opacity-50" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`rounded-lg border-l-4 p-3 transition-colors ${
                  n.isRead ? 'opacity-60' : severityColor(n.severity)
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-1 items-start gap-2">
                    {severityIcon(n.severity)}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{n.message}</p>
                    </div>
                  </div>
                  {!n.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markRead({ id: n.id })}
                      className="size-6 p-0 hover:bg-income/10"
                      aria-label="Marcar como lida"
                    >
                      <Check className="size-3 text-income" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
