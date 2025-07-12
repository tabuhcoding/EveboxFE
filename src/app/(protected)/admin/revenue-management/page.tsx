/* Package System */
import 'tailwindcss/tailwind.css';

/* Package Application */
import RevenueManagementPage from './_components/revenueManagement';

export default function Page() {
  return (
    <div className="container px-4 py-6">
      <RevenueManagementPage />
    </div>
  );
}