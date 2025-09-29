import { JobsOptions, Queue, QueueEvents, Worker } from "bullmq";
import IORedis from "ioredis";
import { ProcessVideoUseCase } from "../../application/use-cases/process-video-use-case";
import { QueuePort } from "../../domain/ports/queue-port";

export class BullQueue implements QueuePort {
  private queue: Queue;
  private connection: IORedis;

  constructor(
    name: string,
    redisUrl = process.env.REDIS_URL || "redis://localhost:6379"
  ) {
    this.connection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null, // ✅ fix
      enableReadyCheck: false,
    });

    this.queue = new Queue(name, { connection: this.connection });
  }

  async addProcessVideoJob(payload: {
    originalFilename: string;
    savedVideoPath: string;
  }) {
    const opts: JobsOptions = {
      attempts: 2,
      removeOnComplete: 100,
      removeOnFail: 50,
    };
    const job = await this.queue.add("process-video", payload, opts);
    return job.id as string;
  }

  static makeWorker(
    name: string,
    usecase: ProcessVideoUseCase,
    redisUrl = process.env.REDIS_URL || "redis://localhost:6379",
    concurrency = Number(process.env.WORKER_CONCURRENCY || 2)
  ) {
    const connection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null, // ✅ fix
      enableReadyCheck: false,
    });

    const worker = new Worker(
      name,
      async (job) => {
        if (job.name !== "process-video") return;
        const { originalFilename, savedVideoPath } = job.data;
        return usecase.execute({ originalFilename, savedVideoPath });
      },
      { connection, concurrency }
    );

    const events = new QueueEvents(name, { connection });
    events.on("failed", ({ jobId, failedReason }) =>
      console.error(`[queue] job ${jobId} failed:`, failedReason)
    );
    events.on("completed", ({ jobId }) =>
      console.log(`[queue] job ${jobId} completed`)
    );

    return { worker, events };
  }
}
