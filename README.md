# Sehat Saathi 

> **AI-Powered Maternal Health Companion for Rural India**

Sehat Saathi is a voice-first, offline-capable AI assistant designed to bridge the gap between rural pregnant women and the ASHA (Accredited Social Health Activist) healthcare network.

## Key Features

### 1. Hybrid AI Architecture (Offline + Online)

  - **Online Mode:** Uses **Gemini 2.5 Flash** with RAG (Retrieval Augmented Generation) to answer complex medical queries and explain government schemes (PMMVY/JSY).
  - **Offline Mode:** Uses a lightweight, local NLU engine to detect emergencies ("water broke", "bleeding") and trigger alerts even without internet.

### 2. ASHA Worker Dashboard

  - **Real-time synchronization** with the patient app.
  - **Risk Engine:** Automatically flags patients as Low, Moderate, or Critical based on chat analysis (e.g., detecting keywords for Pre-eclampsia or Anaemia).
  - **Postpartum Tracking:** Tracks health for 42 days after delivery.

### 3. Localization & Inclusivity

  - **Multi-lingual Support:** Hindi, Gujarati, Marathi, Bengali, Kannada, English.
  - **Voice-First Interface:** Text-to-Speech (TTS) and Speech-to-Text (STT) for low-literacy users.
  - **Visual Records:** Generates downloadable, branded PDF health records.

### 4. Technical Innovation

  - **Broadcast Channel Sync:** Custom local database engine that simulates real-time cloud syncing across browser tabs.
  - **Privacy First:** Data is processed and stored locally in the browser context for the demo.

## How to Run Locally

1.  **Clone the repository**

    ```bash
    git clone [https://github.com/Mephisto2412/sehat-saathi-ai.git](https://github.com/Mephisto2412/sehat-saathi-ai.git)
    cd sehat-saathi
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root directory and add your Google Gemini API Key:

    ```bash
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the App**

    ```bash
    npm run dev
    ```

## Tech Stack

  - **Frontend:** React, TypeScript, Tailwind CSS
  - **AI/LLM:** Google Gemini 2.5 Flash
  - **Voice:** Web Speech API
  - **Database:** Firebase/NoSQL

## Artifacts 
- **Chat Interface:** <img width="1919" height="876" alt="image" src="https://github.com/user-attachments/assets/c2bf9ecc-a68b-47be-b0b7-6d3a6a8741dc" />
<br><br>
- **Native Language Support:** <img width="1514" height="763" alt="image" src="https://github.com/user-attachments/assets/296159c3-0a4c-43cf-bfaf-0a23ac88b1f7" />
<br><br>
- **ASHA Dashboard:** <img width="1919" height="700" alt="image" src="https://github.com/user-attachments/assets/a14ab639-ce85-4ed0-8dc4-92076be8922a" />
<br><br>
- **All Patient Records:** <img width="1919" height="573" alt="image" src="https://github.com/user-attachments/assets/8f0941a3-d42b-4e9e-9bfc-3df6171f14f0" />
<br><br>
- **View Patient History:** <img width="1893" height="680" alt="image" src="https://github.com/user-attachments/assets/6149a822-18f4-4ecd-b7fc-127806449138" />





-----

*Built for the GHCI 2025 (THEME 3: AI For Social Impact).*
