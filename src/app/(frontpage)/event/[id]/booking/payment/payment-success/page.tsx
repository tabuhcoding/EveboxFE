// /* Package Application */
// import PaymentSuccessPage from "./_components/paymentSuccessPage";

// export default async function Page({ searchParams }: PageProps) {
//   const params = await searchParams;
//   const showingId = params.showingId || "";

//   return (
//     <PaymentSuccessPage showingId={showingId} />
//   );
// }

/* Package Application */
import PaymentSuccessPage from "./_components/paymentSuccessPage";

interface PageProps {
  searchParams: Promise<{
    orderCode?: string;
    status?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderCode = params.orderCode;
  const status = params.status;

  return (
    <PaymentSuccessPage orderCode={orderCode} status={status} />
  );
}