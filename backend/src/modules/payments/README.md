# Payments module

Handles paid chapter unlocks (₹1 / $1 / €1 for lifetime access). Selects the
gateway by the user's currency via `@integrations/payments` (Razorpay for INR,
Stripe for USD/EUR).

## What's implemented

A **stateless** order + verify flow that drives the frontend's Razorpay
Checkout. The client-side library currently owns unlock state, so we don't yet
persist a payment record — signature verification (not an auth layer) is what
protects the grant.

```
payments.dto.ts          CreateOrderDto, OrderResultDto, VerifyPaymentDto, VerifyResultDto
payments.validation.ts   Zod schemas (createOrderSchema, verifyPaymentSchema)
payments.service.ts      createOrder() → gateway.createOrder(); verify() → gateway.verifyPayment()
payments.controller.ts   HTTP layer
payments.routes.ts       POST /payments/order, POST /payments/verify
index.ts                 public surface
```

### Endpoints

- `POST /payments/order` — `{ bookSlug, chapterOrder, currency }` →
  `{ mock, provider, keyId, orderId, amount, currency, receipt }`.
  Creates a real gateway order when keys are configured.
- `POST /payments/verify` — `{ provider, orderId, paymentId, signature }` →
  `{ verified }`. Recomputes the HMAC signature; 400 if it doesn't match.

### Demo fallback

When a gateway has **no keys** configured, `createOrder` returns `mock: true`
(no real order) and the browser renders a stand-in checkout sheet. In that mode
`verify` short-circuits to `verified: true` in non-production only — never in
production, where keys are always present.

## Setup (real Razorpay Checkout)

1. Create a Razorpay account and grab **test** keys (Dashboard → Settings → API Keys).
2. In `backend/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
   ```
   Restart the backend. `POST /payments/order` now returns real orders and the
   paywall's "Unlock" button opens the live (test-mode) Razorpay sheet.
3. The browser gets `keyId` from the order response — no frontend key needed.

## Follow-ups (when real auth + a server-side library land)

- Persist a payment record (`payments.model.ts` / `payments.repository.ts`):
  `userId, chapterId, provider, providerOrderId, amount, currency, status`.
- Add the webhook handler (`POST /payments/webhook/:provider`) for reliable,
  out-of-band confirmation. Webhook routes need the **raw** request body for
  signature verification — mount `express.raw()` for those paths before the
  global JSON parser. `verifyWebhook()` already exists on each gateway.
- Bind the grant to the authenticated user and move unlock state server-side.
```
