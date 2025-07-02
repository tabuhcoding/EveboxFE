import { BaseApiResponse } from "@/types/baseApiResponse";

export interface Venue {
  name: string;
  taxLocations: string[];
  events: string[];
  organizers: string[];
}

export interface Location {
  id: number;
  email: string;
  venues: Venue[];
}

export interface LocationTableProps {
  locations: Location[]
}

export interface District {
  id: number;
  name: string;
}

export interface ProvinceManagement {
  id: number;
  name: string;
  districts: District[];
}

export interface EventDetail {
  title: string;
  venue: string;
  orgName: string;
}

export interface VenueOrg {
  street: string;
  ward: string;
  district: string;
  province: string;
  event: EventDetail;
}

export interface OrganizerLocationGroup {
  id: number;
  organizerId: string;
  venues: VenueOrg[];
}

export interface GetAllLocationsResponseDto extends BaseApiResponse {
  data: OrganizerLocationGroup[];
}

export interface FilterDropdownProps {
  label: string
  options: string[]
  value: string | null
  onChange: (value: string | null) => void
}