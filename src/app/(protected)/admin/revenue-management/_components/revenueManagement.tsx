'use client';

/* Package System */
import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";

/* Package Application */
import { useAuth } from "@/contexts/auth.context";
import { getOrganizerRevenue } from "@/services/event.service";
import { AppRevenue, ShowingRevenueInEventTable, EventRevenueInEventTable, TicketTypeRevenueData, Organization } from "@/types/models/admin/revenueManagement.interface";

import AlertDialog from "@/components/common/alertDialog";
import RevenueTabs from "./revenueTabs";
import RevenueAppTable from "./app/revenueAppTable";
import RevenueOrgTable from "./org/revenueOrgTable";
import EventRevenueTable from "./revenueEventTable";
import RevenueChart from "./app/revenueChart";
import RevenueFilter from "./app/revenueFilter";
import Filter from "./filter";
import RevenueSubTabs from "./app/revenueSubTabs";
import LocationRevenueView from "./app/locationRevenue";
import TicketPriceRevenueView from "./app/ticketPriceRevenue";
import { HttpStatusCode } from "axios";
import EventPagination from "../../event-management/_components/common/pagination";


export default function RevenueManagementPage() {
  const t = useTranslations('common');
  const { session } = useAuth();

  const [activeTab, setActiveTab] = useState<"app" | "organization" | "event">("app")
  const [activeSubTab, setActiveSubTab] = useState<"day" | "location" | "price">("day")
  const [fromDate, setFromDate] = useState<string | undefined>();
  const [toDate, setToDate] = useState<string | undefined>();
  const [search, setSearch] = useState<string | undefined>();

  const [itemsPerPage, setItemsPerPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [appRevenues, setAppRevenues] = useState<AppRevenue[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    // Reset filters when switching tabs
    setFromDate(undefined);
    setToDate(undefined);
    setSearch(undefined);
    if (activeTab === "app") {
      setItemsPerPage(0);
      setCurrentPage(0);
      setActiveSubTab("day");
    } else {
      setItemsPerPage(10);
      setCurrentPage(1);
    }
  }, [activeTab]);

  const fetchAppRevenue = useCallback(async () => {
    if (!session?.user?.accessToken) return;

    try {
      setLoading(true);
      const response = await getOrganizerRevenue(session.user.accessToken, currentPage, itemsPerPage, fromDate, toDate, search);

      if (response.statusCode === HttpStatusCode.Ok) {
        if (response.data.length > 0) {
          const organizations = response.data.map((org): AppRevenue["organizations"][0] => ({
            id: org.orgId,
            name: org.organizerName,
            actualRevenue: org.actualRevenue * 1000,
            events: org.events.map((event): EventRevenueInEventTable => ({
              id: event.eventId,
              name: event.eventName,
              totalRevenue: event.totalRevenue * 1000,
              platformFee: event.platformFeePercent,
              actualRevenue: event.actualRevenue * 1000,
              isExpanded: false,
              showings: event.showings.map((show): ShowingRevenueInEventTable => ({
                showingId: show.showingId,
                startDate: show.startDate,
                endDate: show.endDate,
                revenue: show.revenue * 1000,
                isExpanded: false,
                ticketTypes: show.ticketTypes.map((ticket): TicketTypeRevenueData => ({
                  ticketTypeId: ticket.ticketTypeId,
                  name: ticket.name,
                  price: ticket.price,
                  sold: ticket.sold,
                  revenue: ticket.revenue * 1000,
                })),
              })),
            })),
          }));

          const app: AppRevenue = {
            id: 1,
            totalRevenue: response.data.reduce((sum, org) => sum + org.totalRevenue, 0) * 1000,
            systemDiscount: response.data[0].platformFeePercent ?? 10,
            actualRevenue: response.data.reduce((sum, org) => sum + org.totalRevenue, 0) * 1000 * response.data[0].platformFeePercent || 10,
            isExpanded: true,
            organizations,
          };

          setAppRevenues([app]);
          setTotalItems(response.pagination?.totalItems || 0);
          setTotalPages(response.pagination?.totalPages || 0);
        } else {
          setAppRevenues([]);
          setTotalItems(response.pagination?.totalItems || 0);
          setTotalPages(response.pagination?.totalPages || 0);
        }
      } else {
        setAppRevenues([]);
        setAlertMessage(`${transWithFallback('errorWhenFetchRevenue', 'Lỗi xảy ra khi lấy dữ liệu doanh thu')}`);
        setAlertOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch organizer revenue", error);
      setAppRevenues([]);
      setAlertMessage(`${transWithFallback('errorWhenFetchRevenue', 'Lỗi xảy ra khi lấy dữ liệu doanh thu')}: ${error}`);
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, fromDate, toDate, search]);

  useEffect(() => {
    fetchAppRevenue();
  }, [fetchAppRevenue, activeTab]);

  const [filter, setFilter] = useState<{
    type: "month" | "year"
    from: string
    to: string
  }>({
    type: "month",
    from: "",
    to: ""
  });

  const handleConfirm = (from?: string, to?: string, type?: "month" | "year") => {
    setFromDate(from);
    setToDate(to);
    setFilter({
      type: type ?? "month",
      from: from ?? "",
      to: to ?? "",
    });
  };

  const handleReset = () => {
    setFilter({ type: "month", from: "", to: "" });
  };

  const allOrgs: Organization[] = useMemo(() => {
    if (!appRevenues.length) return [];

    return appRevenues?.[0]?.organizations
      ?? [];
  }, [appRevenues]);

  const allEvents: EventRevenueInEventTable[] = useMemo(() => {
    if (!appRevenues.length) return [];

    return appRevenues?.[0]?.organizations?.flatMap((org) =>
      org.events.map((event) => ({
        ...event,
        orgId: org.id,
        orgName: org.name,
      }))
    ) ?? [];
  }, [appRevenues]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount)
  }

  const renderAppContent = () => {
    switch (activeSubTab) {
      case "day":
        return (
          <>
            <RevenueFilter onConfirm={handleConfirm} onReset={handleReset} isLoading={loading} />
            <RevenueAppTable
              fromDate={fromDate}
              toDate={toDate}
              appRevenues={appRevenues}
              setAppRevenues={setAppRevenues}
              loading={loading}
              setLoading={setLoading}
            />
            {!loading && appRevenues.length > 0 && (
              <RevenueChart type={filter.type} from={filter.from} to={filter.to} />
            )}
          </>
        )
      case "location":
        return (
          <>
            <LocationRevenueView />
          </>
        )
      case "price":
        return (
          <>
            <TicketPriceRevenueView />
          </>
        )
    }
  }

  const toggleOrganization = (appId: number, orgId: string) => {
    setAppRevenues((prev) =>
      prev.map((app): AppRevenue => {
        if (app.id === appId) {
          return {
            ...app,
            selectedOrgId: orgId,
            organizations: app.organizations.map((org) =>
              org.id === orgId
                ? { ...org, isExpanded: !org.isExpanded }
                : org
            ),
          };
        }
        return app;
      })
    );
  };


  const toggleEvent = (appId: number, orgId: string, eventId: number) => {
    if (!appId) return;

    setAppRevenues((prev) =>
      prev.map((app) => ({
        ...app,
        organizations: app.organizations.map((org) =>
          org.id === orgId
            ? {
              ...org,
              events: org.events.map((ev) =>
                ev.id === eventId
                  ? { ...ev, isExpanded: !ev.isExpanded }
                  : ev
              ),
            }
            : org
        ),
      }))
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

  const handleToggleEvent = (orgId: string, eventId: number) => {
    const appId = appRevenues[0]?.id;
    if (!appId) return;
    toggleEvent(appId, orgId, eventId);
  };

  const handleToggleEventDetail = (orgId: string, eventId: number, showingId: string) => {
    const appId = appRevenues[0]?.id;
    if (!appId) return;
    toggleEventDetail(appId, orgId, eventId, showingId);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#0C4762]">{transWithFallback("revenueManagement", "Quản lý doanh thu")}</h1>
          <p className="text-gray-700">{transWithFallback("revenueManagementNote", "Quản lý doanh thu của ứng dụng, nhà tổ chức và sự kiện")}</p>
          <div className="h-0.5 w-full bg-[#0C4762] mt-4"></div>
        </div>
        <div className="mt-6">
          <RevenueTabs activeTab={activeTab} onTabChange={setActiveTab} loading={loading} />
        </div>

        {activeTab === "app" && (
          <div className="mt-4">
            <RevenueSubTabs activeSubTab={activeSubTab} onSubTabChange={setActiveSubTab} />
            {renderAppContent()}
          </div>
        )}
        {activeTab === "organization" && (
          <>
            <Filter
              key={activeTab}
              onFilterChange={(f) => {
                setFromDate(f.fromDate);
                setToDate(f.toDate);
                setSearch(f.search);
              }}
              isLoading = {loading} />
            <RevenueOrgTable
              loading={loading}
              organizations={allOrgs}
              appId={appRevenues[0]?.id ?? ""}
              toggleOrganization={toggleOrganization}
              toggleEvent={toggleEvent}
              toggleEventDetail={toggleEventDetail}
              formatCurrency={formatCurrency}
            />

            <EventPagination
              currentPage={currentPage}
              totalItems={totalItems}
              eventsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              setEventsPerPage={(num) => {
                setItemsPerPage(num);
                setCurrentPage(1); // Reset to first page when items per page changes
              }}
            />
          </>
        )}
        {activeTab === "event" && (
          <>
            <Filter
              key={activeTab}
              onFilterChange={(f) => {
                setFromDate(f.fromDate);
                setToDate(f.toDate);
                setSearch(f.search);
              }} 
              isLoading = {loading} />
            <EventRevenueTable
              loading={loading}
              formatCurrency={formatCurrency}
              toggleEvent={handleToggleEvent}
              toggleEventDetail={handleToggleEventDetail}
              events={allEvents}
              orgId={appRevenues[0]?.organizations[0]?.id || ""}
            />
          </>
        )}
      </div>
      <AlertDialog
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
      />
    </>
  )
}