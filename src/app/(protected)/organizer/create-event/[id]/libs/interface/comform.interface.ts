export interface CustomRadioButtonProps {
    value: string;
    selectedValue: string;
    onChange: (value: string) => void;
    label: string;
}

export interface DateTimePickerProps {
    label: string;
    selectedDate: Date | null;
    setSelectedDate: (date: Date | null) => void;
    popperPlacement?: "bottom-start" | "bottom-end";
    required?: boolean;
    validateDate?: (date: Date | null) => boolean;
}

export interface ImageUploadProps {
    image: string | null;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholderText: string;
    dimensions: string;
    height: string;
    error?: string;
}

export interface InputFieldProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
    maxLength?: number;
    required?: boolean;
}

export interface InputItemProps {
    value: string;
    checked: boolean;
    onChange: (value: string) => void;
    onToggle: () => void; 
    onDelete: () => void;
}

export interface RadioOptionProps {
    value: string;
    selectedValue: string;
    onChange: (value: string) => void;
    icon?: React.ReactNode;
    title: string;
    description: string;
}

export interface SelectFieldProps {
  label: string;
  options: (string | { en: string; vi: string })[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: boolean;
  required?: boolean;
}

interface EventCategory {
    id: number;
    name: string;
}

export interface SelectEventCategoryProps {
    label: string;
    options: EventCategory[];
    value: EventCategory | null;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: boolean;
    required?: boolean;
}