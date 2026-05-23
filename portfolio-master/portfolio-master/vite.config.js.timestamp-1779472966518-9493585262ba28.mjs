// vite.config.js
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy
} from "file:///C:/Users/eeshs/Downloads/portfolio-website-master/portfolio-website-master/portfolio-master/portfolio-master/node_modules/@remix-run/dev/dist/index.js";
import { defineConfig } from "file:///C:/Users/eeshs/Downloads/portfolio-website-master/portfolio-website-master/portfolio-master/portfolio-master/node_modules/vite/dist/node/index.js";
import jsconfigPaths from "file:///C:/Users/eeshs/Downloads/portfolio-website-master/portfolio-website-master/portfolio-master/portfolio-master/node_modules/vite-jsconfig-paths/dist/index.mjs";
import mdx from "file:///C:/Users/eeshs/Downloads/portfolio-website-master/portfolio-website-master/portfolio-master/portfolio-master/node_modules/@mdx-js/rollup/index.js";
import remarkFrontmatter from "file:///C:/Users/eeshs/Downloads/portfolio-website-master/portfolio-website-master/portfolio-master/portfolio-master/node_modules/remark-frontmatter/index.js";
import remarkMdxFrontmatter from "file:///C:/Users/eeshs/Downloads/portfolio-website-master/portfolio-website-master/portfolio-master/portfolio-master/node_modules/remark-mdx-frontmatter/index.js";
import rehypeImgSize from "file:///C:/Users/eeshs/Downloads/portfolio-website-master/portfolio-website-master/portfolio-master/portfolio-master/node_modules/rehype-img-size/index.js";
import rehypeSlug from "file:///C:/Users/eeshs/Downloads/portfolio-website-master/portfolio-website-master/portfolio-master/portfolio-master/node_modules/rehype-slug/index.js";
import rehypePrism from "file:///C:/Users/eeshs/Downloads/portfolio-website-master/portfolio-website-master/portfolio-master/portfolio-master/node_modules/@mapbox/rehype-prism/index.js";
var vite_config_default = defineConfig({
  assetsInclude: ["**/*.glb", "**/*.hdr", "**/*.glsl"],
  build: {
    assetsInlineLimit: 1024
  },
  server: {
    port: 7777
  },
  plugins: [
    mdx({
      rehypePlugins: [[rehypeImgSize, { dir: "public" }], rehypeSlug, rehypePrism],
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      providerImportSource: "@mdx-js/react"
    }),
    remixCloudflareDevProxy(),
    remix({
      routes(defineRoutes) {
        return defineRoutes((route) => {
          route("/", "routes/home/route.js", { index: true });
        });
      }
    }),
    jsconfigPaths()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxlZXNoc1xcXFxEb3dubG9hZHNcXFxccG9ydGZvbGlvLXdlYnNpdGUtbWFzdGVyXFxcXHBvcnRmb2xpby13ZWJzaXRlLW1hc3RlclxcXFxwb3J0Zm9saW8tbWFzdGVyXFxcXHBvcnRmb2xpby1tYXN0ZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGVlc2hzXFxcXERvd25sb2Fkc1xcXFxwb3J0Zm9saW8td2Vic2l0ZS1tYXN0ZXJcXFxccG9ydGZvbGlvLXdlYnNpdGUtbWFzdGVyXFxcXHBvcnRmb2xpby1tYXN0ZXJcXFxccG9ydGZvbGlvLW1hc3RlclxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvZWVzaHMvRG93bmxvYWRzL3BvcnRmb2xpby13ZWJzaXRlLW1hc3Rlci9wb3J0Zm9saW8td2Vic2l0ZS1tYXN0ZXIvcG9ydGZvbGlvLW1hc3Rlci9wb3J0Zm9saW8tbWFzdGVyL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHtcbiAgdml0ZVBsdWdpbiBhcyByZW1peCxcbiAgY2xvdWRmbGFyZURldlByb3h5Vml0ZVBsdWdpbiBhcyByZW1peENsb3VkZmxhcmVEZXZQcm94eSxcbn0gZnJvbSAnQHJlbWl4LXJ1bi9kZXYnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQganNjb25maWdQYXRocyBmcm9tICd2aXRlLWpzY29uZmlnLXBhdGhzJztcbmltcG9ydCBtZHggZnJvbSAnQG1keC1qcy9yb2xsdXAnO1xuaW1wb3J0IHJlbWFya0Zyb250bWF0dGVyIGZyb20gJ3JlbWFyay1mcm9udG1hdHRlcic7XG5pbXBvcnQgcmVtYXJrTWR4RnJvbnRtYXR0ZXIgZnJvbSAncmVtYXJrLW1keC1mcm9udG1hdHRlcic7XG5pbXBvcnQgcmVoeXBlSW1nU2l6ZSBmcm9tICdyZWh5cGUtaW1nLXNpemUnO1xuaW1wb3J0IHJlaHlwZVNsdWcgZnJvbSAncmVoeXBlLXNsdWcnO1xuaW1wb3J0IHJlaHlwZVByaXNtIGZyb20gJ0BtYXBib3gvcmVoeXBlLXByaXNtJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYXNzZXRzSW5jbHVkZTogWycqKi8qLmdsYicsICcqKi8qLmhkcicsICcqKi8qLmdsc2wnXSxcbiAgYnVpbGQ6IHtcbiAgICBhc3NldHNJbmxpbmVMaW1pdDogMTAyNCxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogNzc3NyxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIG1keCh7XG4gICAgICByZWh5cGVQbHVnaW5zOiBbW3JlaHlwZUltZ1NpemUsIHsgZGlyOiAncHVibGljJyB9XSwgcmVoeXBlU2x1ZywgcmVoeXBlUHJpc21dLFxuICAgICAgcmVtYXJrUGx1Z2luczogW3JlbWFya0Zyb250bWF0dGVyLCByZW1hcmtNZHhGcm9udG1hdHRlcl0sXG4gICAgICBwcm92aWRlckltcG9ydFNvdXJjZTogJ0BtZHgtanMvcmVhY3QnLFxuICAgIH0pLFxuICAgIHJlbWl4Q2xvdWRmbGFyZURldlByb3h5KCksXG4gICAgcmVtaXgoe1xuICAgICAgcm91dGVzKGRlZmluZVJvdXRlcykge1xuICAgICAgICByZXR1cm4gZGVmaW5lUm91dGVzKHJvdXRlID0+IHtcbiAgICAgICAgICByb3V0ZSgnLycsICdyb3V0ZXMvaG9tZS9yb3V0ZS5qcycsIHsgaW5kZXg6IHRydWUgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9KSxcbiAgICBqc2NvbmZpZ1BhdGhzKCksXG4gIF0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc2dCO0FBQUEsRUFDcGdCLGNBQWM7QUFBQSxFQUNkLGdDQUFnQztBQUFBLE9BQzNCO0FBQ1AsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sdUJBQXVCO0FBQzlCLE9BQU8sMEJBQTBCO0FBQ2pDLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8saUJBQWlCO0FBRXhCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLGVBQWUsQ0FBQyxZQUFZLFlBQVksV0FBVztBQUFBLEVBQ25ELE9BQU87QUFBQSxJQUNMLG1CQUFtQjtBQUFBLEVBQ3JCO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLE1BQ0YsZUFBZSxDQUFDLENBQUMsZUFBZSxFQUFFLEtBQUssU0FBUyxDQUFDLEdBQUcsWUFBWSxXQUFXO0FBQUEsTUFDM0UsZUFBZSxDQUFDLG1CQUFtQixvQkFBb0I7QUFBQSxNQUN2RCxzQkFBc0I7QUFBQSxJQUN4QixDQUFDO0FBQUEsSUFDRCx3QkFBd0I7QUFBQSxJQUN4QixNQUFNO0FBQUEsTUFDSixPQUFPLGNBQWM7QUFDbkIsZUFBTyxhQUFhLFdBQVM7QUFDM0IsZ0JBQU0sS0FBSyx3QkFBd0IsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUFBLFFBQ3BELENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxjQUFjO0FBQUEsRUFDaEI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
