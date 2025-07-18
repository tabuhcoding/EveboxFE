export interface EventMember {
  eventId: number;
  userId: string;
  email: string;
  role: number;
  role_desc: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface EventRoleItem {
  role: number;
  isEdited: boolean;
  isSummarized: boolean;
  viewVoucher: boolean;
  marketing: boolean;
  viewOrder: boolean;
  viewSeatmap: boolean;
  viewMember: boolean;
  checkin: boolean;
  checkout: boolean;
  redeem: boolean;
}

export interface AddEventMemberDto {
  email: string;
  role: number;
}

export interface AddEventMemberResponseDto {
  eventId: number;
  userId: string;
  email: string;
  role: number;
  role_desc: string;
  createdAt: string;
}

export interface UpdateEventMemberDto {
  email: string;
  role: number;
}

export interface UpdateEventMemberResponseDto {
  eventId: number;
  userId: string;
  email: string;
  role: number;
  role_desc: string;
  createdAt: Date;
}
