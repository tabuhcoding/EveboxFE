'use client'

import { FormInputItemProps } from "../../../../libs/interface/question.interface";

export default function FormInputItem({ input, index }: FormInputItemProps) {
    return (
        <div className="flex flex-col">
            <div className="flex items-center w-full mt-4">
                <div key={input.id} className="flex items-center space-x-2 ml-2">
                    <label className="text-base font-bold"> Câu {index + 1}: </label>

                    {(input.type === "text" || input.type === "email" || input.type === "phone" || input.type === "1" || input.type === "quesText")
                        && (<span>Câu hỏi dạng văn bản</span>)}
                    {(input.type === "2" || input.type === "oneAns" || input.type === "3") && <span>Câu trả lời bắt buộc</span>}
                    {(input.type === "4") && <span>Câu hỏi nhiều lựa chọn</span>}
                </div>
            </div>

            <div className="flex items-center -mx-3 mt-4">
                {(input.type === "text" || input.type === "email" || input.type === "phone" || input.type === "quesText" || input.type === "1")
                    && (<>
                        <div className="w-full px-3 ml-6">
                            <label className="block text-sm font-bold mb-2 text-left">
                                {input.required && <span className="text-red-500">* </span>} {input.fieldName}
                            </label>
                            <input className="text-sm block w-full border rounded py-3 px-4 mb-1 focus:outline-black-400 border-gray-400" readOnly />
                        </div>
                    </>)
                }

                {(input.type === "2" || input.type === "oneAns") && (<>
                    <div className="w-full px-3 ml-6">
                        <label className="block text-sm font-bold mb-2 ">
                            {input.required && <span className="text-red-500">* </span>} {input.fieldName}
                        </label>
                        <div className="flex items-center ml-3">
                            {input.options?.map((opt, i) => (
                                <label key={`input-${input.id}-option-${i}`} className="flex items-center mr-4">
                                    <input type="radio" name={`checkbox-group-${input.id}`} className="w-3.5 h-3.5 accent-blue-500" />
                                    <span className="text-sm ml-2">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </>)
                }

                {(input.type === "3") && (<>
                    <div className="w-full px-3 ml-6">
                        <label className="block text-sm font-bold mb-2 ">
                            {input.required && <span className="text-red-500">* </span>} {input.fieldName}
                        </label>
                        <div className="flex flex-wrap items-center ml-3">
                            {input.options?.map((opt, i) => (
                                <label key={`input-${input.id}-option-${i}`} className="flex items-center mr-4">
                                    <input type="radio" name={`checkbox-group-${input.id}`} className="w-3.5 h-3.5 accent-blue-500" />
                                    <span className="text-sm ml-2">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </>)
                }

                {(input.type === "4" || input.type === "multiAns") && (
                    <>
                        <div className="w-full px-3 ml-6">
                            <label className="block text-sm font-bold mb-2 ">
                                {input.required && <span className="text-red-500">* </span>} {input.fieldName}
                            </label>
                            <div className="flex flex-wrap items-center ml-3">
                                {input.options?.map((opt, i) => (
                                    <label key={`input-${input.id}-option-${i}`} className="flex items-center mr-4">
                                        <input type="checkbox" name={`checkbox-group-${input.id}`} className="w-3.5 h-3.5 accent-blue-500" />
                                        <span className="text-sm ml-2">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {input.regex && (
                <div className="w-full px-3 ml-6 mt-3">
                    <div className="mb-6 md:mb-0">
                        <p className="block text-sm font-bold"> Mô tả: </p>
                    </div>

                    <div className="px-10 mb-6 md:mb-0 ml-2">
                        {input.type === "email" && (<>
                            <p>- Bắt đầu bằng chữ cái, số hoặc các ký tự . _ % + -</p>
                            <p>- Tiếp theo phải có ký tự @</p>
                            <p>- Sau @ là tên miền, có thể chứa chữ cái, số, dấu . hoặc -</p>
                            <p>- Kết thúc bằng dấu chấm và tối thiểu 2 chữ cái (ví dụ: .com, .vn)</p>
                            <p className="block text-blue-700 ml-3">Ví dụ: user123@gmail.com</p>
                        </>)}

                        {input.type === "phone" && (<>
                            <p>- Bắt đầu bằng số 0</p>
                            <p>- Tiếp theo là 9 hoặc 10 chữ số</p>
                            <p>- Tổng độ dài là 10 hoặc 11 số</p>
                            <p className="block text-blue-700 ml-3">Ví dụ: 0123456789 hoặc 09876543210</p>
                        </>)}
                    </div>
                </div>
            )}
        </div>
    );
};
