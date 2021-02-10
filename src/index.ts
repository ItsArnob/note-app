import express from "express";
import path from "path";
import router from "./routes/router";

const app = express();
const port = process.env.PORT || 8080;

app.use("/public", express.static(path.join(__dirname, "..", "public")));
app.use(router);

app.listen(port);
console.log(`Listening on port ${port}`);