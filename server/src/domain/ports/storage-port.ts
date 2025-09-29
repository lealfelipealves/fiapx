export interface StoragePort {
  ensureDir(path: string): Promise<void>;
  remove(path: string): Promise<void>;
  removeIfExists(path: string): Promise<void>;
  list(patternGlob: string): Promise<string[]>;
  fileExists(path: string): Promise<boolean>;
  fileStat(path: string): Promise<{ size: number; mtime: Date }>;
  baseName(path: string): string;
  join(...parts: string[]): string;
  writeStreamToFile(
    stream: NodeJS.ReadableStream,
    outPath: string
  ): Promise<void>;
  // util:
  saveBuffer(buffer: Buffer, outPath: string): Promise<void>;
}
