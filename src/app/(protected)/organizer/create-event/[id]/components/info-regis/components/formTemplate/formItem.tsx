'use client'

/* Package System */
import { Equal } from "lucide-react";
import { useTranslations } from 'next-intl';

/* Package Application */
import FormInputItem from "./formInputItem";
import { FormItemProps } from "../../../../libs/interface/question.interface";

export default function FormItem({ form, isExpanded, toggleExpand, selectedForms, handleSelectForm }: FormItemProps) {
    const t = useTranslations('common');

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

    return (
        <div key={form.id} className="p-6 lg:p-8 rounded-lg shadow-sm w-full max-w-5xl mx-auto mt-3 mb-6" style={{ backgroundColor: "rgba(158, 245, 207, 0.2)", border: "1.5px solid #9EF5CF" }}>
            <div className="flex items-center justify-between w-full mb-2">
                <div className="flex items-center">
                    <Equal className="text-[#51DACF]" onClick={() => toggleExpand(form.id)} />
                    <div className="ml-2">
                        <label className="text-base font-bold">{form.name}</label>
                    </div>
                </div>
                <input
                    type="checkbox"
                    className="w-4 h-4 accent-blue-500 mr-2 text-right"
                    checked={selectedForms === form.id}
                    onChange={() => handleSelectForm(form.id)}
                />
            </div>

            {!isExpanded && (
                <div className="flex items-center w-full ml-4">
                    <span className="text-sm ml-4">{form.FormInput.length} {transWithFallback("quesTitle", "Câu hỏi")}</span>
                </div>
            )}

            {isExpanded && (
                <div>
                    {form.FormInput.map((input, index) => (
                        <FormInputItem key={`form-${form.id}-input-${index}`} input={input} index={index} />
                    ))}
                </div>
            )}
        </div>
    );
};
