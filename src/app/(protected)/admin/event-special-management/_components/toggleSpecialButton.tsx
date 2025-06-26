'use client';

/* Package System */
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Check } from "lucide-react";
import toast from "react-hot-toast";

/* Package Application */
import { updateEventAdmin } from "@/services/event.service";

interface EventType {
  id: number;
  isSpecial: boolean;
}

interface ToggleSpecialButtonProps {
  event: EventType;
  onToggle: (eventId: number, newIsSpecial: boolean) => void;
  setGlobalLoading: (val: boolean) => void;
};

export default function ToggleSpecialButton({ event, onToggle, setGlobalLoading }: ToggleSpecialButtonProps) {
  const t = useTranslations('common');
  const { data: session } = useSession();

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  const handleClick = async () => {
    const newIsSpecial = !event.isSpecial;
    setGlobalLoading(true);

    try {
      const res = await updateEventAdmin(event.id, {
        isSpecial: newIsSpecial
      }, session?.user?.accessToken || "");

      if (res.statusCode === 200) {
        onToggle(event.id, newIsSpecial);
        toast.success(newIsSpecial ? transWithFallback('addedIsSpecial', 'Đã thêm vào sự kiện đặc biệt!') : transWithFallback('removedIsSpecial', 'Đã bỏ khỏi sự kiện đặc biệt!'));
      }
      else toast.error(transWithFallback('errorWhenUpdate', 'Có lỗi xảy ra khi cập nhật'));
    } catch (error) {
      console.log("🚀 ~ handleClick ~ error:", error)
      toast.error(`${transWithFallback('errorWhenUpdate', 'Có lỗi xảy ra khi cập nhật')}: ${error}`);
    } finally {
      setGlobalLoading(false);
    }
  }

  return (
    <td onClick={handleClick} className="change-special-btn px-4 py-3 border-r border-gray-200 text-center cursor-pointer max-w-[200px] align-middle">
      <div title={event.isSpecial ? transWithFallback('reject', 'Bỏ chọn') : transWithFallback('select', 'Chọn')} className="flex justify-center items-center">
        <div className={`rounded w-6 h-6 border cursor-pointer ${event.isSpecial ? 'bg-teal-400 text-white flex justify-center items-center' : 'bg-white border-gray-500'}`}>
          {event.isSpecial && <Check className="w-4 h-4" />}
        </div>
      </div>
    </td>
  );
}