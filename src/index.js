import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Fix for process error
window.process = { env: { NODE_ENV: "development" } };

// Create React root
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
