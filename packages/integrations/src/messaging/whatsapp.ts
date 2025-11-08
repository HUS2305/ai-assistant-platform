type WhatsAppConfig = {
  accessToken: string;
  phoneNumberId: string;
  apiBaseUrl?: string;
};

export const createWhatsAppClient = (config: WhatsAppConfig) => {
  if (!config.accessToken || !config.phoneNumberId) {
    throw new Error("WhatsApp access token and phone number id are required");
  }

  const baseUrl = config.apiBaseUrl ?? "https://graph.facebook.com/v18.0";

  const sendMessage = async (payload: {
    to: string;
    type: "text";
    text: { body: string };
  }) => {
    const response = await fetch(
      `${baseUrl}/${config.phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.accessToken}`
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`WhatsApp API error: ${error}`);
    }

    return response.json();
  };

  return {
    sendText(to: string, text: string) {
      return sendMessage({
        to,
        type: "text",
        text: { body: text }
      });
    }
  };
};

