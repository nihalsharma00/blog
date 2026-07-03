import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function LoginForm({ onSuccess, onSwitchToRegister }) {
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await signIn({ email: data.email, password: data.password });
      onSuccess?.();
    } catch (err) {
      setServerError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {serverError && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="login-email" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
          Email Address
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={`input ${errors.email ? 'border-rose-400 focus:ring-rose-400' : ''}`}
          {...register('email')}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="login-password" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            className={`input pr-10 ${errors.password ? 'border-rose-400 focus:ring-rose-400' : ''}`}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full justify-center py-3"
        id="login-submit-btn"
      >
        {isSubmitting ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
        ) : 'Sign In'}
      </button>

      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Don&apos;t have an account?{' '}
        <button type="button" onClick={onSwitchToRegister} className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
          Create one
        </button>
      </p>
    </form>
  );
}
