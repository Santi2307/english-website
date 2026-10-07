import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { CK } from '@/data/checkout';
import type { Locale } from '@/hooks/useLocale';
import type { BillingForm } from '@/hooks/useBillingForm';
import { POSTAL, REGION_REQUIRED, regionKind } from '@/lib/countries';
import { swap } from '@/lib/motion';
import { TextField } from './TextField';
import { CountrySelect } from './CountrySelect';
import { Step } from './Step';

/**
 * Dirección de facturación que se adapta al país: Province + Postal code en Canadá,
 * State + ZIP en EE. UU., Departamento en Colombia, County + Postcode en Reino Unido.
 */
export function BillingAddress({ form, locale }: { form: BillingForm; locale: Locale }) {
  const { billing } = form;
  const [showLine2, setShowLine2] = useState(() => !!billing.address2);
  const postal = POSTAL[billing.country];
  const regionRequired = REGION_REQUIRED.has(billing.country);
  const postalLabel = billing.country === 'US' ? CK.f.zip[locale] : billing.country === 'GB' ? CK.f.postcode[locale] : CK.f.postal[locale];

  return (
    <Step n={2} title={CK.steps.billing[locale]}>
      <div>
        <label htmlFor="country" className="mb-1.5 block text-sm font-medium text-slate-800">{CK.f.country[locale]}</label>
        <CountrySelect id="country" value={billing.country} onChange={(c) => form.setCountry(c.code)} locale={locale} />
      </div>
      <TextField id="address1" label={CK.f.address1[locale]} autoComplete="address-line1" placeholder={CK.f.address1Ph[locale]} required {...form.field('address1')} />
      <AnimatePresence initial={false} mode="wait">
        {showLine2 ? (
          <motion.div key="line2" {...swap}>
            <TextField id="address2" label={CK.f.address2[locale]} aside={CK.f.optional[locale]} autoComplete="address-line2" {...form.field('address2')} />
          </motion.div>
        ) : (
          <motion.button key="add" {...swap} type="button" onClick={() => setShowLine2(true)} className="-mt-1 flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900">
            <Plus size={14} aria-hidden /> {CK.f.addAddress2[locale]}
          </motion.button>
        )}
      </AnimatePresence>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="city" label={CK.f.city[locale]} autoComplete="address-level2" required {...form.field('city')} />
        <TextField
          id="region"
          label={CK.f.region[regionKind(billing.country)][locale]}
          aside={regionRequired ? undefined : CK.f.optional[locale]}
          autoComplete="address-level1"
          required={regionRequired}
          {...form.field('region')}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="postalCode"
          label={postalLabel}
          aside={postal?.required ? undefined : CK.f.optional[locale]}
          autoComplete="postal-code"
          inputMode={['US', 'CO', 'MX', 'ES'].includes(billing.country) ? 'numeric' : 'text'}
          autoCapitalize="characters"
          placeholder={postal?.example}
          required={!!postal?.required}
          {...form.field('postalCode')}
        />
      </div>
    </Step>
  );
}
