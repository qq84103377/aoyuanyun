const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const envConf = require('./env-config');
// const XPageJson = require('./plugins/XPageJson/index.js');

const assetShadowUrl = "http://img.asset/";

const assetUrl = envConf.assetUrl;
const apiUrl = envConf.apiUrl;
const clientId = envConf.clientId;

function resolve(dir) {
  return path.join(__dirname, dir);
}

function getAssets(req, resp) {
  try {
    let api = req.originalUrl.split("/").pop();
    const file = path.join(__dirname, "./mock/img/", api);
    // console.log("webpack-dev-server mock asset : ", file);
    fs.createReadStream(file).pipe(resp);
  } catch (e) {
    // console.log(e);
  }
}

function getJson(req, resp) {
  try {
    let api = req.originalUrl.split("/").pop();
    resp.setHeader("Content-Type", "application/json");
    const file = path.join(
      __dirname,
      "./mock/api/",
      api.replace("do", "json")
    );
    // console.log("webpack-dev-server mock api : ", file);
    fs.createReadStream(file).pipe(resp);
  } catch (e) {
    // console.log(e);
  }
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set("@", resolve("src"));

    config.module
      .rule("url-replace")
      .test(/\.(vue|js|json)$/i)
      .use("url-replace-loader")
      .loader("url-replace-loader")
      .options({
        to: assetUrl,
        from: assetShadowUrl
      })
      .end();
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `
                // 图片预置域名
                $ui-asset-url: '${assetUrl}';
                @import "~@/scss/index.scss";
                `
      }
    }
  },
  configureWebpack: {
    resolveLoader: {
      modules: ["node_modules", "./loader/"]
    },
    plugins: [
      new webpack.DefinePlugin({
        API_URL: `"${apiUrl}"`,
        IMG_URL: `"${assetUrl}"`,
        MSG_ENV: `"${envConf.ENV}"`,
        CLIENT_ID: `"${clientId}"`,
      }),
    //   new XPageJson()
    ]
  },
  devServer: {
    open: false,
    host: "0.0.0.0",
    port: 8082,
    https: false,
    hotOnly: false,
    proxy: {
      "/api": {
        target: "http://localhost:8082",
        changeOrigin: true,
        // ws: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    },
    before(app) {
      app.get("/mock/img/*", getAssets);
      app.get("/mock/api/*", getJson);
      app.post("/mock/api/*", getJson);
    }
  }
};
