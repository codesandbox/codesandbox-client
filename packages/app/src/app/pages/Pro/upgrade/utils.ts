import { useEffect, useState } from 'react';

export type WorkspaceType = 'pro' | 'team_pro';
export type Interval = 'month' | 'year';
type Price = { currency: string; unit_amount: number };
type Pricing = Record<WorkspaceType, Record<Interval, Price>>;

export const usePricing = (): Pricing | null => {
  const [data, setData] = useState<Pricing>(null);
  const fetchData = async () => {
    const BASE =
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

    try {
      const payload = await fetch(`${BASE}/api/v1/prices`).then(x => x.json());
      setData(payload);
    } catch {
      // setData({
      //   pro: {
      //     month: { currency: 'USD', unit_amount: 900 },
      //     year: { currency: 'USD', unit_amount: 8400 },
      //   },
      //   team_pro: {
      //     month: { currency: 'USD', unit_amount: 3000 },
      //     year: { currency: 'USD', unit_amount: 28800 },
      //   },
      // });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return data;
};

export const formatCurrent = ({ currency, unit_amount }: Price) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    currency,
  });
  return formatter.format(unit_amount / 100);
};

export const createCheckout = async ({
  team_id,
  recurring_interval,
}: Record<'team_id' | 'recurring_interval', string>) => {
  const devToken = localStorage.devJwt;

  try {
    const data = await fetch('/api/v1/checkout', {
      method: 'POST',
      body: JSON.stringify({
        success_path: '/checkout_success',
        cancel_path: '/checkout_failure',
        team_id,
        recurring_interval,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: devToken ? `Bearer ${devToken}` : undefined,
      },
    });

    const payload = await data.json();

    if (payload.stripe_checkout_url) {
      window.open(payload.stripe_checkout_url);
    } else {
      throw Error(payload);
    }
  } catch (err) {
    console.error(err);
  }
};
