import type { Request, Response } from "express";
import { ListProcessedUseCase } from "../../../application/use-cases/list-processed-use-case";

export class StatusController {
  constructor(private readonly usecase: ListProcessedUseCase) {}

  async handle(_req: Request, res: Response) {
    const data = await this.usecase.execute();
    return res.json(data);
  }
}
