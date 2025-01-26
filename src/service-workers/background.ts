import {TimerMessage} from "../types/TimerMessage.ts";
import {TIMER} from "../enums/TIMER.ts";

const DEFAULT_VALUES = {
    workDuration: 40 * 60,
    breakDuration: 10 * 60,
    remainingTime: 40 * 60,
    isWorkPhase: true,
    timerRunning: false,
    audioComplete: undefined,
    showSettings: false,
};

const initializeDefaultValues = () => {
    chrome.storage.sync.get(null, (storedValues) => {
        const valuesToSet = Object.entries(DEFAULT_VALUES).reduce((acc, [key, value]) => {
            if (!(key in storedValues)) acc[key] = value;
            return acc;
        }, {} as Record<string, any>);

        if (Object.keys(valuesToSet).length > 0) {
            chrome.storage.sync.set(valuesToSet, () => {
                console.log("Initialized default values:", valuesToSet);
            });
        }
    });
};

const startTimer = (remainingTime: number, isWorkPhase: boolean) => {
    chrome.alarms.create("alarmGoBrrrr", {periodInMinutes: 1 / 60});
    chrome.storage.sync.set({timerRunning: true, remainingTime, isWorkPhase}, () => {
        console.log("Timer started.");
    });
};

const pauseTimer = () => {
    chrome.alarms.clear("alarmGoBrrrr", (wasCleared) => {
        if (wasCleared) console.log("Timer paused.");
    });
    chrome.storage.sync.set({timerRunning: false});
};

const stopTimer = () => {
    chrome.storage.sync.get(["workDuration"], ({workDuration}) => {
        chrome.alarms.clear("alarmGoBrrrr", (wasCleared) => {
            if (wasCleared) console.log("Timer stopped.");
        });
        chrome.storage.sync.set({
            remainingTime: workDuration,
            isWorkPhase: true,
            timerRunning: false,
        });
    });
};

const resetTimer = () => {
    chrome.alarms.clear("alarmGoBrrrr", (wasCleared) => {
        if (wasCleared) console.log("Timer reset.");
    });
    chrome.storage.sync.set({
        ...DEFAULT_VALUES,
        timerRunning: false,
    });
};

const handleAlarm = () => {
    chrome.storage.sync.get(
        ["remainingTime", "isWorkPhase", "timerRunning", "workDuration", "breakDuration"],
        ({remainingTime, isWorkPhase, timerRunning, workDuration, breakDuration}) => {
            if (!timerRunning) return;

            const newRemainingTime = remainingTime - 1;

            if (newRemainingTime < 0) {
                if (isWorkPhase) {
                    chrome.storage.sync.set({
                        remainingTime: breakDuration,
                        isWorkPhase: false,
                        timerRunning: true,
                    });
                } else {
                    chrome.storage.sync.set({
                        remainingTime: workDuration,
                        isWorkPhase: true,
                        timerRunning: false,
                    });
                    chrome.alarms.clear("alarmGoBrrrr", (wasCleared) => {
                        if (wasCleared) console.log("Break ended, timer stopped.");
                    });
                }
            } else {
                chrome.storage.sync.set({remainingTime: newRemainingTime});
            }
        }
    );
};

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed.");
    initializeDefaultValues();
});

chrome.runtime.onMessage.addListener((request: TimerMessage, _sender, sendResponse) => {
    console.log("Message received in background:", request);

    switch (request.action) {
        case TIMER.START:
            startTimer(request.remainingTime, request.isWorkPhase);
            break;
        case TIMER.PAUSE:
            pauseTimer();
            break;
        case TIMER.STOP:
            stopTimer();
            break;
        case TIMER.RESET:
            resetTimer();
            break;
        default:
            console.warn(`Unhandled action: ${request.action}`);
    }

    sendResponse({status: "success"});
    return true;
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "alarmGoBrrrr") {
        handleAlarm();
    }
});
