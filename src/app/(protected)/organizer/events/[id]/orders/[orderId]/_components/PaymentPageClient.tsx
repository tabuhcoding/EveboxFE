'use client';

import { useParams } from 'next/navigation';
import PaymentSuccessPage from './paymentSuccessPage';

export default function PaymentPageClient() {
  const { orderId } = useParams();
  const orderCode = orderId?.toString();

  return <PaymentSuccessPage orderCode={orderCode} />;
}
