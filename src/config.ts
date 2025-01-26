// src/config.ts
export const DEFAULT_VALUES = {
    workDuration: 40 * 60, // 40 minutes
    breakDuration: 10 * 60, // 10 minutes
    remainingTime: 40 * 60, // Initial remaining time
    isWorkPhase: true,
    timerRunning: false,
    showSettings: false,
    loops: 3,
    loopsCurrent: 1,
};

/**
 * Initialize default values in chrome.storage.sync.
 */
export const initializeDefaultValues = () => {
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
