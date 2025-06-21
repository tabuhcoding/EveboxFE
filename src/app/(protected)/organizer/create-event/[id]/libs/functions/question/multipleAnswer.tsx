"use client";

export const handleAddOption = (
    setTexts: (value: string[]) => void,
    setCheckedItems: (value: boolean[]) => void,
    texts: string[],
    checkedItems: boolean[]
) => {
    setTexts([...texts, ""]);
    setCheckedItems([...checkedItems, false]); // Thêm trạng thái checked mới
};

export const handleDelete = (
    index: number,
    setTexts: (value: string[]) => void,
    setCheckedItems: (value: boolean[]) => void,
    texts: string[],
    checkedItems: boolean[]
) => {
    setTexts(texts.filter((_, i) => i !== index));
    setCheckedItems(checkedItems.filter((_, i) => i !== index)); // Xóa trạng thái checked tương ứng
};

export const toggleChecked = (
    index: number,
    checkedItems: boolean[],
    setCheckedItems: (value: boolean[]) => void,
) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
};