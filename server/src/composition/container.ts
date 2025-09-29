import { FFmpegFrameExtractor } from "../infrastructure/ffmpeg/ffmpeg-frame-extractor";
import { NodeUuid } from "../infrastructure/id/node-uuid";
import { BullQueue } from "../infrastructure/queue/bull-queue";
import { FSStorage } from "../infrastructure/storage/fs-storage";
import { SystemClock } from "../infrastructure/time/system-clock";
import { ArchiverZipService } from "../infrastructure/zip/archiver-zip-service";

import { GetZipStreamUseCase } from "../application/use-cases/get-zip-stream-use-case";
import { ListProcessedUseCase } from "../application/use-cases/list-processed-use-case";
import { ProcessVideoUseCase } from "../application/use-cases/process-video-use-case";

import { DownloadController } from "../interface/http/controllers/download-controller";
import { EnqueueController } from "../interface/http/controllers/enqueue-controller";
import { StatusController } from "../interface/http/controllers/status-controller";
import { UploadController } from "../interface/http/controllers/upload-controller";

export function container() {
  const storage = new FSStorage();
  const frames = new FFmpegFrameExtractor(storage);
  const zip = new ArchiverZipService();
  const uuid = new NodeUuid();
  const clock = new SystemClock();
  const queue = new BullQueue("video-jobs");

  const paths = { tempRoot: "temp", outputsRoot: "outputs" };

  const processUC = new ProcessVideoUseCase(
    frames,
    zip,
    storage,
    uuid,
    clock,
    paths
  );
  const listUC = new ListProcessedUseCase(storage, paths.outputsRoot);
  const getZipUC = new GetZipStreamUseCase(storage, paths.outputsRoot);

  const enqueueController = new EnqueueController(queue);
  const uploadController = new UploadController(processUC, {
    uploadsRoot: "uploads",
  });
  const statusController = new StatusController(listUC);
  const downloadController = new DownloadController(getZipUC);

  return {
    uploadController,
    statusController,
    downloadController,
    processVideoUseCase: processUC,
    enqueueController,
  };
}
