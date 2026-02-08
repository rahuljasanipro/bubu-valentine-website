const config = window.VALENTINE_CONFIG || {};
document.title = config.pageTitle || "Valentine 💝";

/* ---------------- THEME ---------------- */
(function applyTheme(){
  if(!config.colors) return;
  const r = document.documentElement;
  r.style.setProperty("--bg1", config.colors.backgroundStart);
  r.style.setProperty("--bg2", config.colors.backgroundEnd);
  r.style.setProperty("--btn", config.colors.buttonBackground);
  r.style.setProperty("--btnHover", config.colors.buttonHover);
  r.style.setProperty("--text", config.colors.textColor);
})();

/* ---------------- HELPERS ---------------- */
function showSection(id){
  document.querySelectorAll(".question-section").forEach(s => s.classList.add("hidden"));
  const el = document.getElementById(id);
  if(el) el.classList.remove("hidden");
}

function typeText(el, text, speed=35){
  if(!el) return;
  el.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i] || "";
    i++;
    if(i >= text.length) clearInterval(timer);
  }, speed);
}

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

/* ---------------- MUSIC (reliable unlock) ---------------- */
async function setupMusic(){
  const audio = document.getElementById("bgMusic");
  const toggle = document.getElementById("musicToggle");
  const startBtn = document.getElementById("introStartBtn");
  const overlay = document.getElementById("introOverlay");

  if(!audio || !toggle || !startBtn) return;

  const setLabel = () => toggle.textContent = audio.paused ? "🎵 Play Music" : "🔇 Stop Music";

  const tryPlay = async () => {
    try{
      audio.muted = false;
      audio.volume = 0.85;
      await audio.play();
      setLabel();
      return true;
    }catch(e){
      console.log("Audio blocked:", e);
      setLabel();
      return false;
    }
  };

  const armTapAnywhereUnlock = () => {
    toggle.textContent = "🔓 Tap anywhere to start music";
    const unlock = async () => {
      const ok = await tryPlay();
      if(ok){
        document.removeEventListener("pointerdown", unlock);
        document.removeEventListener("touchstart", unlock);
      }
    };
    document.addEventListener("pointerdown", unlock);
    document.addEventListener("touchstart", unlock, { passive: true });
  };

  startBtn.addEventListener("click", async () => {
    if(overlay) overlay.style.display = "none";
    const ok = await tryPlay();
    if(!ok) armTapAnywhereUnlock();
  });

  toggle.addEventListener("click", async () => {
    if(audio.paused){
      const ok = await tryPlay();
      if(!ok) armTapAnywhereUnlock();
    }else{
      audio.pause();
      setLabel();
    }
  });

  setLabel();
}

/* ---------------- FLOATING EMOJIS ---------------- */
function createFloatingElements(){
  const container = document.querySelector(".floating-elements");
  if(!container) return;
  const hearts = config.floatingEmojis?.hearts || ["❤️"];
  const bears = config.floatingEmojis?.bears || ["🧸"];

  const setPos = (el) => {
    el.style.left = Math.random()*100 + "vw";
    el.style.animationDelay = Math.random()*5 + "s";
    el.style.animationDuration = (10 + Math.random()*20) + "s";
  };

  hearts.forEach(h=>{
    const d=document.createElement("div");
    d.className="heart";
    d.innerHTML=h;
    setPos(d);
    container.appendChild(d);
  });

  bears.forEach(b=>{
    const d=document.createElement("div");
    d.className="bear";
    d.innerHTML=b;
    setPos(d);
    container.appendChild(d);
  });
}

/* ---------------- DEMON NO BUTTON + FAKE SYSTEM WARNING ---------------- */
function attachSystemWarning(el){
  if(!el) return;
  el.classList.remove("hidden");
  el.textContent = "⚠️ SYSTEM WARNING: Wrong choice detected. Relationship stability: 2% 😈";
  setTimeout(()=> el.classList.add("hidden"), 2400);
}

function demonNoButton(noBtn, yesBtn, warningEl){
  let attempts = 0;
  noBtn.style.position = "fixed";

  const move = () => {
    attempts++;

    attachSystemWarning(warningEl);

    const msgs = [
      "Nice try 😜",
      "Not happening 😌",
      "Wrong answer 😂",
      "Illegal click 🚫",
      "Think again 😏",
      "HAHA nope 😈",
      "Ok stop 😭",
      "Fine… YES 💘"
    ];

    noBtn.textContent = msgs[Math.min(attempts-1, msgs.length-1)];

    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);

    noBtn.style.left = `${Math.max(12,x)}px`;
    noBtn.style.top  = `${Math.max(12,y)}px`;
    noBtn.style.transform = `rotate(${Math.random()*360}deg) scale(${0.75 + Math.random()*0.6})`;

    if(attempts >= 7){
      noBtn.textContent = "Yes!! 💘";
      noBtn.style.transform = "rotate(0deg) scale(1)";
      noBtn.addEventListener("click", () => yesBtn.click(), { once:true });
    }
  };

  noBtn.addEventListener("mouseenter", move);
  noBtn.addEventListener("click", (e)=>{ e.preventDefault(); move(); });
  noBtn.addEventListener("touchstart", (e)=>{ e.preventDefault(); move(); }, { passive:false });

  setTimeout(move, 220);
}

/* ---------------- LOVE METER ---------------- */
function setupLoveMeter(){
  const loveMeter = document.getElementById("loveMeter");
  const loveValue = document.getElementById("loveValue");
  const extraLove = document.getElementById("extraLove");
  if(!loveMeter || !loveValue || !extraLove) return;

  loveMeter.value = 100;
  loveValue.textContent = "100";

  loveMeter.addEventListener("input", ()=>{
    const v = parseInt(loveMeter.value, 10);
    loveValue.textContent = String(v);

    if(v > 100){
      extraLove.classList.remove("hidden");
      if(v >= 5000){
        extraLove.textContent = config.loveMessages?.extreme || "WOOOOW 🥰🚀💝";
        extraLove.classList.add("super-love");
      }else if(v > 1000){
        extraLove.textContent = config.loveMessages?.high || "To infinity and beyond! 🚀💝";
        extraLove.classList.remove("super-love");
      }else{
        extraLove.textContent = config.loveMessages?.normal || "And beyond! 🥰";
        extraLove.classList.remove("super-love");
      }
    }else{
      extraLove.classList.add("hidden");
      extraLove.classList.remove("super-love");
    }
  });
}

/* ---------------- TIMED SURPRISE POPUP ---------------- */
function setupTimedSurprise(){
  // shows once per page load
  setTimeout(() => {
    // no alert if overlay still there (avoid gesture issues)
    const overlay = document.getElementById("introOverlay");
    if(overlay && overlay.style.display !== "none") return;
    window.alert("Still here? That means you like me 😌💗");
  }, 20000);
}

/* ---------------- HIDDEN CLICK EASTER EGG ---------------- */
function setupTitleEasterEgg(){
  const title = document.getElementById("valentineTitle");
  if(!title) return;
  title.style.cursor = "pointer";
  title.addEventListener("click", () => {
    window.alert("💌 Secret unlocked:\nYou are my favorite human. Always.");
  });
}

/* ---------------- HIDDEN KEYBOARD SURPRISE ---------------- */
function setupHiddenSurprise(){
  const secret = "bubu";
  let buf = "";
  document.addEventListener("keydown", (e)=>{
    buf += (e.key || "").toLowerCase();
    buf = buf.slice(-12);
    if(buf.includes(secret)){
      buf = "";
      window.alert("💌 Hidden Surprise: Ro Ro loves you more than 10,000% 💖");
    }
  });
}

/* ---------------- MINI GAME: CATCH 5 HEARTS ---------------- */
function setupCatchHeartGame(onComplete){
  const startBtn = document.getElementById("startGameBtn");
  const area = document.getElementById("gameArea");
  const caughtEl = document.getElementById("caughtCount");
  if(!startBtn || !area || !caughtEl) return;

  let caught = 0;
  let running = false;
  let spawner = null;

  const spawnHeart = () => {
    if(!running) return;

    const heart = document.createElement("div");
    heart.className = "game-heart";
    heart.textContent = ["❤️","💖","💝","💗","💓"][Math.floor(Math.random()*5)];

    const rect = area.getBoundingClientRect();
    const x = Math.random() * (rect.width - 30) + 15;
    const y = Math.random() * (rect.height - 30) + 15;

    heart.style.left = x + "px";
    heart.style.top  = y + "px";

    const life = 1100 + Math.random()*900;
    const killTimer = setTimeout(() => {
      if(heart && heart.parentNode) heart.parentNode.removeChild(heart);
    }, life);

    heart.addEventListener("click", () => {
      clearTimeout(killTimer);
      if(heart && heart.parentNode) heart.parentNode.removeChild(heart);
      caught++;
      caughtEl.textContent = String(caught);

      if(caught >= 5){
        running = false;
        if(spawner) clearInterval(spawner);
        area.innerHTML = "";
        startBtn.disabled = false;
        startBtn.textContent = "Unlocked ✅";
        setTimeout(() => onComplete && onComplete(), 450);
      }
    });

    area.appendChild(heart);
  };

  startBtn.addEventListener("click", async () => {
    if(running) return;
    caught = 0;
    caughtEl.textContent = "0";
    area.innerHTML = "";
    startBtn.disabled = true;
    startBtn.textContent = "Catch them! 💞";
    running = true;

    // spawn faster over time
    let interval = 650;
    spawner = setInterval(spawnHeart, interval);

    // difficulty ramp
    for(let i=0;i<5;i++){
      await sleep(1400);
      if(!running) break;
      interval = Math.max(260, interval - 90);
      clearInterval(spawner);
      spawner = setInterval(spawnHeart, interval);
    }
  });
}

/* ---------------- FIREWORKS ON YES ---------------- */
function setupFireworks(){
  const canvas = document.getElementById("fireworksCanvas");
  if(!canvas) return null;

  const ctx = canvas.getContext("2d");
  const DPR = Math.max(1, window.devicePixelRatio || 1);

  const resize = () => {
    canvas.width = Math.floor(window.innerWidth * DPR);
    canvas.height = Math.floor(window.innerHeight * DPR);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };
  window.addEventListener("resize", resize);
  resize();

  let particles = [];
  let anim = null;

  const burst = (x, y) => {
    const count = 90;
    for(let i=0;i<count;i++){
      const a = Math.random()*Math.PI*2;
      const s = 2 + Math.random()*6;
      particles.push({
        x, y,
        vx: Math.cos(a)*s,
        vy: Math.sin(a)*s,
        life: 60 + Math.random()*30,
        size: 1 + Math.random()*2.4,
        alpha: 1
      });
    }
  };

  const tick = () => {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles = particles.filter(p => p.life > 0);
    for(const p of particles){
      p.vy += 0.08; // gravity
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      p.alpha = Math.max(0, p.life/90);

      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    if(particles.length > 0){
      anim = requestAnimationFrame(tick);
    }else{
      if(anim) cancelAnimationFrame(anim);
      anim = null;
      ctx.clearRect(0,0,canvas.width,canvas.height);
    }
  };

  return {
    fire(){
      // multiple bursts
      for(let i=0;i<7;i++){
        burst(
          Math.random()*window.innerWidth,
          Math.random()*window.innerHeight*0.6
        );
      }
      if(!anim) tick();
    }
  };
}

/* ---------------- MAIN INIT ---------------- */
window.addEventListener("DOMContentLoaded", async () => {
  await setupMusic();

  // Dark mode toggle
  const darkBtn = document.getElementById("darkModeToggle");
  if(darkBtn){
    const saved = localStorage.getItem("val_dark") === "1";
    if(saved) document.body.classList.add("dark");
    darkBtn.textContent = document.body.classList.contains("dark") ? "☀️ Light" : "🌙 Dark";

    darkBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const isDark = document.body.classList.contains("dark");
      localStorage.setItem("val_dark", isDark ? "1" : "0");
      darkBtn.textContent = isDark ? "☀️ Light" : "🌙 Dark";
    });
  }

  // Texts
  document.getElementById("valentineTitle").textContent =
    `${config.valentineName || "My Love"}, my love...`;

  document.getElementById("question1Text").textContent = config.questions?.first?.text || "Do you like me?";
  document.getElementById("yesBtn1").textContent = config.questions?.first?.yesBtn || "Yes";
  document.getElementById("noBtn1").textContent = config.questions?.first?.noBtn || "No";
  document.getElementById("secretAnswerBtn").textContent = "Secret 💌";

  document.getElementById("question2Text").textContent = config.questions?.second?.text || "How much do you love me?";
  document.getElementById("startText").textContent = config.questions?.second?.startText || "This much!";
  document.getElementById("nextBtn").textContent = config.questions?.second?.nextBtn || "Next ❤️";

  document.getElementById("question3Text").textContent = config.questions?.third?.text || "Will you be my Valentine?";
  document.getElementById("yesBtn3").textContent = config.questions?.third?.yesBtn || "Yes!";
  document.getElementById("noBtn3").textContent = config.questions?.third?.noBtn || "No";

  // Features
  createFloatingElements();
  setupLoveMeter();
  setupTimedSurprise();
  setupTitleEasterEgg();
  setupHiddenSurprise();

  const fireworks = setupFireworks();

  // Flow buttons
  document.getElementById("yesBtn1").addEventListener("click", () => showSection("question2"));

  // “No” demon + fake warnings
  demonNoButton(
    document.getElementById("noBtn1"),
    document.getElementById("yesBtn1"),
    document.getElementById("systemWarning")
  );

  document.getElementById("secretAnswerBtn").addEventListener("click", () => {
    window.alert(config.questions?.first?.secretAnswer || "I love you ❤️");
  });

  // Next goes to mini game instead of question 3
  document.getElementById("nextBtn").addEventListener("click", () => showSection("minigame"));

  // Mini game completion unlocks final question
  setupCatchHeartGame(() => showSection("question3"));

  // Demon “No” on final question too
  demonNoButton(
    document.getElementById("noBtn3"),
    document.getElementById("yesBtn3"),
    document.getElementById("systemWarning3")
  );

  // YES final: celebration + typed love letter + fireworks
  document.getElementById("yesBtn3").addEventListener("click", () => {
    showSection("celebration");

    const title = document.getElementById("celebrationTitle");
    const msg = document.getElementById("celebrationMessage");
    const emo = document.getElementById("celebrationEmojis");

    title.textContent = config.celebration?.title || "Yay! 🎉";
    emo.textContent = config.celebration?.emojis || "🎁💖🤗💝💋❤️💕";

    // Typed love letter animation
    typeText(msg, config.celebration?.message || "Now come get your gift… 💋", 32);

    // Fireworks
    if(fireworks) fireworks.fire();
  });
});
