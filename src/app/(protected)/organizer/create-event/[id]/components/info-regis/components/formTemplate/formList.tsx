'use client'

import { useState } from "react";
import FormItem from "./formItem";
import { FormListProps } from "../../../../libs/interface/question.interface";

export default function FormList ({ forms, selectedForm: selectedForm, handleSelectForm } : FormListProps) {
    const [expandedForm, setExpandedForm] = useState<number | null>(null);

    const toggleExpand = (formId: number) => {
        setExpandedForm((prev) => (prev === formId ? null : formId));
    };

    return (
        <div>
            {forms.map((form) => (
                <FormItem
                    key={form.id}
                    form={form}
                    isExpanded={expandedForm === form.id}
                    toggleExpand={toggleExpand}
                    selectedForms={selectedForm}
                    handleSelectForm={handleSelectForm}
                />
            ))}
        </div>
    );
};