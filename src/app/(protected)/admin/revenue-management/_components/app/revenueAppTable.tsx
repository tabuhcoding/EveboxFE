'use client';

/* Package System */
import { Fragment } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

/* Package Application */
import RevenueOrgTable from "../org/revenueOrgTable";
import { RevenueAppTableProps } from "@/types/models/admin/revenueManagement.interface";

export default function RevenueAppTable({
  appRevenues,
  setAppRevenues,
  loading,
  toggleOrganization,
  orgLoadingId,
}: RevenueAppTableProps) {
  const t = useTranslations("common");

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount)
  }
  const toggleAppRevenue = (appId: number) => {
    setAppRevenues((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return { ...app, isExpanded: !app.isExpanded }
        }
        return app
      }),
    )
  }

  const toggleEvent = (appId: number, orgId: string, eventId: number) => {
    setAppRevenues((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            organizations: app.organizations.map((org) => {
              if (org.id === orgId) {
                return {
                  ...org,
                  selectedEventId: eventId,
                  events: org.events.map((ev) =>
                    ev.id === eventId
                      ? { ...ev, isExpanded: !ev.isExpanded }
                      : ev
                  ),
                };
              }
              return org;
            }),
          };
        }
        return app;
      })
    );
  };

  const toggleEventDetail = (
    appId: number,
    orgId: string,
    eventId: number,
    showingId: string
  ) => {
    setAppRevenues((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            organizations: app.organizations.map((org) => {
              if (org.id === orgId) {
                return {
                  ...org,
                  events: org.events.map((ev) => {
                    if (ev.id === eventId) {
                      return {
                        ...ev,
                        selectedDetailId: showingId,
                        showings: ev.showings.map((show) =>
                          show.showingId === showingId
                            ? { ...show, isExpanded: !show.isExpanded }
                            : show
                        ),
                      };
                    }
                    return ev;
                  }),
                };
              }
              return org;
            }),
          };
        }
        return app;
      })
    );
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 md-64 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C4762] mx-auto"></div>
          <p className="mt-4 text-[#0C4762]">{transWithFallback("loadingData", "Đang tải dữ liệu...")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex justify-end mb-4">
        <button className="bg-[#0C4762] text-white px-4 py-2 rounded-md hover:bg-[#51DACF] transition-colors">
          {transWithFallback('exportReport', 'Xuất báo cáo')}
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0C4762] text-white">
              <th className="py-3 px-4 text-left w-16">{transWithFallback('noStt', 'STT')}</th>
              <th className="py-3 px-4 text-left">{transWithFallback('totalRevenue', 'Tổng doanh thu')}</th>
              <th className="py-3 px-4 text-left">{transWithFallback('systemDiscount', 'Chiết khấu hệ thống')}</th>
              <th className="py-3 px-4 text-left">{transWithFallback('actualRevenue', 'Doanh thu thực nhận')}</th>
            </tr>
          </thead>
          <tbody>
            {appRevenues.map((app) => (
              <Fragment key={`app-${app.id}`}>
                <tr className="cursor-pointer hover:bg-[#E8FFFF]" onClick={() => toggleAppRevenue(app.id)}>
                  <td className="py-3 px-4 border-t flex items-center">
                    {app.isExpanded ? (
                      <ChevronDown className="w-4 h-4 mr-1" />
                    ) : (
                      <ChevronRight className="w-4 h-4 mr-1" />
                    )}
                    {app.id}
                  </td>
                  <td className="py-3 px-4 border-t">{formatCurrency(app.actualRevenue)}</td>
                  <td className="py-3 px-4 border-t">{app.systemDiscount}%</td>
                  <td className="py-3 px-4 border-t">{formatCurrency(app.totalRevenue)}</td>
                </tr>

                {app.isExpanded && app.organizations.length > 0 && (
                  <tr>
                    <td colSpan={4} className="p-0">
                      <div className="ml-4">
                        <RevenueOrgTable
                          loading={loading}
                          organizations={app.organizations}
                          appId={app.id}
                          toggleOrganization={toggleOrganization}
                          toggleEvent={toggleEvent}
                          toggleEventDetail={toggleEventDetail}
                          formatCurrency={formatCurrency}
                          orgLoadingId={orgLoadingId}
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}