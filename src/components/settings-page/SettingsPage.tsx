import { useEffect, useId, useState } from "react";
import { useSettings } from "./useSettings";
import "./SettingsPage.css";

interface SettingsPageProps {
  onClose: () => void;
}

function SettingsPage({ onClose }: SettingsPageProps) {
  const { settings, updateSettings, save, saveStatus, resetSaveStatus } =
    useSettings();
  const [showApiKey, setShowApiKey] = useState(false);

  const firstNameId = useId();
  const lastNameId = useId();
  const apiKeyId = useId();
  const themeToggleId = useId();

  useEffect(() => {
    if (saveStatus === "idle") return;

    const timer = setTimeout(() => {
      resetSaveStatus();
    }, 3000);

    return () => clearTimeout(timer);
  }, [saveStatus, resetSaveStatus]);

  const isDark = settings.theme === "dark";

  return (
    <div className="settings-page flex flex-col h-[calc(100vh-7rem)] px-6 pt-6 pb-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Settings
        </h1>
        <button
          type="button"
          onClick={onClose}
          className="settings-page__close-btn p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Close settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-7"
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <form
        className="settings-page__form flex flex-col gap-6 flex-1"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <div className="settings-page__field flex flex-col gap-1">
          <label
            htmlFor={firstNameId}
            className="text-sm font-medium text-gray-900 dark:text-white"
          >
            First Name
          </label>
          <input
            id={firstNameId}
            type="text"
            value={settings.firstName}
            onChange={(event) =>
              updateSettings({ firstName: event.target.value })
            }
            placeholder="Jane"
            className="settings-page__input bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 py-3 px-4 rounded-xl text-sm"
          />
        </div>

        <div className="settings-page__field flex flex-col gap-1">
          <label
            htmlFor={lastNameId}
            className="text-sm font-medium text-gray-900 dark:text-white"
          >
            Last Name
          </label>
          <input
            id={lastNameId}
            type="text"
            value={settings.lastName}
            onChange={(event) =>
              updateSettings({ lastName: event.target.value })
            }
            placeholder="Doe"
            className="settings-page__input bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 py-3 px-4 rounded-xl text-sm"
          />
        </div>

        <div className="settings-page__field flex flex-col gap-1">
          <label
            htmlFor={apiKeyId}
            className="text-sm font-medium text-gray-900 dark:text-white"
          >
            Google Books API Key{" "}
            <span className="text-gray-500 dark:text-gray-400 font-normal">
              (optional)
            </span>
          </label>
          <div className="relative">
            <input
              id={apiKeyId}
              type={showApiKey ? "text" : "password"}
              value={settings.googleBooksApiKey}
              onChange={(event) =>
                updateSettings({ googleBooksApiKey: event.target.value })
              }
              placeholder="Enter your API key"
              className="settings-page__input settings-page__input--password bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 py-3 pl-4 pr-12 rounded-xl text-sm w-full"
            />
            <button
              type="button"
              onClick={() => setShowApiKey((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label={showApiKey ? "Hide API key" : "Show API key"}
              aria-pressed={showApiKey}
            >
              {showApiKey ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-5"
                >
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path
                    fillRule="evenodd"
                    d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-5"
                >
                  <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553c-1.367-4.11-5.11-7.072-9.676-7.072-1.578 0-3.072.35-4.42.974l2.868 2.868A5.25 5.25 0 0 1 17.25 12c0 .89-.22 1.728-.608 2.463l2.048 2.048a9.848 9.848 0 0 0 3.586-3.586ZM16.728 17.728 14.078 15.078A3.75 3.75 0 0 1 12 15.75c-2.071 0-3.75-1.679-3.75-3.75 0-.89.313-1.707.837-2.348L6.696 6.696A10.217 10.217 0 0 0 3 12c0 4.642 3.358 8.56 7.812 9.396l5.916-5.916Z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="settings-page__field flex items-center justify-between py-2">
          <label
            htmlFor={themeToggleId}
            className="text-sm font-medium text-gray-900 dark:text-white"
          >
            Dark Mode
          </label>
          <button
            id={themeToggleId}
            type="button"
            role="switch"
            aria-checked={isDark}
            onClick={() => updateSettings({ theme: isDark ? "light" : "dark" })}
            className={`settings-page__toggle relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${
              isDark ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`settings-page__toggle-knob inline-block size-5 rounded-full bg-white transform transition-transform duration-200 ${
                isDark ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="mt-auto pt-4">
          <button
            type="submit"
            className="settings-page__save-btn w-full py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </form>

      {saveStatus !== "idle" && (
        <div
          role="status"
          aria-live="polite"
          className={`settings-page__snackbar fixed left-1/2 -translate-x-1/2 bottom-24 px-6 py-3 rounded-xl text-sm font-medium shadow-lg ${
            saveStatus === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {saveStatus === "success"
            ? "Settings saved."
            : "Failed to save settings."}
        </div>
      )}
    </div>
  );
}

export default SettingsPage;
