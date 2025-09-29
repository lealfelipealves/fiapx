import { VideoProcessing } from "../../domain/entities/video-processing";
import { ClockPort } from "../../domain/ports/clock-port";
import { FrameExtractorPort } from "../../domain/ports/frame-extractor-port.js";
import { StoragePort } from "../../domain/ports/storage-port.js";
import { UuidPort } from "../../domain/ports/uuid-port.js";
import { ZipPort } from "../../domain/ports/zip-port.js";
import {
  ProcessVideoInput,
  ProcessVideoOutput,
} from "../dtos/process-video-dto.js";

export class ProcessVideoUseCase {
  constructor(
    private readonly frames: FrameExtractorPort,
    private readonly zip: ZipPort,
    private readonly storage: StoragePort,
    private readonly uuid: UuidPort,
    private readonly clock: ClockPort,
    private readonly paths: { tempRoot: string; outputsRoot: string }
  ) {}

  async execute(input: ProcessVideoInput): Promise<ProcessVideoOutput> {
    if (!VideoProcessing.isValidVideo(input.originalFilename)) {
      return { success: false, message: "Formato não suportado." };
    }

    const ts = this.clock.formatForPath(this.clock.now());
    const tempDir = this.storage.join(
      this.paths.tempRoot,
      ts + "_" + this.uuid.newId()
    );
    await this.storage.ensureDir(tempDir);

    try {
      const frames = await this.frames.extractFrames(
        input.savedVideoPath,
        tempDir,
        1
      );
      if (!frames.length) {
        return { success: false, message: "Nenhum frame extraído." };
      }

      const zipFilename = `frames_${ts}.zip`;
      const zipPath = this.storage.join(this.paths.outputsRoot, zipFilename);
      await this.zip.createZipFromFiles(frames, zipPath);

      await this.storage.removeIfExists(input.savedVideoPath);
      await this.storage.remove(tempDir);

      return {
        success: true,
        message: `Processamento concluído! ${frames.length} frames extraídos.`,
        zipFilename,
        frameCount: frames.length,
        images: frames.map((f) => this.storage.baseName(f)),
      };
    } catch (e: any) {
      await this.storage.remove(tempDir).catch(() => {});
      return {
        success: false,
        message: `Erro ao processar: ${e?.message ?? e}`,
      };
    }
  }
}
