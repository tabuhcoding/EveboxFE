'use client';

import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useTranslations } from 'next-intl';
import { IRevenueChartData } from '@/types/models/org/orgEvent.interface';

interface RevenueChartProps {
  data: IRevenueChartData[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const t = useTranslations('common');
  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return msg.startsWith('common.') ? fallback : msg;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h3 className="text-lg font-bold text-[#0C4762] mb-4">
        {transWithFallback('revenueAndTicketsOverTime', 'Doanh thu & vé theo thời gian')}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#0C4762" name="Doanh thu" strokeWidth={2} />
          <Line yAxisId="right" type="monotone" dataKey="ticketsSold" stroke="#51DACF" name="Số vé" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
