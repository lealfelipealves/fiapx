import { randomUUID } from "crypto";
import { UuidPort } from "../../domain/ports/uuid-port";

export class NodeUuid implements UuidPort {
  newId(): string {
    return randomUUID();
  }
}
