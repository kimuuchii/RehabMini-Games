// shared.js - ฟังก์ชันกลางสำหรับ Rehab Mini-Games

// ค่าคงที่
const LS_STATS_KEY = 'rehab.stats';
const LS_SETTINGS_KEY = 'rehab.settings';

// ฟังก์ชันพูด (Speech Synthesis)
function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'th-TH';
        utterance.rate = 0.9;
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
    }
}

// ฟังก์ชันเสียง Beep (Web Audio API)
function beep(frequency = 800, duration = 200) {
    if (!window.audioContext) {
        window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
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

// ฟังก์ชันแสดง Toast
function toast(message, duration = 3000) {
    // ลบ toast เก่าถ้ามี
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    `;
    
    document.body.appendChild(toast);
    
    // แสดง toast
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    // ซ่อน toast
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// ฟังก์ชันนับถอยหลัง
function countdownOverlay(callback, seconds = 3) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-size: 120px;
        font-weight: bold;
        color: white;
        text-shadow: 4px 4px 12px rgba(0,0,0,0.7);
    `;
    
    document.body.appendChild(overlay);
    
    let count = seconds;
    overlay.textContent = count;
    
    const countInterval = setInterval(() => {
        count--;
        if (count > 0) {
            overlay.textContent = count;
            beep(600, 100);
        } else {
            clearInterval(countInterval);
            overlay.textContent = 'ไป!';
            beep(800, 200);
            setTimeout(() => {
                overlay.remove();
                if (callback) callback();
            }, 500);
        }
    }, 1000);
}

// ฟังก์ชันจัดการ localStorage
function getStats() {
    const stats = localStorage.getItem(LS_STATS_KEY);
    return stats ? JSON.parse(stats) : {};
}

function saveStats(gameId, data) {
    const stats = getStats();
    stats[gameId] = {
        ...stats[gameId],
        ...data,
        lastPlayed: Date.now()
    };
    localStorage.setItem(LS_STATS_KEY, JSON.stringify(stats));
}

function getSettings() {
    const settings = localStorage.getItem(LS_SETTINGS_KEY);
    return settings ? JSON.parse(settings) : {};
}

function saveSettings(gameId, data) {
    const settings = getSettings();
    settings[gameId] = {
        ...settings[gameId],
        ...data
    };
    localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings));
}

// ฟังก์ชันแปลงเวลาเป็นข้อความ
function formatLastPlayed(timestamp) {
    if (!timestamp) return 'ยังไม่เคยเล่น';
    
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'วันนี้';
    if (days === 1) return 'เมื่อวาน';
    if (days < 7) return `${days} วันที่แล้ว`;
    
    const date = new Date(timestamp);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

// ฟังก์ชันเปิด/ปิด Fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('ไม่สามารถเปิด fullscreen ได้:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// ฟังก์ชันสุ่มตัวเลข
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ฟังก์ชันสุ่มสี
function randomColor() {
    const colors = [
        '#FF3B30', '#FFCC00', '#34C759', '#007AFF', 
        '#FF9500', '#AF52DE', '#FF2D92', '#5AC8FA'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ฟังก์ชันคำนวณคะแนนเปอร์เซ็นต์
function calculateAccuracy(correct, total) {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
}

// ฟังก์ชันคำนวณค่าเฉลี่ย
function calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    return Math.round(numbers.reduce((sum, num) => sum + num, 0) / numbers.length);
}

// ฟังก์ชันแสดงผลลัพธ์
function showResults(title, data) {
    const results = document.createElement('div');
    results.className = 'results-overlay';
    results.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        color: white;
        text-align: center;
        padding: 20px;
    `;
    
    let content = `<h2 style="margin-bottom: 30px; font-size: 28px;">${title}</h2>`;
    
    Object.entries(data).forEach(([key, value]) => {
        content += `<div style="margin: 15px 0; font-size: 18px;">${key}: ${value}</div>`;
    });
    
    content += `
        <button onclick="this.parentElement.remove()" 
                style="margin-top: 30px; padding: 12px 24px; font-size: 16px; 
                       background: #007AFF; color: white; border: none; 
                       border-radius: 8px; cursor: pointer;">
            ปิด
        </button>
    `;
    
    results.innerHTML = content;
    document.body.appendChild(results);
}

// ฟังก์ชันเริ่มต้นทั่วไป
function initGame() {
    // ปิดการเลือกข้อความ
    document.onselectstart = () => false;
    
    // ป้องกันการซูม
    document.addEventListener('gesturestart', e => e.preventDefault());
    document.addEventListener('gesturechange', e => e.preventDefault());
    document.addEventListener('gestureend', e => e.preventDefault());
    
    // ป้องกันการเลื่อน
    document.addEventListener('touchmove', e => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
}
