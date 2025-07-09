"use client";

/* Package System */
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

/* Package Application */
import FilterForm from "./filterForm";
import CreateNewForm from "./createNewForm";
import FormList from "./formTemplate/formList";
import { Form } from "../../../libs/interface/question.interface";
import { connectForm, getAllFormForOrg } from "services/org.service";
import { ConnectFormDto } from "types/models/form/form.interface";
import { useAuth } from "contexts/auth.context";

interface FormQuestionClientProps {
    onNextStep: () => void;
    btnValidate4: string;
    showingIds: string[];
}

export default function FormQuestionClient({ onNextStep, btnValidate4, showingIds }: FormQuestionClientProps) {
    const { session } = useAuth();
    const access_token = session?.user?.accessToken;

    const [selectedCategory, setSelectedCategory] = useState("sample");
    const [isCreateNewOpen, setIsCreateNewOpen] = useState(false);
    const [createdForm, setCreatedForm] = useState<Form | null>(null);

    const [sampleForms, setSampleForms] = useState<Form[]>([]);
    const [createdForms, setCreatedForms] = useState<Form[]>([]);
    const [forms, setForms] = useState<Form[]>([]);
    const [selectedForm, setSelectedForm] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const t = useTranslations('common');

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

    const fetchForms = async () => {
        setIsLoading(true);

        try {
            const fetchedForms = await getAllFormForOrg(); // ← Replaces fetch()

            const sampleFormsData = fetchedForms.filter((form) => form.createdBy === null);
            const createdFormsData = fetchedForms.filter((form) => form.createdBy !== null);

            setSampleForms(sampleFormsData);
            setCreatedForms(createdFormsData);
        } catch (error: any) {
            toast.error(error?.message || transWithFallback("errForm", "Có lỗi xảy ra trong quá trình tải form. Vui lòng thử lại sau."));
            console.error("Error fetching forms:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchForms();
    }, [access_token]);

    useEffect(() => {
        const categorizedForms = selectedCategory === "sample" ? sampleForms : createdForms;
        setForms(categorizedForms);

        if (selectedForm && !categorizedForms.find(f => f.id === selectedForm)) {
            const allForms = [...sampleForms, ...createdForms];
            const newlyCreated = allForms.find(f => f.id === selectedForm);
            if (newlyCreated) {
                setForms(prev => [...prev, newlyCreated]);
            }
        }
    }, [selectedCategory, sampleForms, createdForms, selectedForm]);

    const handleSelectForm = (formId: number) => {
        setSelectedForm((prevSelected) => (prevSelected === formId ? null : formId));
    };

    const handleConnectFormToShowing = async () => {
        if (!selectedForm) {
            // toast.error("Vui lòng chọn form cần kết nối.");
            toast.error(transWithFallback("noSelectForm", "Chưa chọn form hoặc chưa tạo form đăng ký!"));
            return;
        }

        if (!showingIds || showingIds.length === 0) {
            toast.error(transWithFallback("noShow", "Không có showing để kết nối."));
            return;
        }

        const validShowingIds = Array.from(
            new Set(showingIds.filter(id => id.trim() !== ""))
        );
        if (validShowingIds.length === 0) {
            toast.error(transWithFallback("invalidShow", "Không có showing hợp lệ để kết nối."));
            return;
        }

        try {
            await Promise.all(
                validShowingIds.map(async (showingId) => {
                    try {
                        await connectForm({
                            showingId,
                            formId: Number(selectedForm),
                        } as ConnectFormDto);
                    } catch (error) {
                        toast.error(transWithFallback("errConnectForm", "Lỗi kết nối form với showing: ") + (error as Error).message);
                        throw error; // optionally let it bubble up
                    }
                })
            );

            toast.success(transWithFallback("connectForm", "Kết nối form thành công!"));
            onNextStep();
        } catch (error) {
            toast.error("Error connecting form: " + (error as Error).message);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: boolean } = {};

        if (Object.keys(newErrors).length === 0) {
            // Nếu nút là "Save"
            if (btnValidate4 === "Save") {
                toast.success(transWithFallback("saveFormSuccess", "Form hợp lệ, đã tạo và lưu thông tin form"));
                await handleConnectFormToShowing();

            }
            // Nếu nút là "Continue"
            else if (btnValidate4 === "Continue") {
                // onNextStep();
                toast.success(transWithFallback("validForm!", "Form hợp lệ!"))
                await handleConnectFormToShowing();
            }
        }
    };

    return (
        <>
            <div className="flex flex-col justify-center w-full mb-6">
                <div className="w-full max-w-4xl mx-auto flex items-center justify-between h-full mb-4">
                    <FilterForm selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

                    <button className="w-52 text-sm border-2 border-[#2DC275] text-white font-bold py-2 px-4 rounded bg-[#2DC275] hover:bg-[#7DF7B8] hover:border-[#7DF7B8] hover:text-green-600 transition-all"
                        onClick={() => setIsCreateNewOpen(true)}>
                        {transWithFallback("btnCreateForm", "Tạo form mới")}
                    </button>
                </div>


                <form className="w-full max-w-4xl mx-auto" onSubmit={handleSubmit} id="ques-form">
                    {isCreateNewOpen &&
                        <CreateNewForm
                            key={createdForm?.id ?? 'new'}
                            form={createdForm || {
                                id: Date.now(),
                                name: `New Form_${Date.now()}`,
                                createdBy: null,
                                FormInput: [
                                    {
                                        id: Date.now(),
                                        fieldName: transWithFallback("fullName", "Họ và tên"),
                                        type: "text",
                                        required: true,
                                        regex: null,
                                        options: [],
                                    },
                                ],
                            }}
                            setForm={setCreatedForm}
                            open={isCreateNewOpen}
                            onClose={() => setIsCreateNewOpen(false)}
                            onFormCreated={async (newForm) => {
                                await fetchForms(); // Refresh the list of forms after creating a new one
                                setCreatedForm(newForm);
                                setSelectedForm(newForm.id);
                                setSelectedCategory("created");
                                setIsCreateNewOpen(false);
                            }}
                        />
                    }

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="loader"></div>
                        </div>
                    ) : (
                        <FormList forms={forms} selectedForm={selectedForm} handleSelectForm={handleSelectForm} />
                    )}
                </form >
            </div >
        </>
    )
}