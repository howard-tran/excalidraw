import { createRoot } from "react-dom/client";
import { Excalidraw } from "@excalidraw/excalidraw";

createRoot(document.getElementById("root")).render(
  <div style={{ height: "100vh" }}>
    <Excalidraw />
  </div>,
);
