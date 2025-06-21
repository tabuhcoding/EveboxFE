export interface FormInputDto {
  id: number;
  fieldName: string;
  type: string;
  required: boolean;
  regex?: string;
  options?: any;
}

export interface BasicFormDto {
  id: number;
  name: string;
  createdBy: string;
  FormInput: FormInputDto[];
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