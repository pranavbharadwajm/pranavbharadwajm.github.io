import { onRequestPost as __api_create_order_js_onRequestPost } from "/home/pranav/Portfolio/pranavbharadwajm.github.io/functions/api/create-order.js"
import { onRequestPost as __api_verify_payment_js_onRequestPost } from "/home/pranav/Portfolio/pranavbharadwajm.github.io/functions/api/verify-payment.js"

export const routes = [
    {
      routePath: "/api/create-order",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_create_order_js_onRequestPost],
    },
  {
      routePath: "/api/verify-payment",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_verify_payment_js_onRequestPost],
    },
  ]