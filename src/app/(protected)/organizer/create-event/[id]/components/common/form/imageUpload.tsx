import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { ImageUploadProps } from "../../../libs/interface/comform.interface";

export default function ImageUpload ({
    image,
    onUpload,
    placeholderText,
    dimensions,
    height,
    error,
}: ImageUploadProps) {
    return (
        <>
            <label className={`w-full bg-white border-2 border-dashed border-gray-400 p-4 flex flex-col items-center justify-center ${height} cursor-pointer`}>
                {image ? (
                    <Image
                        src={image}
                        alt="Uploaded Image"
                        className="w-full h-full object-cover"
                        width={720}
                        height={958}
                    />
                ) : (
                    <div className="flex flex-col items-center text-black-500">
                        <ImagePlus size={26} />
                        <p>{placeholderText}</p>
                        <p className="font-semibold">{dimensions}</p>
                    </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
            </label>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </>
    );
};