/* Package Application */
import { VerifyOTPForm } from "./_components/verifyOtpForm";
import { ReactScan } from "components/reactScan";

const VerifyOTPPage = () => {
  return (
    <>
      <ReactScan />
      <VerifyOTPForm />
    </>
  );
};

export default VerifyOTPPage;