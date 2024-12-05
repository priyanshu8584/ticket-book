"use server"

import { stripe } from "@/lib/stripe"
import { error } from "console"

export async function createStripeConnectLoginLink(stripeAccountId:string){
if(!stripeAccountId){
  throw new Error("No stripe account ID provided")

}
try{
const loginLink=await stripe.accounts.createLoginLink(stripeAccountId)
return loginLink.url
}
catch(e)
{
  console.error("error creating Stripe Connect login link",error)
  throw new Error("Failed to create Stripe Connnect login link")
}
}