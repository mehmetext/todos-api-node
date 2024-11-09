import "module-alias/register";
import app from "./app";

app.get("/", (req, res) => {
  res.send("Hello, world!");
});
