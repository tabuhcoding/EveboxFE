export const handleOneAddOption = (
    setOneTexts: (value: string[]) => void,
    setOneCheckedItems: (value: boolean[]) => void,
    oneTexts: string[],
    oneCheckedItems: boolean[]
) => {
    setOneTexts([...oneTexts, ""]);
    setOneCheckedItems([...oneCheckedItems, false]); // Thêm trạng thái checked mới
};

export const handleOneDelete = (
    index: number,
    setOneTexts: (value: string[]) => void,
    setOneCheckedItems: (value: boolean[]) => void,
    oneTexts: string[] = [], 
    oneCheckedItems: boolean[] = [] 
) => {
    setOneTexts(oneTexts.filter((_, i) => i !== index));
    setOneCheckedItems(oneCheckedItems.filter((_, i) => i !== index));
};

export const toggleOneChecked = (
    index: number,
    oneCheckedItems: boolean[],
    setOneCheckedItems: (value: boolean[]) => void,
) => {
    const newOneCheckedItems = [...oneCheckedItems];
    newOneCheckedItems[index] = !newOneCheckedItems[index];
    setOneCheckedItems(newOneCheckedItems);
};
