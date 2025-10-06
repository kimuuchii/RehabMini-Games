// shared.js

/**
 * แสดงข้อความแจ้งเตือน (Toast Notification)
 * @param {string} msg - ข้อความที่จะแสดง
 */
function toast(msg) {
    const el = document.createElement('div');
    el.className = 'toast-message';
    el.textContent = msg;
    document.body.appendChild(el);

    // ใช้ setTimeout เพื่อให้เกิด animation
    setTimeout(() => {
        el.classList.add('show');
    }, 10);

    // ซ่อนและลบหลังจาก 2.5 วินาที
    setTimeout(() => {
        el.classList.remove('show');
        el.classList.add('hide');
        el.addEventListener('transitionend', () => el.remove());
    }, 2500);
}

/**
 * แสดง Overlay พร้อมนับถอยหลัง 3-2-1
 * @param {number} n - จำนวนวินาทีเริ่มต้น
 * @param {function} callback - ฟังก์ชันที่จะเรียกเมื่อนับเสร็จ
 */
function countdownOverlay(n, callback) {
    const overlay = document.createElement('div');
    overlay.className = 'countdown-overlay';
    document.body.appendChild(overlay);

    const counter = document.createElement('div');
    counter.className = 'countdown-number';
    overlay.appendChild(counter);

    let count = n;

    function updateCounter() {
        if (count === 0) {
            counter.textContent = 'เริ่ม!';
            beep(2);
            setTimeout(() => {
                overlay.remove();
                if (callback) callback();
            }, 500);
            return;
        }

        counter.textContent = count;
        beep(1);
        count--;
        setTimeout(updateCounter, 1000);
    }

    updateCounter();
}

/**
 * พูดข้อความด้วยเสียงภาษาไทย
 * @param {string} text - ข้อความที่ต้องการให้พูด
 */
function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'th-TH'; // กำหนดภาษาเป็นไทย
        speechSynthesis.speak(utterance);
    } else {
        console.warn('Speech Synthesis Not Supported');
    }
}

/**
 * สร้างเสียง Beep
 * @param {number} type - 1: สั้น, 2: เริ่มเกม
 */
function beep(type = 1) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 1) { // Beep สั้น (Countdown)
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 2) { // Beep ยาว (Start/End)
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
        gainNode.gain.setValueAtTime(1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    }
}

/**
 * ล้างสถานะเกม (สำหรับเกมที่ไม่ต้องการเก็บค่า)
 */
function clearSession() {
    // ไม่มีอะไรต้องทำในที่นี้เพราะเกมส่วนใหญ่ไม่เก็บค่า
    // อาจใช้เพื่อ reset UI หรือตัวแปรภายในเกมแต่ละหน้า
}

// Global utility for easy navigation
function goTo(path) {
    window.location.href = path;
}
