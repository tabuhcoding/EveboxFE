"use client";

/* Package System */
import { useTranslations } from 'next-intl';

/* Package Application */
import CustomRadioButton from "../../common/form/customRadioButton";

interface QuestionTypeSelectorProps {
    quesText: string;
    setQuesText: (value: string) => void;
}

export default function GroupRadioButton({ quesText, setQuesText }: QuestionTypeSelectorProps) {
    const t = useTranslations('common');

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

    return (
        <>
            <div className="TypeOfQuestion flex justify-between items-center w-full mt-2 mb-2">
                <div className="flex-1 flex justify-start">
                    <CustomRadioButton
                        value="text" selectedValue={quesText}
                        onChange={setQuesText} label={transWithFallback("addTextQuestion", "Thêm câu hỏi dạng văn bản")}
                    />
                </div>

                <div className="flex-1 flex justify-center">
                    <CustomRadioButton
                        value="oneAns" selectedValue={quesText}
                        onChange={setQuesText} label={transWithFallback("addSingleChoiceQuestion", "Thêm câu hỏi 'một câu trả lời'")}
                    />
                </div>

                <div className="flex-1 flex justify-end">
                    <CustomRadioButton
                        value="multiAns" selectedValue={quesText}
                        onChange={setQuesText} label={transWithFallback("addMultipleChoiceQuestion", "Thêm câu hỏi ‘nhiều câu trả lời’")}
                    />
                </div>
            </div>
        </>
    )
}