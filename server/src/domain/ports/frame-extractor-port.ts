export interface FrameExtractorPort {
  extractFrames(
    inputVideoPath: string,
    outputDir: string,
    fps: number
  ): Promise<string[]>;
}
