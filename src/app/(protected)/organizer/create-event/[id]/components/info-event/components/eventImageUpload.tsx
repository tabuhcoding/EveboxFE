/* Package System */
import React from 'react';
import { useTranslations } from 'next-intl';

/* Package Application */
import ImageUpload from '../../common/form/imageUpload';
import InputField from '../../common/form/inputCountField';
import { EventImageUploadProps } from '../../../libs/interface/infoevent.interface';

export default function EventImageUpload({
    background,
    handleUpload,
    imageErrors,
    eventName,
    handleInputChange,
    errors,
}: EventImageUploadProps) {
    const t = useTranslations('common');

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

    return (
        <div className="p-6 lg:p-8 rounded-lg shadow-sm w-full max-w-5xl mx-auto" style={{ backgroundColor: "rgba(158, 245, 207, 0.2)", border: "1.5px solid #9EF5CF" }}>
            <p className="block text-sm font-bold mb-2">
                <span className="text-red-500">* </span> {transWithFallback('uploadImg', 'Tải lên hình ảnh')}
            </p>

            <div className="flex flex-wrap -mx-3 mb-6">
                {/* Upload Background */}
                <div className="w-full px-3">
                    <ImageUpload
                        image={background}
                        onUpload={(e) => handleUpload(e, "background")}
                        placeholderText={transWithFallback('addBackgroundImg', 'Thêm ảnh nền sự kiện')}
                        dimensions="(1280x720)"
                        height="h-96"
                        error={imageErrors.background}
                    />
                </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
                {/* Tên sự kiện */}
                <div className="w-full px-3">
                    <InputField
                        label={transWithFallback('eventName', 'Tên sự kiện')}
                        placeholder={transWithFallback('hintEventName', 'Nhập tên sự kiện')}
                        value={eventName}
                        onChange={(e) => handleInputChange(e, "eventName")}
                        error={errors.eventName}
                        maxLength={100}
                        required
                    />
                </div>
            </div>
        </div>
    );
};