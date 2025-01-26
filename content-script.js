// content-script.js

// Listen for messages from the web app
window.addEventListener("message", (event) => {
    if (event.source !== window) return; // Only accept messages from the web app
  
    // Forward the message to the extension background script
    chrome.runtime.sendMessage(event.data, (response) => {
      console.log("Response from background script:", response);
    });
  });
  
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Forward messages from the extension back to the web app
    window.postMessage(message, "*");
  });
  