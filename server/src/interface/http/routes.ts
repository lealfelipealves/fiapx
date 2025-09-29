import type { Express } from "express";
import type multer from "multer";
import { container } from "../../composition/container";

export function routes(app: Express, upload: ReturnType<typeof multer>) {
  const {
    uploadController,
    statusController,
    downloadController,
    enqueueController,
  } = container();

  app.post("/enqueue", upload.single("video"), (req, res) =>
    enqueueController.handle(req, res)
  );

  app.post("/upload", upload.single("video"), (req, res) =>
    uploadController.handle(req, res)
  );

  app.get("/api/status", (req, res) => statusController.handle(req, res));
  app.get("/download/:filename", (req, res) =>
    downloadController.handle(req, res)
  );
}
