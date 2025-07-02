// import { GenerationProps } from "../../components/info-event/components/descriptionWithAI";
import { EventDescriptionGenDto } from "@/types/models/event/createEvent.dto";

export interface OrganizationInfoFormProps {
    logoOrg: string | null;
    nameOrg: string;
    infoOrg: string;
    handleUpload: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
    errors: { [key: string]: boolean };
    imageLogoErrors: { [key: string]: string };
}

export interface EventLocationInputProps {
    eventTypeSelected: string;
    eventAddress: string;
    province: string;
    district: string;
    ward: string;
    street: string;
    errors: { [key: string]: boolean };
    provinces: string[];
    districts: string[];
    createdLocations: {
        name: string;
        eventAddress: string;
        province: string;
        districtName: string;
        ward: string;
        street: string;
    }[]
    // wards: string[]; 
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
    handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>, field: string) => void;
    setEventTypeSelected: React.Dispatch<React.SetStateAction<string>>;
    updateGenerationForm: (field: keyof EventDescriptionGenDto, value: string | number | boolean | number[]) => void
}

export interface EventImageUploadProps {
    background: string | null;
    handleUpload: (event: React.ChangeEvent<HTMLInputElement>, type: string) => void;
    imageErrors: { logo?: string; background?: string };
    eventName: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
    errors: { eventName?: boolean };
}