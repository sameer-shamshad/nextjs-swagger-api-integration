'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useMachine } from '@xstate/react';
import loginMachine from '@/machines/auth/LoginMachine';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setAuthData } from '@/store/features/AuthReducer';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [state, send] = useMachine(loginMachine);
  const hasStoredAuth = useRef(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send({ type: 'SUBMIT' });
  };

  const handleChange = (field: 'email' | 'password', value: string) => {
    send({ type: 'CHANGE_FIELD', field, value });
  };

  const isSubmitting = state.matches('submitting');
  const isSuccess = state.matches('success');

  // Store user data in Redux when login succeeds
  useEffect(() => {
    if (isSuccess && state.context.authResponse && !hasStoredAuth.current) {
      const response = state.context.authResponse;
      
      // Validate response structure and ensure success
      if (
        response.success === true &&
        response.data &&
        response.data.user &&
        response.data.accessToken &&
        response.data.refreshToken &&
        response.data.user.id &&
        response.data.user.email
      ) {
        // Store user data in Redux store and mark as authenticated
        dispatch(setAuthData({
          user: response.data.user,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        }));
       
        hasStoredAuth.current = true;
        
        // Redirect to dashboard after successful login
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    }
  }, [isSuccess, state.context.authResponse, dispatch, router]);

  return (
    <div className="flex flex-col items-center py-8 px-4 sm:px-0 sm:py-20">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-sm border border-border bg-background p-4 rounded-2xl flex flex-col gap-3 
        [&>div>label]:mb-1 [&>div>label]:block [&>div>label]:text-sm [&>div>label]:font-medium [&>div>label]:text-primary-foreground 
        
        [&>div>input]:w-full [&>div>input]:rounded-md [&>div>div]:relative
        [&>div>div>input]:w-full [&>div>div>input]:rounded-md 
        [&>div>div>input]:disabled:cursor-not-allowed [&>div>div>input]:disabled:opacity-50
        [&>div>input]:border [&>div>input]:border-border [&>div>input]:bg-background 
        [&>div>input]:text-sm [&>div>input]:text-primary-foreground [&>div>input]:px-3 [&>div>input]:py-3 
        [&>div>input]:focus:outline-none [&>div>input]:focus:ring-2 [&>div>input]:focus:ring-primary 
        [&>div>input]:disabled:cursor-not-allowed [&>div>input]:disabled:opacity-50
        
        [&>div>div>input]:border [&>div>div>input]:border-border [&>div>div>input]:bg-background 
        [&>div>div>input]:text-sm [&>div>div>input]:text-primary-foreground [&>div>div>input]:px-3 [&>div>div>input]:py-3 
        [&>div>div>input]:focus:outline-none [&>div>div>input]:focus:ring-2 [&>div>div>input]:focus:ring-primary"
      >
        <header className="text-3xl font-extrabold text-primary-foreground text-center">
          Sign In
        </header>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={state.context.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={isSubmitting || isSuccess}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <div>
            <input
              id="password"
              type={state.context.showPassword ? 'text' : 'password'}
              value={state.context.password}
              onChange={(e) => handleChange('password', e.target.value)}
              disabled={isSubmitting || isSuccess}
              placeholder="Enter your password"
            />
            <button 
              type="button" 
              className="material-symbols-outlined absolute right-3 top-1/2! -translate-y-1/2! cursor-pointer"
              onClick={() => send({ type: 'TOGGLE_PASSWORD_VISIBILITY' })}
            >{state.context.showPassword ? 'visibility_off' : 'visibility'}</button>
          </div>
        </div>

        {state.context.error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
            <div className="mb-2">{state.context.error}</div>
          </div>
        )}

        {isSuccess && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
            Login successful! Redirecting...
          </div>
        )}

        <Link href="/forgot-password" className="text-xs text-secondary-foreground text-center font-semibold py-1 hover:opacity-80 hover:underline">
          Forgot password?
        </Link>

        <button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className="bg-primary text-sm text-secondary px-4 py-3 font-semibold rounded-md transition-colors hover:opacity-90
          disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Signing in...' : isSuccess ? 'Success!' : 'Sign In'}
        </button>

        <p className="text-center text-sm text-secondary-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-primary hover:opacity-80"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
