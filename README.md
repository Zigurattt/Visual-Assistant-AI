

# Visual Assistant AI 🤖✨

**Version: 2.4.3**

An interactive, multi-lingual visual assistant that identifies objects, translates text, and provides insightful analysis using your device's camera and the power of Google's Gemini AI. This application runs entirely in the browser with no build step required.

![Visual Assistant AI Screenshot](https://i.imgur.com/gTG9a03.gif)
*(A GIF showcasing some of the app's features)*

---

## 🚀 Key Features

*   **Real-Time Object Recognition**: Identifies the main object in the camera's view using the Gemini model.
*   **Multi-Object Detection**: Describes not just the primary object but also other surrounding items in the scene.
*   **Live Text Detection & Translation**: Detects text on scanned objects and instantly translates it to the user's selected language.
*   **Voice Interaction**:
    *   **Speech-to-Text**: Ask follow-up questions about an object using your voice.
    *   **Text-to-Speech**: Listen to descriptions and answers in a natural-sounding voice.
*   **🧠 Insight Chat**: A dedicated chat mode with "Insighto," an AI persona that provides poetic, psychological, and symbolic interpretations of your scanned objects.
*   **⭐ Collection Management**: Save interesting objects you scan to a personal, browsable collection.
*   **📍 Geolocation & Interactive Map**:
    *   Automatically tags collected items with the location where they were scanned.
    *   View your collection on an interactive Leaflet map.
*   **📄 PDF Generation**: Create a detailed PDF summary for any scanned item, including its image and description.
*   **📱 QR & Barcode Scanner**: A built-in utility to quickly scan and open links from QR codes and barcodes.
*   **🌐 Multi-Language Support**: Fully localized UI and AI responses in English, Turkish, Spanish, Portuguese, and German.
*   **🎨 Theming**: Switch between a sleek light and dark mode.
*   **🔐 User Authentication**: A complete user registration and login flow with real-time email verification via Disify (a free, keyless service).

## 🛠️ Tech Stack

*   **Frontend**: React, TypeScript, Tailwind CSS
*   **AI & Vision**: Google Gemini API (`@google/genai`)
*   **Email Verification**: Disify API
*   **Web APIs**:
    *   Web Speech API (SpeechRecognition & SpeechSynthesis)
    *   Geolocation API
    *   MediaDevices (getUserMedia for camera access)
*   **Mapping**: [Leaflet.js](https://leafletjs.com/)
*   **QR Scanning**: [html5-qrcode](https://github.com/mebjas/html5-qrcode)
*   **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)
*   **Runtime**: Runs directly in the browser using ES Modules and an `importmap`. **No build tools required!**

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need a modern web browser and an API key for the following service:

*   **Google Gemini**: Visit the [Google AI Studio](https://aistudio.google.com/app/apikey) to create your free API key.

### Installation & Running

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/visual-assistant-ai.git
    cd visual-assistant-ai
    ```

2.  **Set up API Keys:**

    The application is hardcoded to look for API keys in `process.env`. Since this is a browser-based project without a build step, you need to make these keys available. A simple way is to use a local web server that can replace these placeholders.

    **Example using `npx` and a helper script:**

    a. Create a setup script, for example `setup-dev.js`:
       ```javascript
       // setup-dev.js
       const fs = require('fs');
       const path = require('path');

       const geminiApiKey = process.env.GEMINI_API_KEY;
       if (!geminiApiKey) {
         console.error('Error: GEMINI_API_KEY environment variable must be set.');
         process.exit(1);
       }

       // Inject Gemini Key
       const geminiServicePath = path.join(__dirname, 'services', 'geminiService.ts');
       let geminiServiceContent = fs.readFileSync(geminiServicePath, 'utf8');
       geminiServiceContent = geminiServiceContent.replace(
         `process.env.API_KEY`,
         `'${geminiApiKey}'`
       );
       fs.writeFileSync(geminiServicePath, geminiServiceContent);
       console.log('Successfully injected Gemini API key.');
       ```
    b. Run the script before starting your server. Replace the placeholder with your actual key.
       ```sh
       # For Windows
       set GEMINI_API_KEY=YOUR_GEMINI_KEY_HERE
       
       # For macOS/Linux
       export GEMINI_API_KEY="YOUR_GEMINI_KEY_HERE"
       
       node setup-dev.js
       ```
    c. Serve the project root:
       ```sh
       npx serve
       ```

3.  **Access the Application:**
    *   Open your browser and navigate to the address provided by the server (e.g., `http://localhost:3000`).
    *   **IMPORTANT**: For camera and microphone access, your browser requires a secure context (`https://`). Most local server tools provide this. With `serve`, you can often access it via `https://localhost:3000` (you may need to accept a browser security warning).

## 📂 File Structure

The project is organized into logical directories:

```
/
├── components/       # React components (UI elements, modals, etc.)
├── hooks/            # Custom React hooks (useAuth, useSpeech, useTheme, etc.)
├── services/         # Modules for interacting with external APIs (Gemini, Disify)
├── translations/     # Language files for internationalization (i18n)
├── App.tsx           # Main application component
├── index.html        # Entry point of the application, includes importmap
├── index.tsx         # Root React render call
├── metadata.json     # Application metadata
└── README.md         # You are here!
```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

_This project was developed by Mert Hamza Yılmaz._