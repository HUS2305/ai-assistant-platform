import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";

export type OutlookConfig = {
  accessToken: string;
};

export const createOutlookClient = (config: OutlookConfig) => {
  if (!config.accessToken) {
    throw new Error("Outlook access token is required");
  }

  return Client.init({
    authProvider: (done) => {
      done(null, config.accessToken);
    }
  });
};

