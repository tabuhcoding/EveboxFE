'use client';

/* Package System */
import { Fragment } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { CircularProgress } from "@mui/material";

/* Package Application */
import { RevenueOrgTableProps } from "@/types/models/admin/revenueManagement.interface";

import EventRevenueTable from "../revenueEventTable";

export default function RevenueOrgTable({
  loading: propLoading,
  organizations: propOrganizations,
  appId = 0,
  toggleOrganization: propToggleOrganization,
  toggleEvent: propToggleEvent,
  toggleEventDetail: propToggleEventDetail,
  formatCurrency,
  className = "",
  orgLoadingId,
}: RevenueOrgTableProps) {
  const t = useTranslations("common");
  const router = useRouter();

  const organizations = propOrganizations;

  const handleToggleOrganization = (orgId: string) => {
    if (orgLoadingId === orgId) return;
    if (propToggleOrganization) {
      propToggleOrganization(appId, orgId);
    }
  };

  const handleToggleEvent = (orgId: string, eventId: number) => {
    if (propToggleEvent) {
      propToggleEvent(appId, orgId, eventId);
    }
  };

  const handleToggleEventDetail = (orgId: string, eventId: number, detailId: string) => {
    if (propToggleEventDetail) {
      propToggleEventDetail(appId, orgId, eventId, detailId);
    }
  }

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  }

  if (propLoading) {
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
    <div className={className}>
      {!propOrganizations && (
        <div className="flex justify-end mb-4">
          <button className="bg-[#0C4762] text-white px-4 py-2 rounded-md hover:bg-[#51DACF] transition-colors">
            {transWithFallback('exportReport', 'Xuất báo cáo')}
          </button>
        </div>
      )}

      <div className={!propOrganizations ? "overflow-hidden rounded-lg border border-gray-200" : ""}>
        <table className="w-full text-sm">
          <thead>
            <tr className={propOrganizations ? "bg-[#41AEA9]" : "bg-[#0C4762] text-white"}>
              <th className="py-2 px-4 text-left w-16">{transWithFallback('noStt', 'STT')}</th>
              <th className="py-2 px-4 text-left">{transWithFallback('orgName', 'Tên nhà tổ chức')}</th>
              <th className="py-2 px-4 text-left" colSpan={2}>{transWithFallback('actualRevenue', 'Doanh thu thực nhận')}</th>
              <th className="py-2 px-4 text-center">{transWithFallback('viewDetail', 'Xem chi tiết')}</th>
            </tr>
          </thead>
          <tbody>
            {organizations?.map((org, index) => (
              <Fragment key={`org-${appId}-${org.id}`}>
                <tr className="cursor-pointer hover:bg-[#E3FEF7]" onClick={() => handleToggleOrganization(org.id)}>
                  <td className="py-2 px-4 border-t flex items-center">
                    {orgLoadingId === org.id ? (
                      <CircularProgress size={16} className="mr-1 text-blue-600" />
                    ) : org.isExpanded ? (
                      <ChevronDown className="w-4 h-4 mr-1" />
                    ) : (
                      <ChevronRight className="w-4 h-4 mr-1" />
                    )}
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-t">{org.name}</td>
                  <td className="py-2 px-4 border-t" colSpan={2}>{formatCurrency(org.actualRevenue)}</td>
                  <td className="py-2 px-4 border-t text-center">
                    <button
                      className="inline-flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        localStorage.setItem("selectedOrg", JSON.stringify(org));
                        localStorage.setItem("appRevenue", JSON.stringify(organizations));
                        router.push(`/admin/revenue-management/revenue/${org.id}`);
                      }}
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </td>
                </tr>

                {org.isExpanded && (
                  <tr>
                    <td colSpan={5} className="p-0">
                      {orgLoadingId === org.id ? (
                        <div className="flex p-4 items-center justify-center">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0C4762] mx-auto" />
                            <p className="mt-2 text-[#0C4762] text-sm">
                              {transWithFallback("loadingData", "Đang tải dữ liệu...")}
                            </p>
                          </div>
                        </div>
                      ) : (
                        org.events.length > 0 && (
                          <div className="ml-4">
                            <EventRevenueTable
                              loading={propLoading}
                              events={org.events}
                              orgId={org.id}
                              toggleEvent={handleToggleEvent}
                              toggleEventDetail={handleToggleEventDetail}
                              formatCurrency={formatCurrency}
                              className="mt-0"
                            />
                          </div>
                        )
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
