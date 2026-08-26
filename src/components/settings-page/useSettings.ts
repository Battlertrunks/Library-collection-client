import { useCallback, useEffect, useState } from "react";

export interface UserSettings {
  firstName: string;
  lastName: string;
  googleBooksApiKey: string;
  theme: "light" | "dark";
}

const SETTINGS_KEY = "library-collection:settings";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  if (!window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const defaultSettings: UserSettings = {
  firstName: "",
  lastName: "",
  googleBooksApiKey: "",
  theme: getSystemTheme(),
};

export function applyTheme(theme: UserSettings["theme"]): void {
  if (typeof document === "undefined") return;
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      applyTheme(defaultSettings.theme);
      return defaultSettings;
    }

    const parsed = JSON.parse(raw) as Partial<UserSettings>;
    const settings: UserSettings = {
      firstName: parsed.firstName ?? defaultSettings.firstName,
      lastName: parsed.lastName ?? defaultSettings.lastName,
      googleBooksApiKey:
        parsed.googleBooksApiKey ?? defaultSettings.googleBooksApiKey,
      theme: parsed.theme ?? defaultSettings.theme,
    };
    applyTheme(settings.theme);
    return settings;
  } catch {
    applyTheme(defaultSettings.theme);
    return defaultSettings;
  }
}

export function saveSettings(settings: UserSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  const updateSettings = useCallback((next: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...next }));
  }, []);

  const save = useCallback(() => {
    try {
      saveSettings(settings);
      setSaveStatus("success");
    } catch {
      setSaveStatus("error");
    }
  }, [settings]);

  const resetSaveStatus = useCallback(() => {
    setSaveStatus("idle");
  }, []);

  return {
    settings,
    updateSettings,
    save,
    saveStatus,
    resetSaveStatus,
  };
}
