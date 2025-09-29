import { ClockPort } from "../../domain/ports/clock-port";

export class SystemClock implements ClockPort {
  now(): Date {
    return new Date();
  }
  // Ex.: 20240929_123455
  formatForPath(d: Date): string {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(
      d.getHours()
    )}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  }
}
