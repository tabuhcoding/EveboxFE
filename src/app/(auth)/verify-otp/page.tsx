/* Package Application */
import { ReactScan } from "components/reactScan";

import { VerifyOTPForm } from "./_components/verifyOtpForm";

const VerifyOTPPage = () => {
  return (
    <>
      <ReactScan />
      <VerifyOTPForm />
    </>
  );
};

export default VerifyOTPPage;