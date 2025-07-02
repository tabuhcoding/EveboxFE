import { FormInputProps } from "@/types/models/admin/accountManagement.interface";

export default function FormInput({ label, value, disabled = false, type }: FormInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        className="mt-1 w-full px-4 py-2 border rounded-md bg-gray-100"
        disabled={disabled}
      />
    </div>
  );
}
