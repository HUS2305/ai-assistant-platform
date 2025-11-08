import { google } from "googleapis";

export type GmailConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken: string;
};

export const createGmailClient = (config: GmailConfig) => {
  const oauth2Client = new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUri
  );

  oauth2Client.setCredentials({ refresh_token: config.refreshToken });

  return google.gmail({
    version: "v1",
    auth: oauth2Client
  });
};

