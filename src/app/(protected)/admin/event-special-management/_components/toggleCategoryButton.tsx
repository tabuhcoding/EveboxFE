'use client';

/* Package System */
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import toast from "react-hot-toast";

/* Package Application */
import { Category } from "@/types/models/admin/eventManagement.interface";
import { updateEventAdmin } from "@/services/event.service";
import { useAuth } from "@/contexts/auth.context";

interface EventType {
  id: number;
  categoryIds: Category[];
}

interface ToggleCategoryButtonProps {
  event: EventType;
  fullCategory: Category;
  onToggle: (eventId: number, newCategories: Category[]) => void;
  setGlobalLoading: (val: boolean) => void;
};

export default function ToggleCategoryButton({ event, fullCategory, onToggle, setGlobalLoading }: ToggleCategoryButtonProps) {
  const t = useTranslations('common');
  const { session } = useAuth();

  const isSelected = event.categoryIds.some((cat) => cat.id === fullCategory.id);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  const handleClick = async () => {
    setGlobalLoading(true);

    let newCategories: Category[] = [];

    if (isSelected) {
      newCategories = event.categoryIds.filter((cat) => cat.id !== fullCategory.id);
    } else {
      newCategories = [...event.categoryIds, fullCategory];
    }

    try {
      const result = await updateEventAdmin(event.id, {
        categoryIds: newCategories.map((c) => c.id),
        isSpecialForCategory: true
      }, session?.user?.accessToken || "");

      if (result?.statusCode === 200) {
        onToggle(event.id, newCategories);
        toast.success(
          isSelected
            ? `${transWithFallback('removedFrom', 'Đã bỏ khỏi thể loại')} ${fullCategory.name}!`
            : `${transWithFallback('addedTo', 'Đã thêm vào thể loại')} ${fullCategory.name}!`
        );
      } else {
        toast.error(transWithFallback('errorWhenUpdate', 'Có lỗi xảy ra khi cập nhật'));
      }
    } catch (error) {
      console.error("🚀 ~ handleClick ~ error:", error)
      toast.error(`${transWithFallback('errorWhenUpdate', 'Có lỗi xảy ra khi cập nhật')}: ${error}`);
    } finally {
      setGlobalLoading(false);
    }
  }

  return (
    <div
      title={isSelected ? transWithFallback('reject', 'Bỏ chọn') : transWithFallback('select', 'Chọn')}
      onClick={handleClick}
      className="change-category-btn flex justify-center items-center cursor-pointer"
    >
      <div
        className={`rounded w-6 h-6 border ${isSelected
          ? 'bg-teal-400 text-white border-teal-500 flex justify-center items-center'
          : 'bg-white border-gray-500'}`}
      >
        {isSelected && <Check className="w-4 h-4" />}
      </div>
    </div>
  );
}
