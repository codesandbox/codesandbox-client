type Price = { currency: string; amount: number };

export const formatCurrency = ({ currency, amount }: Price) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    currency,
  });
  return formatter.format(amount / 100);
};
