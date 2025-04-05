import React from "react";
import ReactDOM from "react-dom/client";
import GameWrapper from "@/features/core/GameWrapper";
import "./index.css"; // Import global styles (including Tailwind)

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element with id 'root'");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <main className="min-h-screen p-8 bg-slate-900 text-white">
    <GameWrapper />
  </main>,
);
