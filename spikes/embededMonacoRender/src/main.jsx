import { useState } from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  const [src, setSrc] = useState("/embeddedRender.html");
  const [key, setKey] = useState(0);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          padding: "8px 12px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <strong>embeddedMonacoRender</strong>
        <input
          value={src}
          onChange={(event) => setSrc(event.target.value)}
          style={{ flex: 1, padding: "6px 8px" }}
        />
        <button type="button" onClick={() => setKey((value) => value + 1)}>
          Reload iframe
        </button>
      </header>
      <iframe
        key={key}
        title="embedded-monaco"
        src={src}
        sandbox="allow-scripts allow-same-origin"
        style={{ flex: 1, minHeight: 0, border: 0 }}
      />
    </div>
  );
};

createRoot(document.getElementById("root")).render(<App />);
