import { EventProps, TicketType, SelectedTicketsState } from "./seatmap.interface";
import { RedisInfo } from "../redisSeat";

export interface IFormInput {
  id: number;
  formId: number;
  fieldName: string;
  type: string;
  required: boolean;
  regex: string | null;
  options: { optionText: string }[] | null;
}

export interface IForm {
  id: number;
  name: string;
  FormInput: IFormInput[];
}

export interface QuestionListProps {
  formInputs: IFormInput[];
  onValidationChange: (isValid: boolean) => void;
  onFormChange: (answers: { [formInputId: number]: string }) => void;
  isLoadingForm?: boolean;
  onRequiredFilledChange: (allRequiredFilled: boolean) => void; // New prop
}

// Props mới: nhận selectedTickets và mảng ticketType
export interface TicketInformationProps {
  event: EventProps | null;
  totalTickets: number;
  totalAmount: number;
  isFormValid: boolean;
  selectedTickets: SelectedTicketsState;  // {[ticketTypeId]: {quantity, seatIds, sectionId}}
  ticketType: TicketType[];              // danh sách loại vé để lookup thông tin
  formData: { [formInputId: number]: string };
  formId: number | null;
  showingId?: string;
  redisInfo: RedisInfo | null;
  seatMapId?: number;
}

export interface AnswersFormData {
  formInputId: number;
  value: string;
}

export interface AnswersFormPayload {
  formId: number;
  showingId: string;
  answers: AnswersFormData[];
}

export interface AnswerFormResponseData {
  id: number;
  formInputId: number;
  value: string;
}

export interface AnswerFormRespone {
  formResponseId: number;
  answers: AnswerFormResponseData[];
}