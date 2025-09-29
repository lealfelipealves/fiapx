export type ProcessingResult = {
  success: boolean;
  message: string;
  zipFilename?: string;
  frameCount?: number;
  images?: string[];
};

export class VideoProcessing {
  static validExtensions = [
    ".mp4",
    ".avi",
    ".mov",
    ".mkv",
    ".wmv",
    ".flv",
    ".webm",
  ];

  static isValidVideo(filename: string) {
    const lower = filename.toLowerCase();
    return this.validExtensions.some((ext) => lower.endsWith(ext));
  }
}
