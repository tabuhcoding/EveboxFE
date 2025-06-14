export interface OrgPaymentInfoData {
  id: string;
  organizerId: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  branch: string;
  businessType: number;
  fullName?: string;
  address?: string;
  taxCode?: string;
  createdAt: string;
  updatedAt: string;
}