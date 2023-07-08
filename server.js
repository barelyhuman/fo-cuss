require("dotenv").config();

const Koa = require("koa");
const serve = require("koa-static");
const path = require("path");
const axios = require("axios");

const app = new Koa();

// Redirect all other requests to the index.html file
app.use(async (ctx, next) => {
  if (ctx.path === "/api/random") {
    const sp = new URLSearchParams();
    sp.append("categories", "010");
    sp.append("sorting", "random");
    sp.append("ratio", "16:9");
    const response = await axios
      .get(`http://wallhaven.cc/api/v1/search?${sp.toString()}`)
      .then((x) => {
        return x.data;
      });

    ctx.status = 200;
    ctx.body = response.data ? response.data[0] : {};
    return;
  }
  await next();
});

app.use(serve(path.join(__dirname, "dist")));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
