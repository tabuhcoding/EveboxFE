'use client';

/* Package System */
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import toast from "react-hot-toast";

/* Package Application */
import { updateEventAdmin } from "@/services/event.service";
import { useAuth } from "@/contexts/auth.context";

interface EventType {
  id: number;
  isOnlyOnEve: boolean;
}

interface ToggleOnlyOnEveButtonProps {
  event: EventType;
  onToggle: (eventId: number, newIsOnlyOnEve: boolean) => void;
  setGlobalLoading: (val: boolean) => void;
};

export default function ToggleSpecialButton({ event, onToggle, setGlobalLoading }: ToggleOnlyOnEveButtonProps) {
  const t = useTranslations('common');
  const { session } = useAuth();

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  const handleClick = async () => {
    const newIsOnlyOnEve = !event.isOnlyOnEve;
    setGlobalLoading(true);

    try {
      const res = await updateEventAdmin(event.id, {
        isOnlyOnEve: newIsOnlyOnEve
      }, session?.user?.accessToken || "");

      if (res.statusCode === 200) {
        onToggle(event.id, newIsOnlyOnEve);
        toast.success(newIsOnlyOnEve ? transWithFallback('addedIsOnlyOnEve', 'Đã thêm vào sự kiện chỉ có trên EveBox!') : transWithFallback('removedIsOnlyOnEve', 'Đã bỏ khỏi sự kiện chỉ có trên EveBox!'));
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
      <div title={event.isOnlyOnEve ? transWithFallback('reject', 'Bỏ chọn') : transWithFallback('select', 'Chọn')} className="flex justify-center items-center">
        <div className={`rounded w-6 h-6 border cursor-pointer ${event.isOnlyOnEve ? 'bg-teal-400 text-white flex justify-center items-center' : 'bg-white border-gray-500'}`}>
          {event.isOnlyOnEve && <Check className="w-4 h-4" />}
        </div>
      </div>
    </td>
  );
}
