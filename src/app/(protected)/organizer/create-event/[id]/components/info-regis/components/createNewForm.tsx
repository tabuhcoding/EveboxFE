'use client';

/* Package System */
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { CirclePlus, Equal, Trash2 } from "lucide-react";
import { Icon } from "@iconify/react";
import { useState, ChangeEvent } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

/* Package Application */
import InputCountField from "../../common/form/inputCountField";
import MultipleAnswer from "../../common/form/multipleAns";
import OneAnswer from "../../common/form/oneAns";
// import { handleOneAddOption, handleOneDelete, toggleOneChecked } from "../../../libs/functions/question/oneAnswer";
// import { handleAddOption, handleDelete, toggleChecked } from "../../../libs/functions/question/multipleAnswer";
import GroupRadioButton from "./groupRadioButton";
import GroupRadioOption from "./groupRadioOption";
import { FormInput,Form } from "../../../libs/interface/question.interface";

interface CreateNewFormProps {
    form: Form;
    setForm: (form: Form) => void;
    open: boolean;
    onClose: () => void;
    onFormCreated: (newForm: Form) => void;
}

export default function CreateNewForm({ form, setForm, open, onClose, onFormCreated }: CreateNewFormProps) {
    const { data: session } = useSession();
    const [currentForm, setCurrentForm] = useState<Form>(form); // Lưu form hiện tại
    const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(
        currentForm.FormInput.length > 0 ? currentForm.FormInput[0].id : null
    );
    const quesText = currentForm.FormInput.length > 0 ? currentForm.FormInput[0].type : "text"; // Lưu loại câu hỏi hiện tại
    const [errors,] = useState<{ [key: string]: boolean }>({});
    const [eventScopeSelected, setEventScopeSelected] = useState<string>("all");

    // // One Answer
    // const [oneTexts, setOneTexts] = useState<string[]>(["", "", ""]);
    // const [oneCheckedItems, setOneCheckedItems] = useState<boolean[]>([false, false, false]); // Trạng thái checked của mỗi input

    // // Multiple Answer
    // const [texts, setTexts] = useState<string[]>(["", "", ""]);
    // const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false, false]); // Trạng thái checked của mỗi input

    const updateQuestionOptions = (questionId: number, newOptions: { optionText: string }[]) => {
        setCurrentForm(prev => ({
            ...prev,
            FormInput: prev.FormInput.map(q =>
                q.id === questionId ? { ...q, options: newOptions } : q
            )
        }));
    };


    const toggleExpand = (formId: number) => {
        setExpandedQuestionId((prev) => (prev === formId ? null : formId));
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number, field: string) => {
        // const value = e.target.value;
        // setCurrentForm((prev) => ({
        //     ...prev,
        //     FormInput: prev.FormInput.map(q =>
        //         q.id === id ? { ...q, [field]: value } : q
        //     ),
        // }));
        const value = e.target.value;
        const updatedQuestions = currentForm.FormInput.map(q =>
            q.id === id ? { ...q, [field]: value } : q
        );
        setCurrentForm(prev => ({ ...prev, FormInput: updatedQuestions }));
    };

    const handleDeleteQuestion = (id: number) => {
        // setCurrentForm((prev) => ({
        //     ...prev,
        //     FormInput: prev.FormInput.filter(q => q.id !== id),
        // }));
        // if (expandedQuestionId === id) setExpandedQuestionId(null);
        const updatedQuestions = currentForm.FormInput.filter(q => q.id !== id);
        setCurrentForm(prev => ({ ...prev, FormInput: updatedQuestions }));
        if (expandedQuestionId === id) setExpandedQuestionId(null);
    };

    const handleAddQuestion = () => {
        const newQuestion: FormInput = {
            id: Date.now(),
            fieldName: `Câu hỏi mới`,
            type: quesText,
            required: true,
            regex: null,
            options: (quesText === "oneAns" || quesText === "multiAns")
                ? Array(3).fill(null).map(() => ({ optionText: "" }))
                : null,
        };

        setCurrentForm(prev => ({
            ...prev,
            FormInput: [...prev.FormInput, newQuestion],
        }));

        setExpandedQuestionId(newQuestion.id);
    };

    const handleCheckBoxChange = (e: ChangeEvent<HTMLInputElement>, id: number) => {
        const checked = e.target.checked;
        const updatedQuestions = currentForm.FormInput.map(q =>
            q.id === id ? { ...q, required: checked } : q
        );
        setCurrentForm(prev => ({ ...prev, FormInput: updatedQuestions }));
    }

    // Hàm thêm newForm vào newForms
    const handleSaveForm = async () => {
        const payload = {
            name: currentForm.name,
            formInputs: currentForm.FormInput.map(q => ({
                fieldName: q.fieldName,
                type: q.type,
                required: q.required,
                regex: q.regex,
                options: q.options && q.options.length > 0 ? q.options : null,
            })),
        };

        const accessToken = session?.user?.accessToken;
        if (!accessToken) {
            toast.error("Vui lòng đăng nhập để thực hiện hành động này.");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/showing/form`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Token assumed to be stored in localStorage or passed via context
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json();
                toast.error(errData.message || "Lỗi tạo form mới");
                return;
            }
            
            const data = await res.json();
            const newFormId = data?.data?.formId;
            if (!newFormId) {
                toast.error("Không nhận được ID của form mới.");
                return;
            }
            toast.success("Tạo form mới thành công!");
            const updatedForm = { ...currentForm, id: newFormId };
            setForm(updatedForm);
            onFormCreated(updatedForm);
            onClose();
        } catch (error) {
            console.error("Error creating new form:", error);
            toast.error("Lỗi khi tạo form mới");
        }
    };


    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
                <div className="text-white dialog-header px-6 py-2 pb-4  justify-center items-center flex relative" style={{ background: '#0C4762' }}>
                    <DialogTitle className="!m-0 !p-0 text-lg text-center font-bold">Tạo form mới</DialogTitle>
                    <button onClick={onClose} className="absolute right-2 top-2 px-1 py-1 close-btn">
                        <Icon icon="ic:baseline-close" width="20" height="20" />
                    </button>
                </div>

                <DialogContent sx={{ overflowY: "auto", maxHeight: "90vh" }}>
                    <div className="content mx-4">
                        <GroupRadioOption eventScopeSelected={eventScopeSelected} setEventScopeSelected={setEventScopeSelected} />

                        {currentForm.FormInput.map((question, index) => (
                            <div
                                key={question.id}
                                className="p-6 lg:p-8 rounded-lg shadow-sm w-full max-w-5xl mx-auto mt-3 mb-6"
                                style={{ backgroundColor: "rgba(158, 245, 207, 0.2)", border: "1.5px solid #9EF5CF" }}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <Equal className="text-[#51DACF] cursor-pointer" onClick={() => toggleExpand(question.id)} />
                                    <div className="ml-2">
                                        <div className="relative flex items-center space-x-2">
                                            <label className="text-base font-bold"> Câu {index + 1} </label>
                                        </div>

                                        {question.type === "text" && <span>Câu hỏi dạng văn bản</span>}
                                        {question.type === "oneAns" && <span>Câu hỏi một lựa chọn</span>}
                                        {(question.type === "multiAns" || question.type === "4") && <span>Câu hỏi nhiều lựa chọn</span>}
                                    </div>
                                    <Trash2
                                        className="ml-auto p-2 bg-red-500 text-white rounded w-8 h-8 cursor-pointer"
                                        onClick={() => handleDeleteQuestion(question.id)}
                                    />
                                </div>

                                {expandedQuestionId === question.id && (
                                    <>
                                        {/* Phần nhập câu hỏi */}
                                        <div className="flex flex-wrap items-center -mx-3 mt-4">
                                            <div className="w-full md:w-1/6 px-3 mb-6 md:mb-0">
                                                <p className="block text-sm font-bold mb-2 text-right">
                                                    <span className="text-red-500">*</span> Câu hỏi
                                                </p>
                                            </div>
                                            <div className="w-full md:w-5/6 px-3 mb-6 md:mb-0">
                                                <InputCountField
                                                    label=""
                                                    placeholder="Nhập câu hỏi"
                                                    value={question.fieldName}
                                                    onChange={(e) => handleInputChange(e, question.id, "fieldName")}
                                                    error={errors.name}
                                                    maxLength={100}
                                                />
                                            </div>
                                        </div>
                                        {/* Phần nhập mô tả (sử dụng thuộc tính regex để lưu mô tả, nếu cần) */}
                                        <div className="flex flex-wrap items-center -mx-3 mt-4">
                                            <div className="w-full md:w-1/6 px-3 mb-6 md:mb-0">
                                                <p className="block text-sm font-bold mb-2 text-right">
                                                    Mô tả
                                                </p>
                                            </div>
                                            <div className="w-full md:w-5/6 px-3 mb-6 md:mb-0">
                                                <InputCountField
                                                    label=""
                                                    placeholder={question.regex ? question.regex : "Mô tả"}
                                                    value={question.regex || ""}
                                                    onChange={(e) => handleInputChange(e, question.id, "regex")}
                                                    maxLength={100}
                                                    error={errors.regex}
                                                />
                                            </div>

                                            <div className="w-full ml-4 mr-4">
                                                <GroupRadioButton
                                                    quesText={question.type || "text"}
                                                    setQuesText={(newType) => {
                                                        const updatedQuestions = currentForm.FormInput.map(q =>
                                                            q.id === question.id ? { ...q, type: newType } : q
                                                        );
                                                        setCurrentForm(prev => ({ ...prev, FormInput: updatedQuestions }));
                                                    }}
                                                />
                                                {(question.type === "oneAns" || question.type === "2") && (
                                                    <div className="border p-4 bg-white mt-4 rounded">
                                                        {(question.options || []).map((opt, optIdx) => (
                                                            <OneAnswer
                                                                key={optIdx}
                                                                value={opt.optionText}
                                                                checked={false} // hoặc để UI highlight tạm nếu muốn
                                                                onChange={(newVal) => {
                                                                    const updatedOptions = [...(question.options || [])];
                                                                    updatedOptions[optIdx].optionText = newVal;
                                                                    updateQuestionOptions(question.id, updatedOptions);
                                                                }}
                                                                onToggle={() => { }}
                                                                onDelete={() => {
                                                                    const updatedOptions = [...(question.options || [])];
                                                                    updatedOptions.splice(optIdx, 1);
                                                                    updateQuestionOptions(question.id, updatedOptions);
                                                                }}
                                                            />
                                                        ))}
                                                        <button
                                                            className="text-[#2DC275] mt-2 flex items-center gap-1"
                                                            onClick={() => {
                                                                const updated = [...(question.options || []), { optionText: "" }];
                                                                updateQuestionOptions(question.id, updated);
                                                            }}
                                                        >
                                                            <CirclePlus size={20} /> Thêm tùy chọn
                                                        </button>
                                                    </div>
                                                )}

                                                {(question.type === "multiAns" || question.type === "4") && (
                                                    <div className="border p-4 bg-white mt-4 rounded">
                                                        {(question.options || []).map((opt, optIdx) => (
                                                            <MultipleAnswer
                                                                key={optIdx}
                                                                value={opt.optionText}
                                                                checked={false}
                                                                onChange={(newVal) => {
                                                                    const updatedOptions = [...(question.options || [])];
                                                                    updatedOptions[optIdx].optionText = newVal;
                                                                    updateQuestionOptions(question.id, updatedOptions);
                                                                }}
                                                                onToggle={() => { }} // Có thể bỏ nếu không cần chọn checkbox
                                                                onDelete={() => {
                                                                    const updatedOptions = [...(question.options || [])];
                                                                    updatedOptions.splice(optIdx, 1);
                                                                    updateQuestionOptions(question.id, updatedOptions);
                                                                }}
                                                            />
                                                        ))}
                                                        <button
                                                            className="text-[#2DC275] mt-2 flex items-center gap-1"
                                                            onClick={() => {
                                                                const updated = [...(question.options || []), { optionText: "" }];
                                                                updateQuestionOptions(question.id, updated);
                                                            }}
                                                        >
                                                            <CirclePlus size={20} /> Thêm tùy chọn
                                                        </button>
                                                    </div>
                                                )}

                                                <div className="flex justify-end mt-3">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="w-4 h-4 border border-black"
                                                            checked={question.required} 
                                                            onChange={(e) => handleCheckBoxChange(e, question.id)}
                                                        />
                                                        <span className="text-sm">Yêu cầu trả lời</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}

                        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

                        <div className="flex justify-center mb-6">
                            <button type="button" className="text-base font-medium flex items-center gap-1 my-2 text-[#2DC275]"
                                onClick={handleAddQuestion}>
                                <CirclePlus size={20} /> Tạo câu hỏi
                            </button>
                        </div>

                        <div className="flex justify-center gap-10 mt-4 mb-6">
                            <button onClick={onClose} className="w-60 border-2 border-gray-500 text-gray-500 font-bold py-2 px-4 rounded bg-white hover:bg-gray-500 hover:text-white transition-all">
                                Hủy
                            </button>

                            <button onClick={handleSaveForm} className="w-60 border-2 border-[#0C4762] text-[#0C4762] font-bold py-2 px-4 rounded bg-white hover:bg-[#0C4762] hover:text-white transition-all">
                                Lưu
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog >
        </>
    )
}