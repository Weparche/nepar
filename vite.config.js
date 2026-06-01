import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const SOCIAL_IMAGE_PATH = "/brand/web-app-manifest-512x512.png";

/** Static HTML sites in public/ (served at /vortex/, /zoyya/, etc.) */
const PUBLIC_STATIC_SITES = ["vortex", "zoyya"];

function publicStaticSitesPlugin() {
  return {
    name: "public-static-sites",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url ?? "";
        const pathname = rawUrl.split("?")[0]?.split("#")[0] ?? "";
        const search = rawUrl.includes("?") ? "?" + rawUrl.split("?")[1].split("#")[0] : "";

        for (const site of PUBLIC_STATIC_SITES) {
          if (pathname === `/${site}`) {
            res.writeHead(301, { Location: `/${site}/${search}` });
            res.end();
            return;
          }
          if (pathname === `/${site}/`) {
            req.url = `/${site}/index.html${search}`;
            break;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = (env.VITE_SITE_URL || "").replace(/\/$/, "");

  return {
    plugins: [
      react(),
      tailwindcss(),
      publicStaticSitesPlugin(),
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
