/* Package System */
import { useEffect } from 'react';

/* Package Application */
import InputCountField from '../../common/form/inputCountField';
import InputField from '../../common/form/inputField';
import SelectField from '../../common/form/selectField';
import { PaymentForm } from '../../../libs/interface/paymentForm.interface';
import { Toaster } from "react-hot-toast";
import toast from 'react-hot-toast';
import createApiClient from '@/services/apiClient';
import { useParams } from 'next/navigation';
import {PaymentOrgResponse } from '@/types/model/PaymentOrgResponse';

interface Props {
    paymentForm: PaymentForm;
    setPaymentForm: React.Dispatch<React.SetStateAction<PaymentForm>>;
    onNextStep: () => void;
    btnValidate5: string;
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function FormInfoPaymentClient({ paymentForm, setPaymentForm, onNextStep, btnValidate5 }: Props) {
    const params = useParams();
    const eventId = parseInt(params?.id?.toString() || "");
    const apiClient = createApiClient(process.env.NEXT_PUBLIC_API_URL || "");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field:  keyof PaymentForm) => {
        setPaymentForm(prev => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>,field: keyof PaymentForm) => {
        const value = e.target.value;

        setPaymentForm(prev => {
            if (field === "typeBusiness") {
                return {
                    ...prev,
                    typeBusiness: value,
                    // Reset fields not relevant to the selected type
                    ...(value === "Cá nhân"
                        ? {
                            companyName: "",
                            companyAddress: "",
                            companyTaxCode: "",
                        }
                        : {
                            perName: "",
                            perAddress: "",
                            taxCode: "",
                        }),
                };
            }
            return {
                ...prev,
                [field]: value,
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: boolean } = {};

        if (Object.keys(newErrors).length === 0) {
            // Nếu nút là "Save"
            if (btnValidate5 === "Save") {
                toast.success("Form hợp lệ!");
            }
            // Nếu nút là "Continue"
            else if (btnValidate5 === "Continue") {
                toast.success("Chuyển tiếp qua bước tiếp theo!");
            }
        }
    };

    const mapPaymentInfoToForm = (paymentInfo: PaymentOrgResponse): PaymentForm => {
        return {
            id: paymentInfo.data.id,
            accName: paymentInfo.data.accountName,
            accNum: paymentInfo.data.accountNumber,
            bankName: paymentInfo.data.bankName,
            bankBranch: paymentInfo.data.branch,
            typeBusiness: paymentInfo.data.businessType === 1 ? "Cá nhân" : "Doanh nghiệp/Tổ chức",
            perName: paymentInfo.data.businessType === 1 ? paymentInfo.data.fullName : "",
            perAddress: paymentInfo.data.businessType === 1 ? paymentInfo.data.address : "",
            taxCode: paymentInfo.data.taxCode,
            companyName: paymentInfo.data.businessType !== 1 ? paymentInfo.data.fullName : "",
            companyAddress: paymentInfo.data.businessType !== 1 ? paymentInfo.data.address : "",
            companyTaxCode: paymentInfo.data.businessType !== 1 ? paymentInfo.data.taxCode : "",
        };
    };
    

    useEffect(() => {
        const fetchPaymentInfo = async () => {
            try {
                if (!eventId) return;

                const response = await apiClient.get<PaymentOrgResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/org/payment`, {
                    params: { eventId },
                });

                if (response.data) {
                    console.log(mapPaymentInfoToForm(response.data));
                    setPaymentForm(mapPaymentInfoToForm(response.data));
                }
            } catch (error) {
                console.error("Error fetching payment info:", error);
            }
        };

        fetchPaymentInfo();
    }, [setPaymentForm]); // Runs only when component mounts

    return (
        <>
             <Toaster position="top-center" />
            <div className="flex justify-center w-full mb-6">
                <form className="w-full max-w-4xl mx-auto mb-6" onSubmit={handleSubmit} id="pay-form">
                    <div className="p-6 lg:p-8 rounded-lg shadow-sm w-full max-w-5xl mx-auto mb-6" style={{ backgroundColor: "rgba(158, 245, 207, 0.2)", border: "1.5px solid #9EF5CF" }}>
                        <label className="text-base font-bold">
                            Thông tin thanh toán
                        </label>
                        <br></br>
                        <span className="text-sm mt-3">
                            Evebox sẽ chuyển tiền bán vé đến tài khoản của bạn <br></br>
                            Tiền bán vé (sau khi trừ phí dịch vụ cho Evebox) sẽ vào tài khoản của bạn sau khi xác nhận sale report từ 7 - 10 ngày. Nếu bạn
                            muốn nhận được tiền sớm hơn, vui lòng liên hệ chúng tôi qua số 1900.6408 hoặc info@evebox.vn
                        </span>

                        <div className="flex flex-wrap items-center -mx-3 mb-6 mt-4">
                            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                <label className="block text-sm font-bold mb-2 text-right">
                                    Chủ tài khoản:
                                </label>
                            </div>

                            <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
                                <InputCountField
                                    label=""
                                    placeholder=""
                                    value={paymentForm.accName}
                                    onChange={(e) => handleInputChange(e, "accName")}
                                    maxLength={100}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center -mx-3 mb-6">
                            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                <label className="block text-sm font-bold mb-2 text-right">
                                    Số tài khoản:
                                </label>
                            </div>

                            <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
                                <InputField
                                    label=""
                                    placeholder=""
                                    value={paymentForm.accNum}
                                    onChange={(e) => handleInputChange(e, "accNum")}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center -mx-3 mb-6">
                            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                <label className="block text-sm font-bold mb-2 text-right">
                                    Tên ngân hàng:
                                </label>
                            </div>

                            <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
                                <InputCountField
                                    label=""
                                    placeholder=""
                                    value={paymentForm.bankName}
                                    onChange={(e) => handleInputChange(e, "bankName")}
                                    maxLength={100}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center -mx-3 mb-6">
                            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                <label className="block text-sm font-bold mb-2 text-right">
                                    Chi nhánh:
                                </label>
                            </div>

                            <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
                                <InputCountField
                                    label=""
                                    placeholder=""
                                    value={paymentForm.bankBranch} 
                                    onChange={(e) => handleInputChange(e, "bankBranch")}
                                    maxLength={100}
                                />
                            </div>
                        </div>


                        <label className="text-base font-bold">
                            Hoá đơn đỏ
                        </label>

                        <div className="flex flex-wrap items-center -mx-3 mb-6 mt-4">
                            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                <label className="block text-sm font-bold mb-2 text-right">
                                    Loại hình kinh doanh:
                                </label>
                            </div>

                            <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
                                <SelectField
                                    label=""
                                    options={["Cá nhân", "Doanh nghiệp/Tổ chức"]}
                                    value={paymentForm.typeBusiness}
                                    onChange={(e) => handleSelectChange(e, "typeBusiness")}
                                />
                            </div>
                        </div>

                        {/* Hiển thị khi Loại hình kinh doanh là Cá nhân */}
                        {paymentForm.typeBusiness === "Cá nhân" && (
                            <div className='infoOfPersonal'>
                                <div className="flex flex-wrap items-center -mx-3 mb-6">
                                    <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                        <label className="block text-sm font-bold mb-2 text-right">
                                            Họ tên:
                                        </label>
                                    </div>

                                    <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
                                        <InputCountField
                                            label=""
                                            placeholder=""
                                            value={paymentForm.perName}
                                            onChange={(e) => handleInputChange(e, "perName")}
                                            maxLength={100}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center -mx-3 mb-6">
                                    <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                        <label className="block text-sm font-bold mb-2 text-right">
                                            Địa chỉ:
                                        </label>
                                    </div>

                                    <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
                                        <InputCountField
                                            label=""
                                            placeholder=""
                                            value={paymentForm.perAddress}
                                            onChange={(e) => handleInputChange(e, "perAddress")}
                                            maxLength={100}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center -mx-3 mb-6">
                                    <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                        <label className="block text-sm font-bold mb-2 text-right">
                                            Mã số thuế:
                                        </label>
                                    </div>

                                    <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
                                        <InputField
                                            label=""
                                            placeholder=""
                                            value={paymentForm.taxCode}
                                            onChange={(e) => handleInputChange(e, "taxCode")}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Hiển thị khi Loại hình kinh doanh là Doanh nghiệp/Tổ chức */}
                        {paymentForm.typeBusiness === "Doanh nghiệp/Tổ chức" && (
                            <div className='infoOfCompany'>
                                <div className="flex flex-wrap items-center -mx-3 mb-6">
                                    <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                        <label className="block text-sm font-bold mb-2 text-right">
                                            Tên công ty:
                                        </label>
                                    </div>

                                    <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
                                        <InputCountField
                                            label=""
                                            placeholder=""
                                            value={paymentForm.companyName}
                                            onChange={(e) => handleInputChange(e, "companyName")}
                                            maxLength={100}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center -mx-3 mb-6">
                                    <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                        <label className="block text-sm font-bold mb-2 text-right">
                                            Địa chỉ công ty:
                                        </label>
                                    </div>

                                    <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
                                        <InputCountField
                                            label=""
                                            placeholder=""
                                            value={paymentForm.companyAddress}
                                            onChange={(e) => handleInputChange(e, "companyAddress")}
                                            maxLength={100}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center -mx-3 mb-6">
                                    <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                        <label className="block text-sm font-bold mb-2 text-right">
                                            Mã số thuế:
                                        </label>
                                    </div>

                                    <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
                                        <InputField
                                            label=""
                                            placeholder=""
                                            value={paymentForm.companyTaxCode}
                                            onChange={(e) => handleInputChange(e, "companyTaxCode")}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </>
    )
}