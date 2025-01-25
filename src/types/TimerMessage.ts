import {TIMER} from "../enums/TIMER.ts";

export type TimerMessage = {
  action: TIMER;
  remainingTime: string;
  isWorkPhase: boolean;
};