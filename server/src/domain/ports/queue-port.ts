export interface QueuePort {
  addProcessVideoJob(payload: {
    originalFilename: string;
    savedVideoPath: string;
  }): Promise<string>; // returns jobId
}
