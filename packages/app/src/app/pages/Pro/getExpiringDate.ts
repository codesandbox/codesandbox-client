import { addMonths, format } from 'date-fns';

export const getUserExpiringDate = ({
  since,
  duration,
}: {
  since: string;
  duration: 'yearly' | 'monthly';
}) => {
  if (duration === 'yearly') return format(new Date(since), 'do MMM');

  const day = parseInt(format(new Date(since), 'do'), 10);
  const currentDay = parseInt(format(new Date(), 'do'), 10);

  if (day === currentDay) return 'today';

  if (day > currentDay) return `${day} ${format(new Date(), 'MMM')}`;

  return `${day} ${format(addMonths(new Date(), 1), 'MMM')}`;
};
