import { Outlet, createRootRoute } from "@tanstack/react-router";
import MobileNav from "../components/MobileNav";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div>
      <Outlet />
      <MobileNav />
    </div>
  );
}
