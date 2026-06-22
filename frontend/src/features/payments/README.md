# payments feature

Unlock a chapter for 1 unit of local currency (₹1 / $1 / €1, lifetime). Picks
Razorpay (INR) or Stripe (USD/EUR) by the user's currency. Mirror the `auth`
feature shape:

```
api/         useCreateOrder(chapterId) → backend /payments/order
components/  UnlockButton, CheckoutModal, RazorpayCheckout, StripeCheckout
hooks/       useCheckout (loads gateway SDK, opens widget, confirms)
types/       Order, CheckoutResult
index.ts     public surface
```
Uses publishable keys from `@config` (`VITE_RAZORPAY_KEY_ID`,
`VITE_STRIPE_PUBLISHABLE_KEY`). On success, invalidate the `library` query.
