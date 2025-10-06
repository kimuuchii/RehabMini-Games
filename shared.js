/* ===== shared.js ===== */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

function speak(text, lang='th-TH', rate=0.95){
  if(!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang; u.rate = rate;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

function beep(freq=880, dur=0.12, vol=0.2){
  const AC = window.AudioContext || window.webkitAudioContext;
  if(!AC) return;
  const ctx = beep._ctx || (beep._ctx = new AC());
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine'; osc.frequency.value = freq;
  g.gain.value = vol; osc.connect(g); g.connect(ctx.destination);
  osc.start(); osc.stop(ctx.currentTime + dur);
}

function toast(msg, ms=1400){
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(()=> t.classList.add('show'));
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),300) }, ms);
}

function countdownOverlay(n=3, onDone=()=>{}){
  const el = document.createElement('div');
  el.className = 'countdown-overlay';
  document.body.appendChild(el);
  const step = k=>{
    el.textContent = k>0 ? k : 'ไป!';
    setTimeout(()=>{
      if(k<=0){ el.remove(); onDone(); }
      else step(k-1);
    }, k>0?700:300);
  };
  step(n);
}

/* inject CSS ที่ใช้ร่วมกันเล็กน้อย (toast + countdown + base) */
(function(){
  const css = `
  :root{ --bg:#f0f0f0; --panel:#fff; --muted:#666; --border:#0000001a; --accent:#007AFF; }
  *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
  html,body{height:100%;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg)}
  .container{padding:20px;max-width:500px;margin:0 auto;overflow-y:auto;height:100vh}
  .section{background:var(--panel);border-radius:12px;padding:20px;margin-bottom:20px;box-shadow:0 2px 8px rgba(0,0,0,.1)}
  .section-title{font-weight:600;color:#555;margin-bottom:12px}
  .button-group{display:flex;flex-direction:column;gap:12px;margin-top:16px}
  button{padding:16px;font-size:16px;font-weight:600;border:none;border-radius:10px;cursor:pointer}
  .btn-primary{background:#007AFF;color:#fff}
  .btn-secondary{background:#5856D6;color:#fff}
  .btn-danger{background:#FF3B30;color:#fff}
  .play-screen{display:none;position:fixed;inset:0;justify-content:center;align-items:center;transition:background-color .5s}
  .play-screen.active{display:flex}
  .timer-display{position:absolute;top:20px;left:20px;font-size:28px;font-weight:700;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,.5);background:rgba(0,0,0,.3);padding:8px 16px;border-radius:10px}
  .close-btn{position:absolute;top:20px;right:20px;background:rgba(255,255,255,.3);color:#fff;border:none;padding:12px 18px;border-radius:10px;font-weight:600}
  .toast{position:fixed;left:50%;bottom:18px;transform:translateX(-50%) translateY(10px);opacity:0;background:#111a2c;color:#fff;padding:10px 14px;border-radius:12px;border:1px solid #ffffff22;transition:all .25s}
  .toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
  .countdown-overlay{position:fixed;inset:0;display:grid;place-items:center;font-size:120px;font-weight:800;color:#fff;text-shadow:0 4px 12px rgba(0,0,0,.7)}
  `;
  const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
})();
