export interface BasicFormDto {
  id: number;
  name: string;
  createdBy: string;
}

export interface GetAllFormForOrgResponseDto {
  forms: BasicFormDto[];
}

export interface ConnectFormDto {
  showingId: string;
  formId: number;
}

export interface ConnectFormResponseData {
  showingId: string;
  formId: number;
}

export interface ConnectFormResponseDto {
  data: ConnectFormResponseData;
}