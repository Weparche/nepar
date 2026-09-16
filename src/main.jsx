import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import App from "./App.jsx";
import DigitalPriceListGuidePage, { isDigitalPriceListGuidePath } from "./DigitalPriceListGuidePage.jsx";
import "@fontsource-variable/inter";
import "./styles.css";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const pathname = window.location.pathname !== "/"
  ? window.location.pathname.replace(/\/+$/, "")
  : "/";
const page = isDigitalPriceListGuidePath(pathname)
  ? <DigitalPriceListGuidePage routePath={pathname} />
  : <App />;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      {page}
    </MotionConfig>
  </StrictMode>,
);
