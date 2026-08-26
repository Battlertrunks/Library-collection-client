import { describe, it, expect, beforeEach } from "vitest";
import { renderToString } from "react-dom/server";
import SettingsPage from "./SettingsPage";

describe("SettingsPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the settings heading", () => {
    const html = renderToString(<SettingsPage onClose={() => {}} />);
    expect(html).toContain("Settings");
  });

  it("renders first and last name inputs", () => {
    const html = renderToString(<SettingsPage onClose={() => {}} />);
    expect(html).toContain("First Name");
    expect(html).toContain("Last Name");
  });

  it("renders the optional Google Books API key input", () => {
    const html = renderToString(<SettingsPage onClose={() => {}} />);
    expect(html).toContain("Google Books API Key");
    expect(html).toContain("optional");
  });

  it("renders the dark mode toggle", () => {
    const html = renderToString(<SettingsPage onClose={() => {}} />);
    expect(html).toContain("Dark Mode");
  });

  it("renders the close and save buttons", () => {
    const html = renderToString(<SettingsPage onClose={() => {}} />);
    expect(html).toContain("Close settings");
    expect(html).toContain("Save Settings");
  });
});
