import { useState } from 'react';
import { ExpressCheckoutElement, PaymentElement } from '@stripe/react-stripe-js';
import type { StripeExpressCheckoutElementConfirmEvent } from '@stripe/stripe-js';
import { Lock } from 'lucide-react';
import { CK } from '@/data/checkout';
import type { Locale } from '@/hooks/useLocale';
import { Spinner } from '../ui/Spinner';

/**
 * Pago con los componentes oficiales de Stripe:
 * - Express Checkout Element: Apple Pay, Google Pay, Link… SOLO aparecen si el
 *   dispositivo, el navegador, el dominio y la cuenta de Stripe los soportan.
 *   Si no hay ninguno disponible, la sección no se muestra (nada de botones falsos).
 * - Payment Element: los datos de la tarjeta, en un iframe de Stripe. Nunca tocan
 *   nuestro código ni nuestro servidor.
 */
export function PaymentSection({
  locale,
  disabled,
  onExpressConfirm,
}: {
  locale: Locale;
  disabled: boolean;
  onExpressConfirm: (e: StripeExpressCheckoutElementConfirmEvent) => void;
}) {
  const [cardReady, setCardReady] = useState(false);
  const [express, setExpress] = useState(false);

  return (
    <div className="space-y-5">
      <div className={express ? '' : 'hidden'}>
        <p className="mb-3 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-slate-500">{CK.pay.express[locale]}</p>
        <ExpressCheckoutElement
          options={{
            buttonHeight: 48,
            buttonType: { applePay: 'buy', googlePay: 'buy' },
            layout: { maxColumns: 3, maxRows: 1, overflow: 'auto' },
          }}
          onReady={({ availablePaymentMethods }) => setExpress(!!availablePaymentMethods && Object.values(availablePaymentMethods).some(Boolean))}
          // La billetera devuelve la dirección de facturación: no hace falta pedirla en el formulario
          onClick={(e) => e.resolve({ billingAddressRequired: true })}
          onConfirm={onExpressConfirm}
        />
        <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.1em] text-slate-400" aria-hidden>
          <span className="h-px flex-1 bg-slate-200" />
          <span className="font-mono">{CK.pay.orCard[locale]}</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>
      </div>

      <div>
        {express && <p className="mb-3 text-sm font-medium text-slate-800">{CK.pay.card[locale]}</p>}
        <div className="relative min-h-[11rem]">
          {!cardReady && (
            <div className="absolute inset-0 grid place-items-center">
              <Spinner className="h-5 text-slate-400" />
            </div>
          )}
          <PaymentElement
            onReady={() => setCardReady(true)}
            options={{
              readOnly: disabled,
              layout: 'tabs',
              // Nombre, email y dirección ya los tenemos en el formulario (y el email es el de la cuenta)
              fields: { billingDetails: { name: 'never', email: 'never', address: 'never' } },
              // Las billeteras van arriba, en el Express Checkout
              wallets: { applePay: 'never', googlePay: 'never' },
              terms: { card: 'never' },
            }}
          />
        </div>
      </div>

      <p className="flex items-start gap-2 text-sm text-slate-600">
        <Lock size={15} className="mt-0.5 shrink-0 text-slate-400" aria-hidden />
        {CK.pay.stripeNote[locale]}
      </p>
    </div>
  );
}
