import { loadStripe } from '@stripe/stripe-js'

export async function checkout({ lineItems }) {
  let stripePromise = null

  const getStripe = () => {
    if (!stripePromise) {
      stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY)
    }
    return stripePromise
  }

  const stripe = await getStripe()


  await stripe.redirectToCheckout({
        mode: 'subscription',
        lineItems,
        successUrl:`${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: window.location.origin
  })
}
