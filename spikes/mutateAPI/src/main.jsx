import { createRoot } from "react-dom/client";
import {
  Excalidraw,
  convertToExcalidrawElements,
} from "@excalidraw/excalidraw";

const elements = convertToExcalidrawElements([
  {
    type: "text",
    x: 100,
    y: 100,
    text: "HELLO WORLD!",
  },
  {
    type: "text",
    x: 100,
    y: 200,
    text: "STYLED HELLO WORLD!",
    fontSize: 20,
    strokeColor: "#5f3dc4",
  },
]);

console.log(elements);

createRoot(document.getElementById("root")).render(
  <div style={{ height: "100vh" }}>
    <Excalidraw initialData={{ elements }} />
  </div>,
);
