import { StoragePort } from "../../domain/ports/storage-port";
import { ProcessedFileInfo } from "../dtos/status-dto";

export class ListProcessedUseCase {
  constructor(
    private readonly storage: StoragePort,
    private readonly outputsRoot: string,
    private readonly baseDownloadPath = "/download"
  ) {}

  async execute(): Promise<{ files: ProcessedFileInfo[]; total: number }> {
    const files = await this.storage.list(
      this.storage.join(this.outputsRoot, "*.zip")
    );
    const enriched: ProcessedFileInfo[] = [];

    for (const f of files) {
      const stat = await this.storage.fileStat(f);
      enriched.push({
        filename: this.storage.baseName(f),
        size: stat.size,
        createdAt: stat.mtime.toISOString(),
        downloadUrl: `${this.baseDownloadPath}/${this.storage.baseName(f)}`,
      });
    }

    // opcional: ordenar por data desc
    enriched.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    return { files: enriched, total: enriched.length };
  }
}
