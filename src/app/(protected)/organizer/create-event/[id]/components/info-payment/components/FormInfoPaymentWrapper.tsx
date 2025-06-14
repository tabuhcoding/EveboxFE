"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import createApiClient from '@/services/apiClient';
import { BaseApiResponse } from '@/types/BaseApiResponse';
import FormInfoPaymentClient from './formInfoPayment';
import Navigation from '../../common/navigation';
import { Divider } from '@nextui-org/react';
import { PaymentForm } from '../../../libs/interface/paymentForm.interface';
import NotificationDialog from './dialog/notifiDialog';

export default function FormInfoPaymentWrapper() {
    const params = useParams();
    const eventId = parseInt(params?.id?.toString() || "");
    const apiClient = createApiClient(process.env.NEXT_PUBLIC_API_URL || "");
    const [open, setOpen] = useState(false); //Notification Dialog 
    const [shouldProceed, setShouldProceed] = useState(false); // Trạng thái kiểm tra khi đóng Dialog
    const [paymentForm, setPaymentForm] = useState<PaymentForm>({
        id: "",
        accName: "",
        accNum: "0",
        bankName: "",
        bankBranch: "",
        typeBusiness: "Cá nhân",
        perName: "",
        perAddress: "",
        taxCode: "",
        companyName: "",
        companyAddress: "",
        companyTaxCode: "",
    });
    const router = useRouter();
    const [btnValidate5, setBtnValidte5] = useState("");

    const processPaymentForm = async (paymentForm: PaymentForm, eventId?: number) => {
        try {
            console.log("Processing Payment Information:", paymentForm);
    
            if (!paymentForm.accName || !paymentForm.accNum || !paymentForm.bankName || !paymentForm.bankBranch || !paymentForm.typeBusiness) {
                toast.error("Vui lòng nhập đầy đủ thông tin tài khoản!");
                return;
            }

            if (paymentForm.typeBusiness=="Cá nhân" && (!paymentForm.perName || !paymentForm.perAddress || !paymentForm.taxCode)) {
                toast.error("Vui lòng nhập đầy đủ thông tin tài khoản!");
                return null;
            }

            if (paymentForm.typeBusiness!="Cá nhân" && (!paymentForm.companyName || !paymentForm.companyAddress || !paymentForm.companyTaxCode)) {
                toast.error("Vui lòng nhập đầy đủ thông tin tài khoản!");
                return null;
            }
    
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const payload: any = {
                accountName: paymentForm.accName,
                accountNumber: paymentForm.accNum,
                bankName: paymentForm.bankName,
                branch: paymentForm.bankBranch,
                businessType: paymentForm.typeBusiness === "Cá nhân" ? 1 : 2,
                fullName: paymentForm.typeBusiness === "Cá nhân" ? paymentForm.perName : paymentForm.companyName,
                address: paymentForm.typeBusiness === "Cá nhân" ? paymentForm.perAddress : paymentForm.companyAddress,
                taxCode: paymentForm.typeBusiness === "Cá nhân" ? paymentForm.taxCode : paymentForm.companyTaxCode,
            };

            let response;
            console.log("------",paymentForm.id)
            if (paymentForm.id) {
                // Update existing record via PUT request (exclude eventId)
                response = await apiClient.put<BaseApiResponse>(`/api/org/payment/${paymentForm.id}`, payload);
            } else {
                payload.eventId = eventId;
                // Create a new record via POST request (include eventId)
                response = await apiClient.post<BaseApiResponse>(`/api/org/payment`, payload);
            }
    
            if (response.data) {
                toast.success("Thông tin thanh toán đã được lưu thành công!");
                console.log("Response:", response.data);
                return response.data;
            } else {
                toast.error(`Lỗi khi lưu: ${response.statusText}`);
                return null;
            }
    
            return response?.data;
        } catch (error) {
            console.error("API Error:", error);
            toast.error("Có lỗi xảy ra khi lưu thông tin thanh toán!");
            return null;
        }
    };

    const handleSave = async () => {
        setBtnValidte5("Save");
        const result = await processPaymentForm(paymentForm, eventId);
        if (result) {
            toast.success("Lưu thành công!");
        }
    }

    const handleContinue = async () => {
        setBtnValidte5("Continue");
        const result = await processPaymentForm(paymentForm, eventId);
        if (result) {
            setOpen(true);
            setShouldProceed(true);     
            }
    }

    const handleNextStep = () => {
        router.push(`/organizer/events`);
    };

    const handleCloseDialog = () => {
            setOpen(false);
            if (shouldProceed) {
                handleNextStep(); 
                setShouldProceed(false); 
            }
        };

    return (
        <>
            <div className="flex flex-col items-center justify-center p-10 relative">
                <span className="text-3xl font-semibold mb-6">Thông tin thanh toán</span>
                <div className="w-full flex justify-center">
                    <ol className="flex space-x-6">
                        <Navigation step={5} />
                        <div className="flex gap-4 mt-4 mb-6">
                            <button
                                className="text-xs w-18 border-2 border-[#0C4762] text-[#0C4762] font-bold py-2 px-4 rounded bg-white hover:bg-[#0C4762] hover:text-white transition-all"
                                onClick={handleSave}
                            >
                                Lưu
                            </button>
                        </div>

                        <div className="flex gap-4 mt-4 mb-6">
                            <button
                                className="text-xs w-30 border-2 border-[#51DACF] text-[#0C4762] font-bold py-2 px-4 rounded bg-[#51DACF] hover:bg-[#0C4762] hover:border-[#0C4762] hover:text-white transition-all"
                                onClick={handleContinue}
                            >
                                Tiếp tục
                            </button>
                        </div>
                    </ol>
                </div>

                <Divider />
            </div>

            <div className="flex justify-center">
                <FormInfoPaymentClient 
                    onNextStep={handleNextStep} 
                    paymentForm={paymentForm} 
                    setPaymentForm={setPaymentForm} 
                    btnValidate5={btnValidate5}
                />
                {open && <NotificationDialog open={open} onClose={handleCloseDialog} />}

            </div>
        </>
    );
}
