"use client";

/* Package System */
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from 'react-hot-toast';

/* Package Application */
import FilterForm from "./filterForm";
import CreateNewForm from "./createNewForm";
import FormList from "./formTemplate/formList";
import { Form } from "../../../libs/interface/question.interface";

interface FormQuestionClientProps {
    onNextStep: () => void;
    btnValidate4: string;
    showingIds: string[];
}

export default function FormQuestionClient({ onNextStep, btnValidate4, showingIds }: FormQuestionClientProps) {
    const { data: session } = useSession();
    const access_token = session?.user?.accessToken;

    const [selectedCategory, setSelectedCategory] = useState("sample");
    const [isCreateNewOpen, setIsCreateNewOpen] = useState(false);
    const [createdForm, setCreatedForm] = useState<Form | null>(null);

    const [sampleForms, setSampleForms] = useState<Form[]>([]);
    const [createdForms, setCreatedForms] = useState<Form[]>([]);
    const [forms, setForms] = useState<Form[]>([]);
    const [selectedForm, setSelectedForm] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchForms = async () => {
        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/showing/form/all`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                }
            })

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData.message || "Có lỗi xảy ra trong quá trình tải form. Vui lòng thử lại sau.");
                return;
            }
            const data = await res.json();
            const fetchedForms: Form[] = data?.data?.forms || [];
            const sampleFormsData = fetchedForms.filter((form) => form.createdBy === null);
            const createdFormsData = fetchedForms.filter((form) => form.createdBy !== null);
            setSampleForms(sampleFormsData);
            setCreatedForms(createdFormsData);
        } catch (error) {
            toast.error("Có lỗi xảy ra trong quá trình tải form. Vui lòng thử lại sau.");
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
            toast.error("Chưa chọn form hoặc chưa tạo form đăng ký!");
            return;
        }

        if (!showingIds || showingIds.length === 0) {
            toast.error("Không có showing để kết nối.");
            return;
        }

        const validShowingIds = Array.from(
            new Set(showingIds.filter(id => id.trim() !== ""))
        );
        if (validShowingIds.length === 0) {
            toast.error("Không có showing hợp lệ để kết nối.");
            return;
        }

        try {
            await Promise.all(
                validShowingIds.map(async (showingId) => {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/showing/connect-form`, {
                        method: 'POST',
                        headers: {
                            "Content-type": "application/json",
                            Authorization: `Bearer ${access_token}`,
                        },
                        body: JSON.stringify({ showingId, formId: Number(selectedForm) })
                    });

                    if (!res.ok) {
                        const errorData = await res.json();
                        toast.error("Lỗi kết nối form với showing.", errorData.message);
                        throw new Error(errorData.message || "Lỗi kết nối form với showing.");
                    }
                })
            );

            toast.success("Kết nối form thành công!");
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
                toast.success("Form hợp lệ, đã tạo và lưu thông tin form");
            }
            // Nếu nút là "Continue"
            else if (btnValidate4 === "Continue") {
                // onNextStep();
                toast.success("Form hợp lệ!")
                await handleConnectFormToShowing();
            }
        }
    };

    return (
        <>
            <div className="flex flex-col justify-center w-full mb-6">
                <div className="w-full max-w-4xl mx-auto flex items-center justify-between h-full mb-4">
                    <FilterForm selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

                    <button className="w-40 text-sm border-2 border-[#2DC275] text-white font-bold py-2 px-4 rounded bg-[#2DC275] hover:bg-[#7DF7B8] hover:border-[#7DF7B8] hover:text-green-600 transition-all"
                        onClick={() => setIsCreateNewOpen(true)}>
                        Tạo form mới
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
                                        fieldName: "Họ và tên",
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