export const getDaysUntil = (target: Date): number | null => {
  const now = new Date();

  if (now > target) {
    return null;
  }

  const dayInMiliseconds = 1000 * 3600 * 24;

  const nowOnlyDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetOnlyDay = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );

  return (targetOnlyDay.getTime() - nowOnlyDay.getTime()) / dayInMiliseconds;
};
