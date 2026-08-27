import { createFileRoute, useRouter } from "@tanstack/react-router";
import SettingsPage from "../components/settings-page/SettingsPage";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
    return <SettingsPage onClose={() => {
        if (router.history.canGoBack()) {
            router.history.back();
        } else {
            router.navigate({ to: "/" })
        }
    }} />;
}
