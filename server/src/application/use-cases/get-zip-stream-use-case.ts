import { StoragePort } from "../../domain/ports/storage-port";

export class GetZipStreamUseCase {
  constructor(
    private readonly storage: StoragePort,
    private readonly outputsRoot: string
  ) {}

  async execute(filename: string) {
    const filePath = this.storage.join(this.outputsRoot, filename);
    const exists = await this.storage.fileExists(filePath);
    if (!exists) throw new Error("Arquivo não encontrado");
    return filePath; // controller decide como enviar (download/stream)
  }
}
