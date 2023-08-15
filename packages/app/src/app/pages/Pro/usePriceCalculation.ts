import { formatCurrency } from 'app/utils/currency';
import { useAppState } from 'app/overmind';
import { useCurrencyFromTimeZone } from 'app/hooks/useCurrencyFromTimeZone';

type PriceCalculationParams = {
  plan?: 'team' | 'individual'; // team - new pro, individual - legacy personal pro
  billingPeriod?: 'year' | 'month';
  maxSeats?: number;
};

const DEFAULT_PARAMS = {
  plan: 'team' as const,
  billingPeriod: 'year' as const,
  maxSeats: null,
};

export const usePriceCalculation = (
  params: PriceCalculationParams = DEFAULT_PARAMS
): string | undefined => {
  const { billingPeriod, plan, maxSeats } = { ...DEFAULT_PARAMS, ...params };

  const { pro } = useAppState();
  const currency = useCurrencyFromTimeZone();

  const proPrices = pro?.prices?.[plan];

  if (!proPrices) {
    return undefined;
  }

  let priceTiersInCurrency = proPrices[billingPeriod]?.[currency.toLowerCase()];
  let priceCurrency = currency;

  if (!priceTiersInCurrency) {
    priceTiersInCurrency = proPrices[billingPeriod].usd;
    priceCurrency = 'USD';
  }

  const priceTier =
    priceTiersInCurrency.find(pt => pt.upTo === maxSeats) ||
    priceTiersInCurrency[0]; // Fallback, shouldn't happen;

  // Divide by 12 if the period is year to get monthly price for yearly
  // subscriptions
  const price =
    billingPeriod === 'year' ? priceTier.unitAmount / 12 : priceTier.unitAmount;

  // The formatCurrency function will divide the amount by 100
  return formatCurrency({
    currency: priceCurrency,
    amount: price,
  });
};
