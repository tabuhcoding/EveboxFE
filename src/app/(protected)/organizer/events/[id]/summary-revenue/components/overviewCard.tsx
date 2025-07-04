"use client";

interface OverviewCardProps {
  totalRevenue: number;
  ticketsSold: number;
  totalTickets: number;
  percentageSold: number;
}

export const OverviewCard = ({
  totalRevenue,
  ticketsSold,
  totalTickets,
  percentageSold,
}: OverviewCardProps) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold text-[#0C4762] mb-2">Tổng quan</h3>
      <div className="flex shadow-lg">

        {/* Card for Total Revenue */}
        <div className="bg-[#0C4762] text-white p-6 flex-1 flex items-center gap-4 rounded-l-lg">
          <div className="w-16 h-16 bg-teal-300 rounded-full flex items-center justify-center text-blue-900 font-bold">
            {percentageSold}%
          </div>
          <div>
            <p className="text-sm">Doanh thu</p>
            <h2 className="text-2xl font-bold">{totalRevenue.toLocaleString()} Đ</h2>
            <p className="text-xs">Tổng: {totalRevenue.toLocaleString()} đ</p>
          </div>
        </div>

        {/* Card for Ticket Sales */}
        <div className="bg-[#387478] text-white p-6 flex-1 flex items-center gap-4 rounded-lg -ml-4 justify-end">
          <div>
            <p className="text-sm text-white text-right">Số vé đã bán</p>
            <h2 className="text-2xl font-bold text-white text-right">{ticketsSold} vé</h2>
            <p className="text-xs text-white text-right">Tổng: {totalTickets} vé</p>
          </div>
          <div className="w-16 h-16 bg-teal-300 rounded-full flex items-center justify-center text-teal-900 font-bold">
            {percentageSold}%
          </div>
        </div>

      </div>
    </div>
  );
};


