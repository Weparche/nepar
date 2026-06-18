import { onRequest as __zgalarm_api___path___js_onRequest } from "C:\\Nepar\\functions\\zgalarm\\api\\[[path]].js"
import { onRequest as __zgvrticradar_api___path___js_onRequest } from "C:\\Nepar\\functions\\zgvrticradar\\api\\[[path]].js"
import { onRequest as __zgalarm___path___js_onRequest } from "C:\\Nepar\\functions\\zgalarm\\[[path]].js"
import { onRequest as __zgvrticradar___path___js_onRequest } from "C:\\Nepar\\functions\\zgvrticradar\\[[path]].js"

export const routes = [
    {
      routePath: "/zgalarm/api/:path*",
      mountPath: "/zgalarm/api",
      method: "",
      middlewares: [],
      modules: [__zgalarm_api___path___js_onRequest],
    },
  {
      routePath: "/zgvrticradar/api/:path*",
      mountPath: "/zgvrticradar/api",
      method: "",
      middlewares: [],
      modules: [__zgvrticradar_api___path___js_onRequest],
    },
  {
      routePath: "/zgalarm/:path*",
      mountPath: "/zgalarm",
      method: "",
      middlewares: [],
      modules: [__zgalarm___path___js_onRequest],
    },
  {
      routePath: "/zgvrticradar/:path*",
      mountPath: "/zgvrticradar",
      method: "",
      middlewares: [],
      modules: [__zgvrticradar___path___js_onRequest],
    },
  ]