"use client";

import { useTranslations } from "next-intl";

interface OverviewCardProps {
  totalRevenue: number;
  ticketsSold: number;
  totalTickets: number;
  percentageSold: number;
}

function PercentageCircle({ percentage }: { percentage: number }) {
  const radius = 30;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
      <circle
        stroke="#E5E7EB" // background (gray-200)
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#14B8A6" // teal-500
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease' }}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        fill="#0F766E"
        fontSize="14"
        fontWeight="bold"
        className="rotate-[90deg]" // undo the -90 rotation
      >
        {percentage}%
      </text>
    </svg>
  );
}

export const OverviewCard = ({
  totalRevenue,
  ticketsSold,
  totalTickets,
  percentageSold,
}: OverviewCardProps) => {
  const t = useTranslations("common");
    const transWithFallback = (key: string, fallback: string) => {
      const msg = t(key);
      return msg.startsWith("common.") ? fallback : msg;
    };
  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold text-[#0C4762] mb-2"> {transWithFallback("overview", "Tổng quan")}</h3>
      <div className="flex shadow-lg">

        {/* Card for Total Revenue */}
        <div className="bg-[#0C4762] text-white p-6 flex-1 flex items-center gap-4 rounded-l-lg">
          <div>
            <p className="text-sm">{transWithFallback("revenue", "Doanh thu")} </p>
            <h2 className="text-2xl font-bold">{totalRevenue.toLocaleString()} Đ</h2>
            <p className="text-xs">{transWithFallback("total", "Tổng")}: {totalRevenue.toLocaleString()} đ</p>
          </div>
        </div>

        {/* Card for Ticket Sales */}
        <div className="bg-[#387478] text-white p-6 flex-1 flex items-center gap-4 rounded-lg -ml-4 justify-end">
          <div>
            <p className="text-sm text-white text-right">{transWithFallback("soldTickets", "Số vé đã bán")}</p>
            <h2 className="text-2xl font-bold text-white text-right">{ticketsSold} vé</h2>
            <p className="text-xs text-white text-right">{transWithFallback("total", "Tổng")}: {totalTickets} vé</p>
          </div>
          <div className="flex flex-col items-center">
  <PercentageCircle percentage={percentageSold} />
  <p className="text-sm mt-2 text-light-600">Đã bán</p>
</div>
        </div>

      </div>
    </div>
  );
};


