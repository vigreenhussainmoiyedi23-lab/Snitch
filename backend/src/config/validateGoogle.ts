import { google } from "googleapis";
import { config } from "./config.js";


export async function validateGoogleAuth() {
  const oauth2Client = new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_SECRET_KEY
  );

  oauth2Client.setCredentials({
    refresh_token: config.GOOGLE_REFRESH_TOKEN,
  });

  try {
    const { token } = await oauth2Client.getAccessToken();

    if (!token) {
      throw new Error("Could not obtain Google access token");
    }

    console.log("✓ Google authentication valid");
  } catch (error) {
    throw new Error(
      "Google refresh token is invalid or has been revoked"
    );
  }
}