'use client';

/* Package System */
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Chart from "chart.js/auto";

/* Package Application */
import AlertDialog from "@/components/common/alertDialog";
import LoadingChartSkeleton from "./_loadingComponents/loadingChart";

import { useAuth } from "@/contexts/auth.context";
import { getOrgRevenueChart } from "@/services/event.service";
import { RevenueSummaryResponse, RevenueChartProps } from "@/types/models/admin/revenueManagement.interface";

export default function RevenueChart({ type, from, to }: RevenueChartProps) {
  const t = useTranslations("common");
  const { session } = useAuth();

  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [chartData, setChartData] = useState<RevenueSummaryResponse | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);
        const res = await getOrgRevenueChart(session?.user?.accessToken || "", type, from, to);

        if (res.statusCode !== 200) {
          setAlertMessage(`${transWithFallback('errorWhenFetchChartData', 'Lỗi xảy ra khi lấy dữ liệu biểu đồ')}: ${res.message}`); setAlertOpen(true);
          return;
        }

        setChartData({ labels: res.data.map((item) => item.period), values: res.data.map((item) => item.actualRevenue * 1000) });
      } catch (error) {
        console.error('Error when fetch chart data:', error);
        setAlertMessage(`${transWithFallback('errorWhenFetchChartData', 'Lỗi xảy ra khi lấy dữ liệu biểu đồ')}: ${error}`);
        setAlertOpen(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchChartData();
  }, [type, from, to]);

  useEffect(() => {
    if (
      !chartRef.current ||
      !Array.isArray(chartData?.labels) ||
      !Array.isArray(chartData?.values) ||
      chartData.labels.length === 0 ||
      chartData.values.length === 0
    ) {
      return;
    }
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Destroy existing chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const lastIndex = chartData.values.length - 1;
    const pointBg = Array(chartData.values.length).fill("transparent");
    const pointBorder = Array(chartData.values.length).fill("transparent");
    const pointRadius = Array(chartData.values.length).fill(0);
    if (lastIndex >= 0) {
      pointBg[lastIndex] = "#4cd137";
      pointBorder[lastIndex] = "#fff";
      pointRadius[lastIndex] = 6;
    }

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: chartData.labels,
        datasets: [{
          label: "Doanh thu (Triệu đồng)",
          data: chartData.values,
          borderColor: "#0C4762",
          borderWidth: 4,
          tension: 0.4,
          fill: false,
          pointBackgroundColor: pointBg,
          pointBorderColor: pointBorder,
          pointRadius,
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });

    // Cleanup
    return () => {
      chartInstance.current?.destroy();
    };
  }, [chartData, chartRef]); // Also include chartRef

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  return (
    <>
      <div>
        <div className="text-lg font-medium mt-6">{transWithFallback('totalRevenue', 'Tổng doanh thu')} </div >
        <div className="relative border border-blue-100 rounded-lg p-4 h-[350px]">
          {isLoading ? (
            <LoadingChartSkeleton isLoading={isLoading} className="border border-blue-100 p-4" />
          ) : (
            <div className="relative border border-blue-100 rounded-lg p-4 h-[350px]">
              <canvas ref={chartRef} height={350}></canvas>
            </div>
          )}
        </div>
      </div >
      <AlertDialog
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
      />
    </>
  );
}