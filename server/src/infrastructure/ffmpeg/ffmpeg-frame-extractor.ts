import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { exec as execCb } from "child_process";
import { promisify } from "util";
import { FrameExtractorPort } from "../../domain/ports/frame-extractor-port";
import { StoragePort } from "../../domain/ports/storage-port";

const exec = promisify(execCb);
const BIN = process.env.FFMPEG_PATH ?? ffmpegInstaller.path; // permite override por env

export class FFmpegFrameExtractor implements FrameExtractorPort {
  constructor(private readonly storage: StoragePort) {}

  async extractFrames(
    inputVideoPath: string,
    outputDir: string,
    fps: number
  ): Promise<string[]> {
    await this.storage.ensureDir(outputDir);
    const pattern = this.storage.join(outputDir, "frame_%04d.png");
    try {
      await exec(
        `"${BIN}" -i "${inputVideoPath}" -vf fps=${fps} -y "${pattern}"`
      );
    } catch (e: any) {
      throw new Error(`ffmpeg falhou: ${e?.stderr ?? e?.message ?? e}`);
    }
    return this.storage.list(this.storage.join(outputDir, "*.png"));
  }
}
