let gsiPromise: Promise<void> | null = null;
let gapiPromise: Promise<void> | null = null;
let pickerPromise: Promise<void> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Falha ao carregar ${src}`));
    document.body.appendChild(script);
  });
}

/** Loads Google Identity Services (OAuth token client). */
export function loadGoogleIdentityServices(): Promise<void> {
  gsiPromise ??= loadScript("https://accounts.google.com/gsi/client");
  return gsiPromise;
}

/** Loads the legacy gapi loader, used only to bootstrap the Picker module. */
export function loadGapi(): Promise<void> {
  gapiPromise ??= loadScript("https://apis.google.com/js/api.js");
  return gapiPromise;
}

/** Loads the Drive Picker (`google.picker`) via gapi. */
export async function loadGooglePicker(): Promise<void> {
  await loadGapi();
  pickerPromise ??= new Promise((resolve, reject) => {
    if (!window.gapi) {
      reject(new Error("gapi indisponível"));
      return;
    }
    window.gapi.load("picker", () => resolve());
  });
  return pickerPromise;
}
