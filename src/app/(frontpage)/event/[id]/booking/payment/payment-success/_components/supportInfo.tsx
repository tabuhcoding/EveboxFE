/* Package System */
import { Icon } from "@iconify/react";

export default function SupportInfo() {
  return (
    <div className="flex flex-col gap-1 items-center mt-2">
      <span className="text-sm text-gray-600 flex items-center gap-2">
        <Icon icon="ic:baseline-email" width="18" height="18" className="text-[#0C4762]" />
        <span>Email: <a href="mailto:support@yourdomain.com" className="text-[#0C4762] underline hover:text-blue-800">support@yourdomain.com</a></span>
      </span>
      <span className="text-sm text-gray-600 flex items-center gap-2">
        <Icon icon="ic:baseline-phone" width="18" height="18" className="text-[#0C4762]" />
        <span>Hotline: <a href="tel:0123456789" className="text-[#0C4762] underline hover:text-blue-800">0123 456 789</a></span>
      </span>
      <span className="text-sm text-gray-600 flex items-center gap-2">
        <Icon icon="ic:baseline-facebook" width="18" height="18" className="text-[#0C4762]" />
        <span>Facebook: <a href="https://fb.com/yourpage" target="_blank" rel="noopener noreferrer" className="text-[#0C4762] underline hover:text-blue-800">fb.com/yourpage</a></span>
      </span>
    </div>
  )
}