export enum PatronBadge {
  ONE = 'patron-1',
  TWO = 'patron-2',
  THREE = 'patron-3',
  FOURTH = 'patron-4',
}

export type PatronTier = 1 | 2 | 3 | 4;

export type PaymentDetails = {
  brand: string;
  expMonth: number;
  expYear: number;
  last4: string;
  name: string;
};
