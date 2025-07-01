export interface ChatBoxWrapperProps {
  handleOpen: () => void;
}

export interface ChatBoxContent {
  id: number;
  context: string;
  message: string | null;
  rootId?: number | null;
  isBot?: boolean | null;
  route?: string;
  ResultMessage?: string;
  Result?: number[];

  Root?: ChatBoxContent | null;
  Child: ChatBoxContent[];
  PreviousResponseId?: string;
}

export interface ChatBoxContentApiResponse {
  result: ChatBoxContent;
}

export interface CreateContentResponseData {
  id: string;
}

export interface CreateContentResponse {
  result: CreateContentResponseData;
}

export interface NavigationPayload {
  query: string;
  privateKey: string;
  previousID?: string | null;
}

export interface NavigationApiResponse {
  Route: string;
  Message: string;
  NextPrompt?: string | null;
  PreviousResponseId?: string;
  EventIds?: number[];
}