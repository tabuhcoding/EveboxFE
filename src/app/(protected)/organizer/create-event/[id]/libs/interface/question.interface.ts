"use client";
// FormList
export interface Form {
    id: number;
    name: string;
    createdBy: string | null; 
    FormInput: FormInput[];
}

export interface FormListProps {
    forms: Form[];
    selectedForm: number | null;
    handleSelectForm: (formId: number) => void;
}

// FormInputItem
export interface FormInput {
    id: number;
    fieldName: string;
    type: string;
    required?: boolean;
    regex?: string | null;
    options?: string[] | null;
}

export interface FormInputItemProps {
    input: FormInput;
    index: number;
}

// FormItem
export interface FormItemProps {
    form: Form;
    isExpanded: boolean;
    toggleExpand: (formId: number) => void;
    selectedForms: number | null;
    handleSelectForm: (formId: number) => void;
}