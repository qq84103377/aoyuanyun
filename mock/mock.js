/*
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-06-23 16:34:14
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-07-01 17:06:00
 */
const fs = require("fs");
const path = require("path");

const express = require("express");

function getAssets(req, resp) {
    try {
        let api = req.originalUrl.split("/mock/img/").pop();
        const file = path.join(__dirname, "./img/", api);
        // console.log('mock assets : ', file);
        fs.createReadStream(file).pipe(
            resp
        );
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
            "./api/",
            api.replace("do", "json")
        );
        // console.log('mock api : ', file);
        fs.createReadStream(file).pipe(resp);
    } catch (e) {
        // console.log(e);
    }
}

const app = express();

app.get('/mock/img/*', getAssets);

app.get('/mock/api/*', getJson);
app.post('/mock/api/*', getJson);

app.listen(8082, () => {
    console.log("Your server is running here: http://0.0.0.0:8082");
});