import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(80),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30)
    .regex(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, and underscores'),
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Include at least one uppercase letter')
    .regex(/[0-9]/, 'Include at least one number'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [registered, setRegistered] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await signUp({
        email: data.email,
        password: data.password,
        username: data.username,
        fullName: data.fullName,
      });
      setRegistered(true);
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    }
  };

  if (registered) {
    return (
      <div className="text-center py-6 space-y-3">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Check your email!</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
          We&apos;ve sent a confirmation link to your email. Click it to activate your account.
        </p>
        <button onClick={onSwitchToLogin} className="btn-outline mt-2">
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {serverError && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="reg-fullname" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            Full Name
          </label>
          <input
            id="reg-fullname"
            type="text"
            autoComplete="name"
            placeholder="Ada Lovelace"
            className={`input ${errors.fullName ? 'border-rose-400' : ''}`}
            {...register('fullName')}
          />
          {errors.fullName && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.fullName.message}</p>}
        </div>
        <div>
          <label htmlFor="reg-username" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            Username
          </label>
          <input
            id="reg-username"
            type="text"
            autoComplete="username"
            placeholder="ada_writes"
            className={`input ${errors.username ? 'border-rose-400' : ''}`}
            {...register('username')}
          />
          {errors.username && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.username.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
          Email Address
        </label>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={`input ${errors.email ? 'border-rose-400' : ''}`}
          {...register('email')}
        />
        {errors.email && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="reg-password" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            className={`input pr-10 ${errors.password ? 'border-rose-400' : ''}`}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="reg-confirm" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
          Confirm Password
        </label>
        <input
          id="reg-confirm"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="••••••••"
          className={`input ${errors.confirmPassword ? 'border-rose-400' : ''}`}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.confirmPassword.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full justify-center py-3"
        id="register-submit-btn"
      >
        {isSubmitting ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>
        ) : 'Create Account'}
      </button>

      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
          Sign in
        </button>
      </p>
    </form>
  );
}
