import { useRouter } from "@tanstack/react-router";
import SettingsPage from "./SettingsPage";

function SettingsRoute() {
  const router = useRouter();

  return (
    <SettingsPage
      onClose={() => {
        if (router.history.canGoBack()) {
          router.history.back();
        } else {
          router.navigate({ to: "/" });
        }
      }}
    />
  );
}

export default SettingsRoute;
