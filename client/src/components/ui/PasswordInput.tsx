import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/format';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

/** Campo de contraseña con botón para mostrarla u ocultarla. Compatible con react-hook-form (ref). */
export const PasswordInput = forwardRef<HTMLInputElement, Props>(function PasswordInput({ className, ...props }, ref) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const label = visible ? t('auth.hidePassword') : t('auth.showPassword');

  return (
    <div className="relative">
      <input ref={ref} type={visible ? 'text' : 'password'} className={cn('input pr-11', className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={label}
        aria-pressed={visible}
        aria-controls={props.id}
        title={label}
        className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-[10px] text-slate-500 transition-colors hover:text-slate-900"
      >
        {visible ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
      </button>
    </div>
  );
});
