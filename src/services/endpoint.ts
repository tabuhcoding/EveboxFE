export class END_POINT_LIST {
  static readonly USER = {
    LOGIN: "/api/user/login",
    LOGOUT: "/api/user/logout",
    REGISTER: "/api/user/register",
    REFRESH_TOKEN: "/api/user/refresh-token",
    FORGOT_PASSWORD: "/api/user/forgot-password",
    RESET_PASSWORD: "/api/user/reset-password",
    CHANGE_PASSWORD: "/api/user/change-password",
    VERIFY_OTP: "/api/user/otps/verify-otp",
    RESEND_OTP: "/api/user/otps/resend-otp",
    GET_USER_INFO: "/api/user/me",
    GOOGLE: "/api/user/google",
    GOOGLE_CALLBACK: "/api/user/google/callback",
    TOGGLE_NOTIFICATION: "/api/user/notification/all",
    ADD_FAVORITE_EVENT: "/api/user/favorite",
    FAVORITE_EVENT: "/api/user/favorite/event",
    REMOVE_FAV_EVENT: "/api/user/favorite/event",
    REMOVE_FAV_ORG: "/api/user/favorite/org",
    USER: "/api/user",
  };

  static readonly EVENT = {
    GET_EVENT_DETAIL: "/api/event/detail",
    GET_RECOMMENDED_EVENTS: "/api/event/recommended-events",
    SEARCH_EVENTS: "/api/event/search",
    CLICKS: "/api/event/detail/clicks",
    ALL_CATEGORIES: "/api/categories",
    GET_FRONT_DISPLAY: "/api/event/front-display",
    GET_FRONT_DISPLAY_BY_IDS: "/api/event/fd-by-ids",
    GET_SEARCH_EVENT: "/api/event/search",
  };

  static readonly SHOWING = {
    GET_SHOWING: "/api/showing",
    GET_SEAT_MAP: "/api/showing/seatmap",
    GET_FORM: "/api/showing/get-form",
  };

  static readonly BOOKING = {
    SELECT_SEAT: '/api/booking/selectSeat',
    SUBMIT_FORM: '/api/booking/submitForm',
    GET_REDIS_SEAT: "/api/booking/getRedisSeat",
    UNSELECT_SEAT: "/api/booking/unSelectSeat",
    GET_ORDER_BY_ORIGINAL_ID: "/api/ticket/getOrderByOriginalId",
    GET_ORDER_BY_ID_ORG: "/api/ticket/org/getOrderById",
    GET_ORDER_BY_ID: "/api/ticket/getOrderById",
    GET_USER_ORDER: "/api/ticket/getUserOrder",
    RECEIVE_TICKET: "api/booking/receive-ticket",
    SEND_EMAIL: '/api/booking/sendEmail'
  }

  static readonly ORG_EVENT = {
    EVENT: "/api/org/event",
    MEMBER: "/org/member",
    EVENT_ROLE: "/api/event/role",
  }

  static readonly ORG_SHOWING = {
    FORM_ALL:"/api/org/showing/form/all",
    FORM_CONNECT:"/api/org/showing/connect-form",
    SHOWING_FORM: "/api/org/showing/form",
    SHOWING: "/api/org/showing",
  }

  static readonly ORG_TICKETTYPE = {
    TICKET_TYPE: "/api/org/ticketType",
  }

  static readonly ORG_PAYMENT = {
    PAYMENT: "/api/org/payment",
  }

  static readonly  ORG_CHECKIN: {
    ALL_CHECKED_IN: "/api/org/checkin/all"
  }


  static readonly ORG_STATISTICS = {
    GET_SUMMARY: "/api/org/statistics/summary",
    GET_ORDERS: "/api/org/statistics/orders",
    GET_ANALYTIC: "/api/org/statistics/analytic",
    GET_TICKETS: "/api/org/statistics/tickets"
  };

  static readonly ADMIN_STATISTICS = {
    GET_REVENUE: "/api/admin/revenue",
    GET_REVENUE_V2: "/api/admin/revenue-v2",
    GET_REVENUE_CHART: "/api/admin/revenue-chart",
    GET_REVENUE_CHART_V2: "/api/admin/revenue-chart-v2",
    GET_REVENUE_BY_PROVINCE: "/api/admin/revenue-by-province",
    GET_REVENUE_BY_TICKETPRICE: "/api/admin/revenue-by-ticket-price"
  };

  static readonly ADMIN = {
    EVENTS: "/api/admin/event",
    EVENT_DETAIL: "/api/admin/event/detail",
    SHOWINGS: "/api/admin/showing",
    EVENTS_SPECIAL: "api/admin/event-special",
    USERS: "/api/admin/user",
  };

  static readonly LOCATION = {
    GET_ALL_LOCATIONS: "/api/location/all",
    GET_ALL_DISTRICTS: "/api/location/all-districts",
    GET_ORG_LOCATIONS: "/api/location/org"
  };

  static readonly PAYMENT = {
    GET_METHOD_STATUS: '/api/payment/getPaymentMethodStatus',
    CHECKOUT: '/api/payment/checkout'
  };

  static readonly RAG = {
    RAG_SERVICE: '/api/rag/agent'
  }
}