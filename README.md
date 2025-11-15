# Text & PDF to Voice Chatbot (Frontend Only)

## Overview
The **Text & PDF to Voice Chatbot** is a browser-based application that converts user-typed text or PDF documents into natural speech. It features a modern chatbot-style interface and supports multiple voices, adjustable speed, pitch control, and PDF text extraction—all running directly in your browser with no installation or backend required.

## Features
- **Chatbot UI** for clean and interactive messaging
- **Text-to-Speech (TTS)** for user input text
- **PDF-to-Speech** using PDF.js for text extraction
- **Multiple Voices (Male/Female)** depending on browser & OS
- **Speed & Pitch Controls** for personalized speech output
- **Stop Voice** control
- **Offline Functionality** — runs fully in browser
- **No backend required**

## Project Structure
```
text_pdf_to_voice_chatbot/
│
├── index.html      
├── style.css       
└── script.js       
```

## How to Run
1. Extract the project folder.
2. Open `index.html` in any modern browser (Chrome recommended).
3. Type text or upload a PDF.
4. Choose voice, speed, and pitch.
5. Click **Send & Speak** or **Speak PDF Text**.

## Technology Used
- **HTML, CSS, JavaScript**
- **Web Speech API (speechSynthesis)**
- **PDF.js** (via CDN)

## Use Cases
- Reading PDFs aloud
- Accessibility tool for visually impaired users
- Converting documents into audio
- Studying and revision
- Language learning
- Hands-free reading

## Author
Simple frontend-based TTS + PDF reader chatbot using browser APIs.
