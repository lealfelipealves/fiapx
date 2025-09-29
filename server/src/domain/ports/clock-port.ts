export interface ClockPort {
  now(): Date;
  formatForPath(d: Date): string; // ex: 20060102_150405
}
