import { createFileRoute } from "@tanstack/react-router";
import HomePage from "../components/home-page/HomePage";

export const Route = createFileRoute("/")({
  component: HomePage,
});
