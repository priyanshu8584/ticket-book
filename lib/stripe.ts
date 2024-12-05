import Stripe from "stripe"
if(!process.env.STRIPE_SECRET_KEY)
{
  throw new Error("Stripe secret key is missing")
}
export const stripe=new Stripe(process.env.STRIPE_SECRET_KEY,{
  apiVersion:"2024-11-20.acacia"
})