// Minimal ambient types for the Google API script tags we load at runtime
// (Google Identity Services + the Drive Picker). Intentionally narrow —
// only what this app actually calls.

interface GoogleTokenResponse {
  access_token: string;
  error?: string;
}

interface GoogleTokenClient {
  requestAccessToken: (overrides?: { prompt?: string }) => void;
}

interface GooglePickerDocument {
  id: string;
  name: string;
  mimeType: string;
  iconUrl?: string;
  url?: string;
}

interface GooglePickerResponse {
  action: string;
  docs?: GooglePickerDocument[];
}

interface GooglePickerBuilder {
  addView: (view: unknown) => GooglePickerBuilder;
  setOAuthToken: (token: string) => GooglePickerBuilder;
  setDeveloperKey: (key: string) => GooglePickerBuilder;
  setCallback: (cb: (response: GooglePickerResponse) => void) => GooglePickerBuilder;
  setTitle: (title: string) => GooglePickerBuilder;
  build: () => { setVisible: (visible: boolean) => void };
}

interface GooglePickerDocsView {
  setIncludeFolders: (include: boolean) => GooglePickerDocsView;
  setMimeTypes: (mimeTypes: string) => GooglePickerDocsView;
}

interface Window {
  gapi?: {
    load: (api: string, callback: () => void) => void;
  };
  google?: {
    accounts: {
      oauth2: {
        initTokenClient: (config: {
          client_id: string;
          scope: string;
          callback: (response: GoogleTokenResponse) => void;
        }) => GoogleTokenClient;
      };
    };
    picker: {
      PickerBuilder: new () => GooglePickerBuilder;
      ViewId: { DOCS: string };
      DocsView: new (viewId?: string) => GooglePickerDocsView;
      Action: { PICKED: string; CANCEL: string };
    };
  };
}
