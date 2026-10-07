import { CK } from '@/data/checkout';
import type { Locale } from '@/hooks/useLocale';
import type { BillingForm } from '@/hooks/useBillingForm';
import { TextField } from './TextField';
import { Step } from './Step';

/** Nombre y email. El email es el de la cuenta y no se edita: la compra pertenece a este usuario. */
export function CustomerInformation({ form, email, locale }: { form: BillingForm; email: string; locale: Locale }) {
  return (
    <Step n={1} title={CK.steps.contact[locale]}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="firstName" label={CK.f.firstName[locale]} autoComplete="given-name" required {...form.field('firstName')} />
        <TextField id="lastName" label={CK.f.lastName[locale]} autoComplete="family-name" required {...form.field('lastName')} />
      </div>
      <TextField id="email" label={CK.f.email[locale]} type="email" autoComplete="email" value={email} readOnly disabled hint={CK.f.emailHint[locale]} />
    </Step>
  );
}
