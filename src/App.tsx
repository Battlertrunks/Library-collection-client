import "./App.css";
import { routeTree } from "./routeTree.gen.ts";
import { createRouter, RouterProvider } from "@tanstack/react-router";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
