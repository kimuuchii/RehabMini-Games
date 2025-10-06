// Toast notification
function toast(msg, duration = 2000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    background: rgba(0,0,0,0.85); color: white; padding: 15px 25px;
    border-radius: 12px; font-size: 1.1rem; z-index: 10000;
    animation: slideDown 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Countdown overlay
function countdownOverlay(seconds, callback) {
  const overlay = document.createElement('div');
  overlay.className = 'countdown-overlay';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.9); display: flex; align-items: center;
    justify-content: center; z-index: 9999;
  `;
  
  const number = document.createElement('div');
  number.style.cssText = `
    font-size: 8rem; font-weight: bold; color: white;
    animation: pulse 1s ease;
  `;
  number.textContent = seconds;
  overlay.appendChild(number);
  document.body.appendChild(overlay);
  
  let count = seconds;
  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      number.textContent = count;
      number.style.animation = 'none';
      setTimeout(() => number.style.animation = 'pulse 1s ease', 10);
      beep();
    } else {
      clearInterval(interval);
      overlay.remove();
      if (callback) callback();
    }
  }, 1000);
  beep();
}

// Text to speech
function speak(text) {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'th-TH';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }
}

// Beep sound
function beep(frequency = 800, duration = 100) {
  if (!window.AudioContext && !window.webkitAudioContext) return;
  
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
}

// Clear session data
function clearSession() {
  // ฟังก์ชันนี้ไว้สำหรับรีเซ็ตตัวแปรภายในหน้าเท่านั้น
  // ไม่ใช้ localStorage
}

// Add global CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from { transform: translate(-50%, -100%); opacity: 0; }
    to { transform: translate(-50%, 0); opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translate(-50%, 0); opacity: 1; }
    to { transform: translate(-50%, -100%); opacity: 0; }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.8; }
  }
`;
document.head.appendChild(style);
