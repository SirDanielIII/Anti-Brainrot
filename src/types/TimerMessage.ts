import {TIMER} from "../enums/TIMER.ts";

export type TimerMessage = {
  action: TIMER;
  remainingTime: number;
  isWorkPhase: boolean;
};