import type { Request, Response } from "express";
import { GetZipStreamUseCase } from "../../../application/use-cases/get-zip-stream-use-case";

export class DownloadController {
  constructor(private readonly usecase: GetZipStreamUseCase) {}
  async handle(req: Request, res: Response) {
    try {
      const filePath = await this.usecase.execute(req.params.filename);
      return res.download(filePath);
    } catch {
      return res.status(404).json({ error: "Arquivo não encontrado" });
    }
  }
}
