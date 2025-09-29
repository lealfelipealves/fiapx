import type { Request, Response } from "express";
import { QueuePort } from "../../../domain/ports/queue-port.js";

export class EnqueueController {
  constructor(private readonly queue: QueuePort) {}

  async handle(req: Request, res: Response) {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file)
      return res
        .status(400)
        .json({ success: false, message: "Nenhum arquivo enviado" });

    const jobId = await this.queue.addProcessVideoJob({
      originalFilename: file.originalname,
      savedVideoPath: file.path,
    });
    res.status(202).json({ enqueued: true, jobId });
  }
}
