import type { Request, Response } from "express";
import { ProcessVideoUseCase } from "../../../application/use-cases/process-video-use-case";

export class UploadController {
  constructor(
    private readonly usecase: ProcessVideoUseCase,
    private readonly paths: { uploadsRoot: string }
  ) {}

  async handle(req: Request, res: Response) {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file)
      return res
        .status(400)
        .json({ success: false, message: "Nenhum arquivo enviado" });

    const result = await this.usecase.execute({
      originalFilename: file.originalname,
      savedVideoPath: file.path,
    });

    const status = result.success ? 200 : 400;
    return res.status(status).json({
      success: result.success,
      message: result.message,
      zip_path: result.zipFilename,
      frame_count: result.frameCount,
      images: result.images,
    });
  }
}
