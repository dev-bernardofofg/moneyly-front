import { useAuth } from '@/app/(contexts)/auth-provider';
import { queryClient } from '@/app/(contexts)';
import { getErrorMessage, setFormFieldErrors } from '@/app/(helpers)/errors';
import {
  usePostAuthGoogle,
  usePostAuthSignIn,
  usePostAuthSignUp,
} from '@/app/(resources)/(generated)/hooks/auth/auth';
import {
  getGetOverviewDashboardQueryKey,
  getOverviewDashboard,
} from '@/app/(resources)/(generated)/hooks/overview/overview';
import { CustomAxiosError } from '@/app/(types)/error.type';
import { useRouter } from 'next/navigation';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

const prefetchDashboard = () => {
  queryClient.prefetchQuery({
    queryKey: getGetOverviewDashboardQueryKey(),
    queryFn: ({ signal }) => getOverviewDashboard(undefined, signal),
    staleTime: 30_000,
  });
};

export const useAuthActions = <T extends FieldValues>(form: UseFormReturn<T>) => {
  const router = useRouter();
  const { setAuth } = useAuth();

  const { mutate: signInMutate, isPending: signInPending } = usePostAuthSignIn({
    mutation: {
      onSuccess: (data) => {
        setAuth(data);
        prefetchDashboard();
        toast.success(data.message ?? 'Login realizado com sucesso');
        router.push('/dashboard');
      },
      onError: (error: CustomAxiosError) => {
        toast.error(getErrorMessage(error));
        setFormFieldErrors(error, form.setError, ['email', 'password'] as Path<T>[]);
      },
    },
  });

  const { mutate: googleMutate, isPending: googlePending } = usePostAuthGoogle({
    mutation: {
      onSuccess: (data) => {
        setAuth(data);
        prefetchDashboard();
        toast.success('Login com Google realizado com sucesso.');
        router.push('/dashboard');
      },
      onError: (error: CustomAxiosError) => {
        toast.error(getErrorMessage(error));
      },
    },
  });

  const { mutate: signUpMutate, isPending: signUpPending } = usePostAuthSignUp({
    mutation: {
      onSuccess: (data) => {
        setAuth(data);
        prefetchDashboard();
        toast.success('Conta criada com sucesso. Você será redirecionado..');
        router.push('/dashboard');
      },
      onError: (error: CustomAxiosError) => {
        toast.error(getErrorMessage(error));
        setFormFieldErrors(error, form.setError, ['name', 'email', 'password'] as Path<T>[]);
      },
    },
  });

  return {
    signIn: {
      mutate: signInMutate,
      isPending: signInPending,
    },
    google: {
      mutate: googleMutate,
      isPending: googlePending,
    },
    signUp: {
      mutate: signUpMutate,
      isPending: signUpPending,
    },
  };
};
