import fs from "fs";
import { makeApp } from "./interface/http/express-app.js";

["uploads", "outputs", "temp"].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d);
});

const app = makeApp({ uploads: "uploads", outputs: "outputs" });
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

app.listen(PORT, () => console.log(`🎬 HTTP on http://localhost:${PORT}`));
