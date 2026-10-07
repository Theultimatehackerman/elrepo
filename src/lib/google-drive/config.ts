export const GOOGLE_DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";

export function getGoogleClientId(): string | undefined {
  return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
}

export function getGoogleApiKey(): string | undefined {
  return process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
}

export function isGoogleDriveConfigured(): boolean {
  return Boolean(getGoogleClientId() && getGoogleApiKey());
}
