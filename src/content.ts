const entireDom = document.documentElement.outerHTML;

if (entireDom) {
    console.log(entireDom);
    async function sendMessage() {
        let response = await chrome.runtime.sendMessage({ message: "dom-content", data: entireDom });
        console.log(response.farewell);
    }
    sendMessage();
}
