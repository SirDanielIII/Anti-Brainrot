# Anti-Brainrot

WE DESTROYING BRAINROT WITH THIS ONE 🗣️🗣️🗣️💯💯💯

---

## How to Contribute

Follow these steps to run the extension:

1. **Clone this repository** to your local machine.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Build the project**:
   ```bash
   npm run build
   ```
4. **Load the extension as an unpacked extension**:
    - Open Chrome and navigate to `chrome://extensions` in a new tab.
    - Enable **Developer Mode** (toggle in the top-right corner).
    - Click the **Load unpacked** button (top-left corner) and select the `dist` folder inside this project.
5. Once loaded, click the extension icon in the Chrome toolbar to view the popup or let it run in the background as configured.

For more details, visit the [official Chrome Extensions tutorial](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world).

---

## First-Time Setup in WebStorm

If you're using WebStorm for development, follow these steps to configure it for Chrome Extension development:

1. Open the **Settings** dialog: `File > Settings`.
2. Navigate to: `Languages & Frameworks > JavaScript > Libraries`.
3. Click the **Download** button.
4. From the **TypeScript community stubs** list (should be default), find and select **chrome** (you can quickly find it by typing `chrome` in the search bar).
5. Click **Download and Install**.
6. Close the Settings dialog by clicking **OK**.

---

## Development Workflow

1. **Start the Development Server**
   ```bash
   npm run dev
   ```
   This serves your project for local development. However, Chrome Extensions require files to be rebuilt for loading in the browser, so remember to build before testing.

2. **Rebuild for Testing**
   Before loading the extension in Chrome, ensure it's built:
   ```bash
   npm run build
   ```

---
