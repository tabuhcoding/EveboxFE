import ImageUpload from "../../common/form/imageUpload";
import InputField from "../../common/form/inputCountField";
import { OrganizationInfoFormProps } from "../../../libs/interface/infoevent.interface";

export default function OrganizationInfoForm({
    logoOrg,
    nameOrg,
    infoOrg,
    handleUpload,
    handleInputChange,
    errors,
    imageLogoErrors,
}: OrganizationInfoFormProps) {
    return (
        <div className="mt-3 p-6 lg:p-8 rounded-lg shadow-sm w-full max-w-5xl mx-auto mb-8" style={{ backgroundColor: "rgba(158, 245, 207, 0.2)", border: "1.5px solid #9EF5CF" }}>
            <div className="flex flex-wrap -mx-3 mb-6">
                {/* Logo ban tổ chức */}
                <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                    <label className="block text-sm font-bold mb-2">
                        <span className="text-red-500">* </span> Upload hình ảnh
                    </label>
                    <div className=" text-center">
                        <ImageUpload
                            image={logoOrg}
                            onUpload={(e) => handleUpload(e, "logoOrg")}
                            placeholderText="Thêm logo ban tổ chức"
                            dimensions="(275x275)"
                            height="h-56"
                            error={imageLogoErrors.logoOrg}
                        />
                    </div>

                </div>

                {/* Tên ban tổ chức */}
                <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
                    <InputField
                        label="Tên ban tổ chức"
                        placeholder="Nhập tên ban tổ chức"
                        value={nameOrg}
                        onChange={(e) => handleInputChange(e, "nameOrg")}
                        error={errors.nameOrg}
                        maxLength={80}
                        required
                    />

                    {/* Thông tin ban tổ chức */}
                    <div className="mt-5">
                        <label className="block text-sm font-bold mb-2">
                            <span className="text-red-500">* </span> Thông tin ban tổ chức
                        </label>
                        <div className="relative">
                            <textarea
                                className={`w-full h-32 text-sm block appearance-none border py-3 px-4 pr-8 rounded leading-tight focus:outline-black-400 ${errors.infoOrg ? "border-red-500" : "border-gray-400"}`}
                                placeholder="Nhập thông tin ban tổ chức"
                                value={infoOrg}
                                onChange={(e) => handleInputChange(e, "infoOrg")}
                            />
                            <p className="text-sm text-gray-400 pointer-events-none absolute inset-y-0 right-0 flex items-end px-2 mb-3">
                                0/500
                            </p>
                        </div>
                        {errors.infoOrg && <p className="text-red-500 text-sm mt-1">Vui lòng nhập thông tin ban tổ chức</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
