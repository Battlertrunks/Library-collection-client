import { createFileRoute } from "@tanstack/react-router";
import Series from "../components/series-page/Series";

export const Route = createFileRoute("/series")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Series />
    </div>
  );
}
