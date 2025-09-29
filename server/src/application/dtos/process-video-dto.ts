export type ProcessVideoInput = {
  originalFilename: string;
  savedVideoPath: string;
};

export type ProcessVideoOutput = {
  success: boolean;
  message: string;
  zipFilename?: string;
  frameCount?: number;
  images?: string[];
};
