type Price = { currency: string; amount: number };

/**
 * This function isn't fool proof. We're using it mainly for the INR currency. The
 * EUR currency is only used for Paddle subscriptions.
 */
const getLocaleFromCurrency = (currency: string) => {
  if (currency === 'INR') {
    return 'hi-IN';
  }

  if (currency === 'EUR') {
    // The nl-NL locale isn't right for every country, but it's the simplest solution
    // for now. For example, en-DE adds the euro symbol to the end of the amount.
    return 'nl-NL';
  }

  return 'en-US';
};

export const formatCurrency = ({ currency, amount }: Price) => {
  const isRounded = amount % 100 === 0;

  const locale = getLocaleFromCurrency(currency);

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    maximumFractionDigits: isRounded ? 0 : 2,
    currency,
  });

  return formatter.format(amount / 100);
};
