"use client";

/* Package Application */
import RadioOption from "../../common/form/radioOption";

interface RadioOptionProps {
    eventScopeSelected: string;
    setEventScopeSelected: (value: string) => void;
}

export default function GroupRadioOption({eventScopeSelected, setEventScopeSelected} : RadioOptionProps) {
    return (
        <>
            <div className="p-6 lg:p-8 rounded-lg shadow-sm w-full max-w-5xl mx-auto" style={{ backgroundColor: "rgba(158, 245, 207, 0.2)", border: "1.5px solid #9EF5CF" }}>
                <div className="relative flex items-center space-x-2">
                    <p className="text-base font-bold"> Phạm vi áp dụng </p>
                </div>

                <RadioOption
                    value="all" selectedValue={eventScopeSelected}
                    onChange={setEventScopeSelected} icon="" title="Cho cả đơn hàng"
                    description="Người mua vé sẽ chỉ cần trả lời tất cả câu hỏi 1 lần duy nhất với mỗi đơn hàng"
                />

                {/* <RadioOption
                    value="ticket" selectedValue={eventScopeSelected}
                    onChange={setEventScopeSelected} icon="" title="Cho từng vé"
                    description="Người mua vé sẽ cần trả lời tất cả câu hỏi với số lần tương ứng với số vé trong đơn hàng"
                /> */}
            </div>
        </>
    )
}