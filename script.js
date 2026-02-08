const config = window.VALENTINE_CONFIG || {};

// Title
document.title = config.pageTitle || "Valentine 💝";

// Apply theme colors if CSS uses variables
(function applyTheme(){
  if(!config.colors) return;
  const r = document.documentElement;
  r.style.setProperty("--bg1", config.colors.backgroundStart);
  r.style.setProperty("--bg2", config.colors.backgroundEnd);
  r.style.setProperty("--btn", config.colors.buttonBackground);
  r.style.setProperty("--btnHover", config.colors.buttonHover);
  r.style.setProperty("--text", config.colors.textColor);
})();

// DOM init
window.addEventListener("DOMContentLoaded", () => {
  // Set texts
  const titleEl = document.getElementById("valentineTitle");
  if (titleEl) titleEl.textContent = `${config.valentineName || "My Love"}, my love...`;

  const q1 = document.getElementById("question1Text");
  const y1 = document.getElementById("yesBtn1");
  const n1 = document.getElementById("noBtn1");
  const secretBtn = document.getElementById("secretAnswerBtn");

  const q2 = document.getElementById("question2Text");
  const st = document.getElementById("startText");
  const nb = document.getElementById("nextBtn");

  const q3 = document.getElementById("question3Text");
  const y3 = document.getElementById("yesBtn3");
  const n3 = document.getElementById("noBtn3");

  if (q1) q1.textContent = config.questions?.first?.text || "Do you like me?";
  if (y1) y1.textContent = config.questions?.first?.yesBtn || "Yes";
  if (n1) n1.textContent = config.questions?.first?.noBtn || "No";
  if (secretBtn) secretBtn.textContent = "Secret 💌";

  if (q2) q2.textContent = config.questions?.second?.text || "How much do you love me?";
  if (st) st.textContent = config.questions?.second?.startText || "This much!";
  if (nb) nb.textContent = config.questions?.second?.nextBtn || "Next ❤️";

  if (q3) q3.textContent = config.questions?.third?.text || "Will you be my Valentine?";
  if (y3) y3.textContent = config.questions?.third?.yesBtn || "Yes!";
  if (n3) n3.textContent = config.questions?.third?.noBtn || "No";

  // Floating emojis
  createFloatingElements();

  // Buttons flow
  if (y1) y1.addEventListener("click", () => showNextQuestion(2));
  if (nb) nb.addEventListener("click", () => showNextQuestion(3));
  if (y3) y3.addEventListener("click", celebrate);

  // Secret button
  if (secretBtn) {
    secretBtn.addEventListener("click", () => {
      alert(config.questions?.first?.secretAnswer || "I love you ❤️");
    });
  }

  // No button prank MAX
  if (n1 && y1) prankNoButton(n1, y1);
  if (n3 && y3) prankNoButton(n3, y3);

  // Love meter
  setupLoveMeter();

  // Hidden surprise: type "bubu"
  setupHiddenSurprise();
});

function showNextQuestion(num) {
  document.querySelectorAll(".question-section").forEach((q) => q.classList.add("hidden"));
  const el = document.getElementById(`question${num}`);
  if (el) el.classList.remove("hidden");
}

function createFloatingElements() {
  const container = document.querySelector(".floating-elements");
  if (!container) return;

  const hearts = config.floatingEmojis?.hearts || ["❤️"];
  const bears = config.floatingEmojis?.bears || ["🧸"];

  hearts.forEach((h) => {
    const d = document.createElement("div");
    d.className = "heart";
    d.innerHTML = h;
    setRandomPosition(d);
    container.appendChild(d);
  });

  bears.forEach((b) => {
    const d = document.createElement("div");
    d.className = "bear";
    d.innerHTML = b;
    setRandomPosition(d);
    container.appendChild(d);
  });
}

function setRandomPosition(el) {
  el.style.left = Math.random() * 100 + "vw";
  el.style.animationDelay = Math.random() * 5 + "s";
  el.style.animationDuration = 10 + Math.random() * 20 + "s";
}

function prankNoButton(noBtn, yesBtn) {
  let attempts = 0;
  noBtn.style.position = "fixed";

  const move = () => {
    attempts++;
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);

    noBtn.style.left = `${Math.max(12, x)}px`;
    noBtn.style.top = `${Math.max(12, y)}px`;
    noBtn.style.transform = `rotate(${(Math.random() * 18 - 9).toFixed(0)}deg)`;

    const phrases = ["No 🙈", "No? sure? 😼", "Try again 😭", "Not happening 😌", "Nice try 😈", "Hehe nope 🫣", "Okay fine… 😵"];
    noBtn.textContent = phrases[Math.min(attempts - 1, phrases.length - 1)];

    if (attempts >= 7) {
      noBtn.textContent = "Yes!! 💘";
      noBtn.style.transform = "rotate(0deg)";
      noBtn.addEventListener("click", () => yesBtn.click(), { once: true });
    }
  };

  noBtn.addEventListener("mouseenter", move);
  noBtn.addEventListener("click", (e) => { e.preventDefault(); move(); });
  noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); move(); }, { passive: false });

  setTimeout(move, 200);
}

function setupLoveMeter() {
  const loveMeter = document.getElementById("loveMeter");
  const loveValue = document.getElementById("loveValue");
  const extraLove = document.getElementById("extraLove");
  if (!loveMeter || !loveValue || !extraLove) return;

  loveMeter.value = 100;
  loveValue.textContent = 100;

  loveMeter.addEventListener("input", () => {
    const v = parseInt(loveMeter.value, 10);
    loveValue.textContent = v;

    if (v > 100) {
      extraLove.classList.remove("hidden");

      if (v >= 5000) {
        extraLove.textContent = config.loveMessages?.extreme || "WOOOOW 🥰🚀💝";
        extraLove.classList.add("super-love");
      } else if (v > 1000) {
        extraLove.textContent = config.loveMessages?.high || "To infinity and beyond! 🚀💝";
        extraLove.classList.remove("super-love");
      } else {
        extraLove.textContent = config.loveMessages?.normal || "And beyond! 🥰";
        extraLove.classList.remove("super-love");
      }
    } else {
      extraLove.classList.add("hidden");
      extraLove.classList.remove("super-love");
    }
  });
}

function celebrate() {
  document.querySelectorAll(".question-section").forEach((q) => q.classList.add("hidden"));
  const section = document.getElementById("celebration");
  if (!section) return;
  section.classList.remove("hidden");

  const t = document.getElementById("celebrationTitle");
  const m = document.getElementById("celebrationMessage");
  const e = document.getElementById("celebrationEmojis");

  if (t) t.textContent = config.celebration?.title || "Yay! 🎉";
  if (m) m.textContent = config.celebration?.message || "I love you 💖";
  if (e) e.textContent = config.celebration?.emojis || "🎁💖🤗💝💋❤️💕";

  // Heart burst
  const container = document.querySelector(".floating-elements");
  if (!container) return;

  const hearts = config.floatingEmojis?.hearts || ["❤️"];
  for (let i = 0; i < 40; i++) {
    const d = document.createElement("div");
    d.className = "heart";
    d.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    setRandomPosition(d);
    container.appendChild(d);
  }
}

function setupHiddenSurprise() {
  const secret = "bubu";
  let buf = "";

  document.addEventListener("keydown", (e) => {
    buf += (e.key || "").toLowerCase();
    buf = buf.slice(-12);

    if (buf.includes(secret)) {
      buf = "";
      alert("💌 Hidden Surprise: Ro Ro loves you more than 10,000% 💖");
    }
  });
}
