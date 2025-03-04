// ✅ Fix for "process is not defined" error
window.process = {
  env: {
    NODE_ENV: "development"
  }
};

import React from "react";
import ReactDOM from "react-dom/client";  // ✅ Use createRoot for React 18+
import "./index.css";  // ✅ Import CSS at the top
import App from "./App";  // ✅ Import main App component

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
