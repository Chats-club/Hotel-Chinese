// Keep a module-level reference so the utterance isn't garbage-collected
// mid-speech — a known Chrome bug that silently kills audio.
let currentUtterance = null;
let cachedVoices = [];

function loadVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  cachedVoices = window.speechSynthesis.getVoices();
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  // Voices often load asynchronously after the page first paints.
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

function pickChineseVoice() {
  if (!cachedVoices.length) loadVoices();
  return (
    cachedVoices.find((v) => v.lang === 'zh-CN') ||
    cachedVoices.find((v) => v.lang?.startsWith('zh')) ||
    null
  );
}

export function speakChinese(text) {
  if (!('speechSynthesis' in window)) {
    return false;
  }
  try {
    const synth = window.speechSynthesis;

    // Chrome sometimes gets stuck in a "paused" state after inactivity;
    // resuming before speaking works around that.
    synth.resume();
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.85;

    const voice = pickChineseVoice();
    if (voice) utterance.voice = voice;

    currentUtterance = utterance; // keep a live reference

    // Firing speak() immediately after cancel() can be swallowed on some
    // browsers — deferring to the next tick makes it reliable.
    setTimeout(() => {
      synth.speak(utterance);
    }, 30);

    return true;
  } catch {
    return false;
  }
}

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function hasChineseVoice() {
  return pickChineseVoice() !== null;
}
