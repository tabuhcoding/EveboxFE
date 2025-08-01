"use client";

/* Package System */
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { CircularProgress } from "@mui/material";

/* Package Application */
import EventCard from "./eventCard";
import { EventOrgFrontDisplayDto } from "@/types/models/org/orgEvent.interface";
import { useAuth } from "@/contexts/auth.context";
import { getEventOfOrg } from "@/services/org.service";

interface TabsProps {
  eventss: EventOrgFrontDisplayDto[];
}

export default function Tabs({ eventss }: TabsProps) {
  const t = useTranslations("common");
  const [activeTab, setActiveTab] = useState("sap-toi");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingTab, setLoadingTab] = useState<string | null>(null);
  const [events, setEvents] = useState<EventOrgFrontDisplayDto[]>(eventss || []);
  const { session, user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      console.log("Fetching events with access token:", session.accessToken);
      console.log("User info:", user);
      const eventData = await getEventOfOrg(session.accessToken);

      if (eventData) {
        setEvents(eventData);
      } else {
        console.error("Failed to fetch events");
      }
    };
    fetchEvents();
  }, []);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith("common.")) return fallback;
    return msg;
  };

  const tabs = [
    { id: "sap-toi", label: transWithFallback("upcoming", "Sắp tới") },
    { id: "da-qua", label: transWithFallback("past", "Đã qua") },
    { id: "cho-duyet", label: transWithFallback("pendingApproval", "Chờ duyệt") },
  ];

  const handleTabClick = (tabId: string) => {
    setLoadingTab(tabId);
    setTimeout(() => {
      setActiveTab(tabId);
      setLoadingTab(null);
    }, 400);
  };


  // Tab filtering logic
  const tabFilteredEvents = events.filter((event) => {
    switch (activeTab) {
      case "cho-duyet":
        return event.isApproved === false;
      case "da-qua":
        return event.isApproved === true && !event.isHasShowingInFuture;
      case "sap-toi":
        return event.isApproved === true && event.isHasShowingInFuture;
      default:
        return false;
    }
  });

  // Search filter
  const filteredEvents = tabFilteredEvents.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <h1 className="text-2xl font-bold text-[#0C4762]">{transWithFallback("myEvents", "Sự kiện của tôi")}</h1>
      <div className="border-t-2 border-[#0C4762] mt-2"></div>

      <div>
        {/* Search bar and tabs */}
        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-1/3 bg-white">
            <input
              type="text"
              className="w-full px-3 py-2 outline-none"
              placeholder={transWithFallback("searchEvent", "Tìm kiếm sự kiện")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-[#51DACF] px-3 py-2 border-l border-gray-300 transition duration-200 hover:bg-[#3AB5A3]">
              <Search size={24} color="white" />
            </button>
          </div>
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-6 py-2 rounded-full ${activeTab === tab.id
                  ? "bg-[#0C4762] text-[#9EF5CF]"
                  : "bg-[#9EF5CF] text-gray-700"
                  }`}
                onClick={() => handleTabClick(tab.id)}
                disabled={loadingTab === tab.id}
              >
                {loadingTab === tab.id ? (
                  <CircularProgress size={16} sx={{ color: "[#51DACF]" }} className="mr-1" />
                ) : (
                  null
                )}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Events List */}
        <div className="mt-6 space-y-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <p className="text-center text-gray-500">
              {transWithFallback("noEvents", "Không có sự kiện nào.")}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
