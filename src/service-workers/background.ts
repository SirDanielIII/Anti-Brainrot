// background.js

// Add an event listener for when the extension is installed or updated
import {TimerMessage} from "../types/TimerMessage.ts";
import {TIMER} from "../enums/TIMER.ts";

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed and loaded!');

    // Define the default values
    const defaultValues = {
        workDuration: 40 * 60, // 40 minutes in seconds
        breakDuration: 10 * 60, // 10 minutes in seconds
        remainingTime: 40 * 60, // Initial time as a string
        isWorkPhase: true, // Default phase is work
        timerRunning: false,
        audioComplete: undefined,
        showSettings: false
    };

    // Get the current values from sync storage
    chrome.storage.sync.get(null, (storedValues) => {
        // Prepare an object for any missing default values
        const valuesToSet = {};

        for (const [key, defaultValue] of Object.entries(defaultValues)) {
            // Only add to valuesToSet if the key is missing in storedValues
            if (!(key in storedValues)) {
                valuesToSet[key] = defaultValue;
            }
        }

        // If there are any missing values, set them in sync storage
        if (Object.keys(valuesToSet).length > 0) {
            chrome.storage.sync.set(valuesToSet, () => {
                console.log("Set default values for", valuesToSet);
            });
        } else {
            console.log("All default values already exist. No updates needed.");
        }
    });
});

chrome.runtime.onMessage.addListener(
    function (request: TimerMessage, _sender, sendResponse) {
        console.log("Message received in background:", request);
        console.log(request);
        switch (request.action) {
            case TIMER.START:
                console.log("Timer started:", request.remainingTime, request.isWorkPhase);
                // Create an alarm that fires every 5 seconds
                chrome.alarms.create("alarmGoBrrrr", {
                    periodInMinutes: 1 / 60, // Convert 5 seconds to minutes
                });
                break;
            case TIMER.RESET:
                chrome.alarms.clear("alarmGoBrrrr", (wasCleared) => {
                    if (wasCleared) {
                        console.log("Alarm stopped!");
                    } else {
                        console.log("Failed to stop the alarm");
                    }
                });
        }

        sendResponse({status: "success"});
        return true;
    }
);

chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
        if (request?.message.length > 0) {
            console.log(request.message);
            let isLookingAway = request.isLookingAway ? true : false;
            chrome.storage.sync.set({ isLookingAway: isLookingAway })
            sendResponse({ message: "goodbye" });
            console.log(isLookingAway);
        }
    });
