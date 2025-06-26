/* Package Application */
import { BaseApiResponse } from "@/types/baseApiResponse";
import { PaymentMethod, PaymentCheckoutPayload, PaymentCheckoutResponse, OrderResponse } from "@/types/models/event/booking/payment.interface";

import { END_POINT_LIST } from "./endpoint";
import { bookingService, paymentService } from "./instance.service";
import { isAxiosError } from "axios";

export async function getPaymentMethodStatus(): Promise<BaseApiResponse<PaymentMethod[]>> {
  try {
    const res = await paymentService.get(END_POINT_LIST.PAYMENT.GET_METHOD_STATUS, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res) throw Error('Failed to get payment method status');

    return res.data as BaseApiResponse<PaymentMethod[]>;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Error get status of payment methods:", error.response?.data?.message);
      throw new Error(`${error.response?.data?.message}`);
    }
    throw new Error('Unknown error occurred while getting payment method status');
  }
}

export async function checkoutPayment(payload: PaymentCheckoutPayload, accessToken?: string): Promise<BaseApiResponse<PaymentCheckoutResponse>> {
  try {
    const res = await paymentService.post(END_POINT_LIST.PAYMENT.CHECKOUT, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res) throw new Error('Failed to checkout payment');

    return res.data as BaseApiResponse<PaymentCheckoutResponse>;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Error checkout payment:", error.response?.data?.message);
      throw new Error(`${error.response?.data?.message}`);
    }
    throw new Error('Unknown error occurred during payment checkout');
  }
}

export async function getUserOrderByOriginalId(orderCode: string, accessToken?: string): Promise<BaseApiResponse<OrderResponse>> {
  try {
    const res = await bookingService.get(`${END_POINT_LIST.BOOKING.GET_ORDER_BY_ORIGINAL_ID}?orderId=${orderCode}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res) throw new Error('Failed to get user order');

    return res.data as BaseApiResponse<OrderResponse>;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Error get user order:", error.response?.data?.message);
      throw new Error(`${error.response?.data?.message}`);
    }
    throw new Error('Unknown error occurred while getting user order');
  }
}
