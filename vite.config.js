import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const SOCIAL_IMAGE_PATH = "/brand/web-app-manifest-512x512.png";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = (env.VITE_SITE_URL || "").replace(/\/$/, "");

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "html-social-meta",
        transformIndexHtml(html) {
          const ogImage = siteUrl
            ? `${siteUrl}${SOCIAL_IMAGE_PATH}`
            : SOCIAL_IMAGE_PATH;
          const ogUrlMeta = siteUrl
            ? `<meta property="og:url" content="${siteUrl}/" />`
            : "";
          return html
            .replace("%OG_URL_META%", ogUrlMeta)
            .replaceAll("%OG_IMAGE%", ogImage);
        },
      },
    ],
  };
});
