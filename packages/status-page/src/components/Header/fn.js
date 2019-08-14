import { format } from 'date-fns';

export const isDown = up => up.find(service => service.down);
export const upPercent = up =>
  (up.filter(service => !service.down).length / up.length) * 100 + '%';
export const lastCheck = up =>
  format(up[0].last_check_at, 'MMMM Do YYYY[,] h:mA');
