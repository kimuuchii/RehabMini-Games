// shared.js - ฟังก์ชันกลางสำหรับ Rehab Mini-Games

// แสดง Toast Message
function toast(msg, duration = 2000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Countdown Overlay (3-2-1)
function countdownOverlay(seconds = 3) {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'countdown-overlay';
    overlay.innerHTML = '<div class="countdown-number">' + seconds + '</div>';
    document.body.appendChild(overlay);

    let count = seconds;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        overlay.querySelector('.countdown-number').textContent = count;
        beep();
      } else {
        clearInterval(interval);
        overlay.classList.add('fade-out');
        beep(800);
        setTimeout(() => {
          overlay.remove();
          resolve();
        }, 300);
      }
    }, 1000);
  });
}

// พูดภาษาไทย
function speak(text, rate = 1) {
  if (!window.speechSynthesis) return;
  
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'th-TH';
  utterance.rate = rate;
  utterance.pitch = 1;
  utterance.volume = 1;
  
  window.speechSynthesis.speak(utterance);
}

// เสียง Beep
function beep(frequency = 600, duration = 100) {
  if (!window.AudioContext && !window.webkitAudioContext) return;
  
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration / 1000);
  
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration / 1000);
}

// รีเซ็ตสถานะเกม
function clearSession() {
  window.speechSynthesis?.cancel();
  const overlays = document.querySelectorAll('.countdown-overlay, .toast');
  overlays.forEach(el => el.remove());
}

// สไตล์กลางสำหรับทุกหน้า
const sharedStyles = `
  .toast {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    font-size: 1.1em;
    z-index: 10000;
    opacity: 0;
    transition: all 0.3s ease;
    max-width: 80%;
    text-align: center;
  }
  .toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  .countdown-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.3s ease;
  }
  .countdown-overlay.fade-out {
    animation: fadeOut 0.3s ease;
  }
  .countdown-number {
    font-size: 15vw;
    font-weight: bold;
    color: white;
    animation: pulse 1s ease infinite;
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
