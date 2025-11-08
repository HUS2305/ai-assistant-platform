import Stripe from "stripe";

export type StripeConfig = {
  apiKey: string;
  apiVersion?: Stripe.LatestApiVersion;
};

export const createStripeClient = (config: StripeConfig) => {
  if (!config.apiKey) {
    throw new Error("Stripe secret key is required");
  }

  return new Stripe(config.apiKey, {
    apiVersion: config.apiVersion ?? "2023-10-16"
  });
};

