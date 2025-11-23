Sehat Saathi 🩺

AI-Powered Maternal Health Companion for Rural India

Sehat Saathi is a voice-first, offline-capable AI assistant designed to bridge the gap between rural pregnant women and the ASHA (Accredited Social Health Activist) healthcare network.

 Key Features

1. Hybrid AI Architecture (Offline + Online)

Online Mode: Uses Gemini 2.5 Flash with RAG (Retrieval Augmented Generation) to answer complex medical queries and explain government schemes (PMMVY/JSY).

Offline Mode: Uses a lightweight, local NLU engine to detect emergencies ("water broke", "bleeding") and trigger alerts even without internet.

2. ASHA Worker Dashboard

Real-time synchronization with the patient app.

Risk Engine: Automatically flags patients as Low, Moderate, or Critical based on chat analysis (e.g., detecting keywords for Pre-eclampsia or Anaemia).

Postpartum Tracking: Tracks health for 42 days after delivery.

3. Localization & Inclusivity

Multi-lingual Support: Hindi, Gujarati, Marathi, Bengali, Kannada, English.

Voice-First Interface: Text-to-Speech (TTS) and Speech-to-Text (STT) for low-literacy users.

Visual Records: Generates downloadable, branded PDF health records.

4. Technical Innovation

Broadcast Channel Sync: Custom local database engine that simulates real-time cloud syncing across browser tabs.

Privacy First: Data is processed and stored locally in the browser context for the demo.

 How to Run Locally

Clone the repository

git clone [https://github.com/Mephisto2412/sehat-saathi.git](https://github.com/Mephisto2412/sehat-saathi.git)
cd sehat-saathi


Install Dependencies

npm install


Set up Environment Variables
Create a .env file in the root and add your Google Gemini API Key:

GEMINI_API_KEY=your_api_key_here


Run the App

npm run dev


Tech Stack

Frontend: React, TypeScript, Tailwind CSS

AI/LLM: Google Gemini 2.5 Flash

Voice: Web Speech API

Database: Custom Reactive LocalStorage Engine (Simulates Firebase/NoSQL)

Built for the GHCI-2025.

