# Payments module

Handles paid chapter unlocks (₹1 / $1 / €1 for lifetime access). Selects the
gateway by the user's currency via `@integrations/payments` (Razorpay for INR,
Stripe for USD/EUR).

Follow the `auth` module shape:

```
payments.model.ts        schema: userId, chapterId, provider, providerOrderId,
                         amount, currency, status (pending|paid|failed|refunded)
payments.repository.ts   create order record, mark paid, find by providerOrderId
payments.service.ts      createOrder() → gateway.createOrder(); on webhook,
                         verify signature, mark paid, then grant access via library
payments.controller.ts   HTTP layer + raw-body webhook handlers
payments.dto.ts          CreateOrderDto, OrderDto
payments.validation.ts   Zod schemas
payments.routes.ts       POST /payments/order, POST /payments/webhook/:provider
index.ts                 public surface
```

> Webhook routes need the **raw** request body for signature verification —
> mount `express.raw()` for those paths before the global JSON parser.
