export const useCurrencyFromTimeZone = () => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (timeZone === 'Asia/Kolkata' || timeZone === 'Asia/Calcutta') {
    return 'INR';
  }

  return 'USD';
};
