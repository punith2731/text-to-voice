// --- Speech Synthesis Setup ---
let voices = [];
const voiceSelect = document.getElementById("voice-select");
const rateRange = document.getElementById("rate-range");
const pitchRange = document.getElementById("pitch-range");
const rateValue = document.getElementById("rate-value");
const pitchValue = document.getElementById("pitch-value");

function populateVoices() {
  voices = window.speechSynthesis.getVoices();
  voiceSelect.innerHTML = "";

  if (!voices.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No voices available";
    voiceSelect.appendChild(opt);
    return;
  }

  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})` + (voice.default ? " [default]" : "");
    voiceSelect.appendChild(option);
  });
}

// Some browsers load voices asynchronously
if (typeof speechSynthesis !== "undefined") {
  populateVoices();
  window.speechSynthesis.onvoiceschanged = populateVoices;
}

// --- Chat UI helpers ---
const chatWindow = document.getElementById("chat-window");

function addMessage(text, sender = "bot") {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);

  const meta = document.createElement("div");
  meta.classList.add("message-meta");
  meta.textContent = sender === "user" ? "You" : "Bot";

  const body = document.createElement("div");
  body.textContent = text;

  msg.appendChild(meta);
  msg.appendChild(body);
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// --- Text to Speech ---
function speakText(text) {
  if (!text || !text.trim()) return;

  if (typeof speechSynthesis === "undefined") {
    alert("Speech Synthesis is not supported in this browser.");
    return;
  }

  // Cancel existing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  const selectedIndex = voiceSelect.value;
  if (selectedIndex && voices[selectedIndex]) {
    utterance.voice = voices[selectedIndex];
  }

  utterance.rate = parseFloat(rateRange.value);
  utterance.pitch = parseFloat(pitchRange.value);

  window.speechSynthesis.speak(utterance);
}

// --- UI: Text input sending ---
const textInput = document.getElementById("text-input");
const sendBtn = document.getElementById("send-btn");
const clearChatBtn = document.getElementById("clear-chat-btn");
const stopBtn = document.getElementById("stop-btn");

sendBtn.addEventListener("click", () => {
  const text = textInput.value;
  if (!text.trim()) return;
  addMessage(text, "user");
  const botReply = "Speaking your text now.";
  addMessage(botReply, "bot");
  speakText(text);
});

clearChatBtn.addEventListener("click", () => {
  chatWindow.innerHTML = "";
});

stopBtn.addEventListener("click", () => {
  if (typeof speechSynthesis !== "undefined") {
    window.speechSynthesis.cancel();
  }
});

// Update rate & pitch labels
rateRange.addEventListener("input", () => {
  rateValue.textContent = rateRange.value;
});
pitchRange.addEventListener("input", () => {
  pitchValue.textContent = pitchRange.value;
});

// --- PDF Handling with PDF.js ---
const pdfInput = document.getElementById("pdf-input");
const pdfStatus = document.getElementById("pdf-status");
const speakPdfBtn = document.getElementById("speak-pdf-btn");

let pdfExtractedText = "";

pdfInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) {
    pdfStatus.textContent = "No PDF loaded.";
    speakPdfBtn.disabled = true;
    return;
  }

  pdfStatus.textContent = "Reading PDF...";
  speakPdfBtn.disabled = true;
  pdfExtractedText = "";

  try {
    const arrayBuffer = await file.arrayBuffer();
    const typedArray = new Uint8Array(arrayBuffer);

    // PDF.js is loaded from CDN
    const pdf = await pdfjsLib.getDocument(typedArray).promise;

    let fullText = "";
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n\n";
    }

    pdfExtractedText = fullText.trim();

    if (pdfExtractedText.length) {
      pdfStatus.textContent = `PDF loaded. Extracted ~${pdfExtractedText.length} characters.`;
      speakPdfBtn.disabled = false;

      // Optionally put the text in the text area (truncated for display)
      const previewText = pdfExtractedText.length > 300
        ? pdfExtractedText.slice(0, 300) + "... [truncated]"
        : pdfExtractedText;
      textInput.value = previewText;

      addMessage(`PDF loaded: ${file.name}. Ready to speak.`, "bot");
    } else {
      pdfStatus.textContent = "Couldn't extract text from this PDF.";
      speakPdfBtn.disabled = true;
    }
  } catch (error) {
    console.error(error);
    pdfStatus.textContent = "Error reading PDF.";
    speakPdfBtn.disabled = true;
  }
});

speakPdfBtn.addEventListener("click", () => {
  if (!pdfExtractedText) return;
  addMessage("Reading text from the uploaded PDF.", "bot");
  speakText(pdfExtractedText);
});
