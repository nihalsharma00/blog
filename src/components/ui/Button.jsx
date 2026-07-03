import { clsx } from 'clsx';

const variants = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
};

const sizes = {
  sm: 'text-sm px-3 py-1.5 rounded-lg',
  md: '',
  lg: 'text-base px-6 py-3',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  as: Tag = 'button',
  ...props
}) {
  return (
    <Tag
      className={clsx(variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
