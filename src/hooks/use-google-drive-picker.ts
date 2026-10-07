"use client";

import { useCallback, useRef, useState } from "react";
import { loadGoogleIdentityServices, loadGooglePicker } from "@/lib/google-drive/load-scripts";
import {
  GOOGLE_DRIVE_SCOPE,
  getGoogleApiKey,
  getGoogleClientId,
  isGoogleDriveConfigured,
} from "@/lib/google-drive/config";
import type { DriveFile } from "@/types";

const MEDIA_MIME_TYPES =
  "image/png,image/jpeg,image/gif,image/webp,video/mp4,video/quicktime";

interface CachedToken {
  token: string;
  expiresAt: number;
}

interface UseGoogleDrivePickerResult {
  openPicker: () => Promise<DriveFile | null>;
  isConfigured: boolean;
  isLoading: boolean;
}

export function useGoogleDrivePicker(): UseGoogleDrivePickerResult {
  const [isLoading, setIsLoading] = useState(false);
  const tokenRef = useRef<CachedToken | null>(null);

  const getAccessToken = useCallback(async (): Promise<string> => {
    if (tokenRef.current && tokenRef.current.expiresAt > Date.now()) {
      return tokenRef.current.token;
    }

    await loadGoogleIdentityServices();
    const clientId = getGoogleClientId();
    if (!clientId || !window.google) {
      throw new Error("Google Identity Services indisponível.");
    }

    return new Promise<string>((resolve, reject) => {
      const client = window.google!.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: GOOGLE_DRIVE_SCOPE,
        callback: (response) => {
          if (response.error || !response.access_token) {
            reject(new Error(response.error ?? "Autorização negada."));
            return;
          }
          tokenRef.current = {
            token: response.access_token,
            expiresAt: Date.now() + 55 * 60 * 1000,
          };
          resolve(response.access_token);
        },
      });
      client.requestAccessToken();
    });
  }, []);

  const openPicker = useCallback(async (): Promise<DriveFile | null> => {
    if (!isGoogleDriveConfigured()) {
      throw new Error(
        "Integração com Google Drive não configurada. Veja as instruções no README."
      );
    }

    setIsLoading(true);
    try {
      const [accessToken] = await Promise.all([getAccessToken(), loadGooglePicker()]);
      const apiKey = getGoogleApiKey()!;

      return await new Promise<DriveFile | null>((resolve, reject) => {
        if (!window.google) {
          reject(new Error("Picker do Google Drive indisponível."));
          return;
        }

        const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS)
          .setIncludeFolders(false)
          .setMimeTypes(MEDIA_MIME_TYPES);

        const picker = new window.google.picker.PickerBuilder()
          .addView(view)
          .setOAuthToken(accessToken)
          .setDeveloperKey(apiKey)
          .setTitle("Escolher mídia do Google Drive")
          .setCallback((response) => {
            if (response.action === window.google!.picker.Action.PICKED && response.docs?.[0]) {
              const doc = response.docs[0];
              fetchDriveFileMetadata(doc.id, accessToken)
                .catch(() => null)
                .then((enriched) => {
                  resolve({
                    id: doc.id,
                    name: doc.name,
                    mimeType: doc.mimeType,
                    iconLink: doc.iconUrl,
                    webViewLink: doc.url,
                    thumbnailLink: enriched?.thumbnailLink,
                  });
                });
            } else if (response.action === window.google!.picker.Action.CANCEL) {
              resolve(null);
            }
          })
          .build();

        picker.setVisible(true);
      });
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken]);

  return { openPicker, isConfigured: isGoogleDriveConfigured(), isLoading };
}

async function fetchDriveFileMetadata(
  fileId: string,
  accessToken: string
): Promise<{ thumbnailLink?: string } | null> {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?fields=thumbnailLink`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) return null;
  return res.json();
}
