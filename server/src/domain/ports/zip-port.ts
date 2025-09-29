export interface ZipPort {
  createZipFromFiles(files: string[], zipOutputPath: string): Promise<void>;
}
