// audioUtils.ts (in your React app)
export const playAudio = (audioName: string): void => {
    const audioPath = `/audio/${audioName}.mp3`; // Adjust path to your public folder
    const audio = new Audio(audioPath);

    audio.play().catch((error) => {
        console.error(`Error playing audio "${audioName}":`, error);
    });
};

// Predefined functions
export const playCongratulations = () => playAudio("congratulations");
export const playExposed1 = () => playAudio("exposed1");
export const playExposed2 = () => playAudio("exposed2");
export const playSTAHPPrompt = () => playAudio("STAHP");
