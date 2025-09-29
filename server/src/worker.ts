import { container } from "./composition/container";
import { BullQueue } from "./infrastructure/queue/bull-queue";

const c = container();
const { processVideoUseCase } = c;

BullQueue.makeWorker("video-jobs", processVideoUseCase);
console.log("Worker up. Concurrency:", process.env.WORKER_CONCURRENCY || 2);
