import { CreditAddon, SandboxAddon } from './state';

export const CREDIT_ADDONS: CreditAddon[] = [
  {
    id: 'credits_500',
    type: 'credits',
    credits: 500,
    price: 9,
  },
  {
    id: 'credits_4000',
    type: 'credits',
    credits: 4000,
    price: 50,
    fullPrice: 72,
    discount: 30,
  },
  {
    id: 'credits_24000',
    type: 'credits',
    credits: 24000,
    price: 216,
    fullPrice: 432,
    discount: 50,
  },
];
export const SANDBOX_ADDONS: SandboxAddon[] = [
  {
    id: 'sandboxes_100',
    type: 'sandboxes',
    sandboxes: 100,
    price: 9,
  },
  {
    id: 'sandboxes_400',
    type: 'sandboxes',
    sandboxes: 400,
    price: 25,
    fullPrice: 36,
    discount: 30,
  },
  {
    id: 'sandboxes_1500',
    type: 'sandboxes',
    sandboxes: 1500,
    price: 68,
    fullPrice: 136,
    discount: 50,
  },
];
