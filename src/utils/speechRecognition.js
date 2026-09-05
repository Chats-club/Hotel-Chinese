export function isRecognitionSupported() {
  return typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

// SpeechRecognition requires a secure context (HTTPS, or localhost during
// dev). On plain HTTP — e.g. testing over a LAN IP — it silently fails or
// throws, which looks like "speaking doesn't work" with no clear reason.
export function isSecureContextOk() {
  if (typeof window === 'undefined') return false;
  return window.isSecureContext || window.location.hostname === 'localhost';
}

// Records one utterance and resolves with the recognized text.
// Rejects with a specific reason string so callers can show a helpful
// message: 'not_supported' | 'insecure_context' | 'not-allowed' |
// 'audio-capture' | 'network' | 'no-speech' | 'timeout' | 'start_failed'.
export function recognizeOnce({ lang = 'zh-CN', timeoutMs = 9000 } = {}) {
  const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognitionImpl) {
    return Promise.reject(new Error('not_supported'));
  }
  if (!isSecureContextOk()) {
    return Promise.reject(new Error('insecure_context'));
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (fn, arg) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn(arg);
    };

    const recognition = new SpeechRecognitionImpl();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const timer = setTimeout(() => {
      try {
        recognition.stop();
      } catch {
        // already stopped
      }
      finish(reject, new Error('timeout'));
    }, timeoutMs);

    recognition.onresult = (event) => {
      const text = event.results?.[0]?.[0]?.transcript || '';
      finish(resolve, text);
    };

    recognition.onerror = (event) => {
      finish(reject, new Error(event.error || 'recognition_error'));
    };

    // If the browser stops listening without ever firing a result or an
    // error (happens with very brief/quiet input on some browsers), don't
    // leave the caller hanging until the full timeout — fail fast instead.
    recognition.onend = () => {
      finish(reject, new Error('no-speech'));
    };

    try {
      recognition.start();
    } catch {
      finish(reject, new Error('start_failed'));
    }
  });
}

// Loose comparison: strips punctuation/whitespace and checks for a
// meaningful character overlap rather than requiring an exact match,
// since ASR output for Mandarin can vary in segmentation.
export function scorePronunciation(target, heard) {
  const clean = (s) => s.replace(/[，。！？、\s,.!?]/g, '');
  const t = clean(target);
  const h = clean(heard);
  if (!h) return 0;
  if (t === h) return 1;

  let matches = 0;
  const heardChars = [...h];
  const targetChars = [...t];
  for (const ch of targetChars) {
    const idx = heardChars.indexOf(ch);
    if (idx !== -1) {
      matches++;
      heardChars.splice(idx, 1);
    }
  }
  return matches / targetChars.length;
}
