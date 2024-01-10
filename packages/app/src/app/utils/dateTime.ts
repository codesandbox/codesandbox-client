export const getDaysUntil = (target: string | null): number | null => {
  if (!target) {
    return null;
  }

  const now = new Date();
  const targetDate = new Date(target);

  if (now > targetDate) {
    return null;
  }

  const dayInMiliseconds = 1000 * 3600 * 24;

  const nowOnlyDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetOnlyDay = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );

  return Math.floor(
    (targetOnlyDay.getTime() - nowOnlyDay.getTime()) / dayInMiliseconds
  );
};
