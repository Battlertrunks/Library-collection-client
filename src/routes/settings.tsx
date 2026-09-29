import { createFileRoute } from "@tanstack/react-router";
import SettingsRoute from "../components/settings-page/SettingsRoute";

export const Route = createFileRoute("/settings")({
  component: SettingsRoute,
});
