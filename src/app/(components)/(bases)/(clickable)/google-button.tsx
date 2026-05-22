import { GoogleLogin } from '@react-oauth/google';
import { useRef } from 'react';
import { BaseButton } from './base-button';
import { GoogleIcon } from '../../(elements)/google-icon';

interface GoogleAuthButtonProps {
  onSuccess: (idToken: string) => void;
  isLoading?: boolean;
  label?: string;
}

export function GoogleAuthButton({
  onSuccess,
  isLoading,
  label = 'Continuar com Google',
}: GoogleAuthButtonProps) {
  const hiddenRef = useRef<HTMLDivElement>(null);

  const triggerGoogleLogin = () => {
    const btn = hiddenRef.current?.querySelector<HTMLElement>('[role="button"]');
    btn?.click();
  };

  return (
    <>
      <div
        ref={hiddenRef}
        className="absolute overflow-hidden opacity-0"
        style={{ width: 1, height: 1 }}
        aria-hidden
      >
        <GoogleLogin
          onSuccess={({ credential }) => {
            if (credential) onSuccess(credential);
          }}
        />
      </div>

      <BaseButton
        type="button"
        variant="outline"
        className="w-full gap-2"
        isLoading={isLoading}
        disabled={isLoading}
        onClick={triggerGoogleLogin}
      >
        <GoogleIcon />
        {label}
      </BaseButton>
    </>
  );
}
