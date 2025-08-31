
// ----------------- Dashboard -----------------
function updateDashboard() {
  document.getElementById("best-reaction").textContent = localStorage.getItem("reaction") || "—";
  document.getElementById("best-memory").textContent = localStorage.getItem("memory") || "—";
  document.getElementById("best-pattern").textContent = localStorage.getItem("pattern") || "—";
  document.getElementById("best-countdown").textContent = localStorage.getItem("countdown") || "—";
  document.getElementById("best-cupball").textContent = localStorage.getItem("cupball") || "—";
  document.getElementById("best-aim").textContent = localStorage.getItem("aim") || "—";
}
updateDashboard();

function showGame(name) {
  const area = document.getElementById("game-area");
  if (name === "reaction") startReactionGame(area);
  if (name === "memory") startMemoryGame(area);
  if (name === "pattern") startPatternGame(area);
  if (name === "aim") startAimTrainer(area);
  if (name === "countdown") startCountdownGame(area);
  if (name === "cupball") startCupBallGame(area);
}

/* ----------------- Helper: save best ----------------- */
function saveBest(key, value, lowerIsBetter) {
  const cur = localStorage.getItem(key);
  if (cur === null) {
    localStorage.setItem(key, value);
    updateDashboard();
    return;
  }
  const curNum = Number(cur);
  if (isNaN(curNum) || (lowerIsBetter ? value < curNum : value > curNum)) {
    localStorage.setItem(key, value);
    updateDashboard();
  }
}

/* ----------------- Reaction ----------------- */
function startReactionGame(container) {
  container.innerHTML = `
    <h2>⚡ Reaction Speed</h2>
    <p id="msg">Click START and wait for GREEN...</p>
    <button id="startBtn">START</button>
    <div id="clickArea" style="margin-top:20px;padding:50px;background:#ccc;cursor:pointer;">CLICK HERE</div>
    <p id="result"></p>
  `;
  const msg = document.getElementById("msg");
  const result = document.getElementById("result");
  const clickArea = document.getElementById("clickArea");
  const startBtn = document.getElementById("startBtn");
  let startTime, timeout, state = "idle";

  startBtn.onclick = () => {
    msg.textContent = "Wait for GREEN...";
    clickArea.style.background = "#f44336";
    state = "waiting";
    timeout = setTimeout(() => {
      clickArea.style.background = "#4caf50";
      msg.textContent = "CLICK NOW!";
      state = "go";
      startTime = Date.now();
    }, 1000 + Math.random() * 3000);
  };

  clickArea.onclick = () => {
    if (state === "waiting") {
      msg.textContent = "Too early!";
      clearTimeout(timeout);
      state = "idle";
    } else if (state === "go") {
      const reaction = Date.now() - startTime;
      result.textContent = `Your time: ${reaction} ms`;
      saveBest("reaction", reaction, true); // lower is better
      state = "idle";
    }
  };
}

/* ----------------- Memory (24 cards) ----------------- */
function startMemoryGame(container) {
  container.innerHTML = `<h2>🃏 Memory Game</h2><div id="board"></div><p id="moves">Moves: 0</p>`;
  const board = document.getElementById("board");

  // 12 pairs = 24 cards
  const cards = [
    "🍎","🍎","🐱","🐱","⚽","⚽","🚗","🚗","🌟","🌟","🍇","🍇",
    "🍉","🍉","🐶","🐶","🍒","🍒","🥑","🥑","🍌","🍌","🍍","🍍"
  ];
  cards.sort(() => 0.5 - Math.random());

  board.innerHTML = "";
  let first = null, moves = 0, matched = 0;

  cards.forEach(c => {
    const div = document.createElement("div");
    div.className = "card hidden";
    div.dataset.value = c;
    div.onclick = () => {
      if (div.classList.contains("hidden") && (!first || first !== div)) {
        div.textContent = c;
        div.classList.remove("hidden");
        if (!first) {
          first = div;
        } else {
          moves++;
          document.getElementById("moves").textContent = "Moves: " + moves;
          if (first.dataset.value === c) {
            matched += 2;
            first = null;
            if (matched === cards.length) {
              setTimeout(() => {
                alert("🎉 You won in " + moves + " moves!");
                saveBest("memory", moves, true); // lower moves is better
              }, 200);
            }
          } else {
            setTimeout(() => {
              div.textContent = "";
              div.classList.add("hidden");
              first.textContent = "";
              first.classList.add("hidden");
              first = null;
            }, 800);
          }
        }
      }
    };
    board.appendChild(div);
  });
}

/* ----------------- Pattern (9 colors) ----------------- */
function startPatternGame(container) {
  container.innerHTML = `<h2>🔴 Pattern Game</h2><div id="pattern-board"></div><p id="status">Click START</p><button id="startBtn">START</button>`;
  const colors = ["red","blue","green","yellow","orange","purple","cyan","pink","lime"];
  const board = document.getElementById("pattern-board");
  board.innerHTML = "";

  // create 9 color blocks (CSS grid will wrap)
  colors.forEach(c => {
    const div = document.createElement("div");
    div.style.background = c;
    div.dataset.color = c;
    div.addEventListener("click", () => handlePatternClick(div));
    board.appendChild(div);
  });

  let sequence = [], userSeq = [], round = 0;
  const status = document.getElementById("status");

  document.getElementById("startBtn").onclick = () => { sequence = []; round = 0; nextRound(); };

  function nextRound() {
    round++;
    userSeq = [];
    status.textContent = "Round " + round;
    sequence.push(colors[Math.floor(Math.random() * colors.length)]);
    playSequence();
  }

  function playSequence() {
    let i = 0;
    const interval = setInterval(() => {
      flash(sequence[i]);
      i++;
      if (i >= sequence.length) clearInterval(interval);
    }, 700);
  }

  function flash(color) {
    const el = document.querySelector(`[data-color='${color}']`);
    if (!el) return;
    el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), 350);
  }

  function handlePatternClick(div) {
    const color = div.dataset.color;
    userSeq.push(color);
    flash(color);
    // check correctness
    const idx = userSeq.length - 1;
    if (userSeq[idx] !== sequence[idx]) {
      status.textContent = "❌ Wrong! You reached round " + round;
      saveBest("pattern", round, false); // higher round better
      return;
    }
    if (userSeq.length === sequence.length) {
      // successful round
      setTimeout(nextRound, 600);
    }
  }
}

/* ----------------- Countdown ----------------- */
function startCountdownGame(container) {
  container.innerHTML = `
    <h2>⏳ Countdown Challenge</h2>
    <p>Click STOP to stop the timer as close to 0 as possible!</p>
    <button id="stopBtn">STOP</button>
    <p id="countResult"></p>
  `;
  const stopBtn = document.getElementById("stopBtn");
  const result = document.getElementById("countResult");
  const countdownTime = 10;
  let startTime = Date.now();
  let targetTime = startTime + countdownTime * 1000;
  let stopped = false;

  stopBtn.onclick = () => {
    if (stopped) return;
    stopped = true;
    const now = Date.now();
    let diff = (targetTime - now) / 1000;
    diff = Math.round(diff * 100) / 100;
    result.textContent = `Timer stopped at: ${diff >= 0 ? diff + " s left" : Math.abs(diff) + " s over"}`;
    saveBest("countdown", Math.abs(diff), true); // smaller diff is better
  };
}

/* ----------------- Cup & Ball (smooth shuffle) ----------------- */
function startCupBallGame(container) {
  container.innerHTML = `<h2>🎯 Cup & Ball Game</h2><p id="cup-msg">Watch the ball placement!</p><div id="cups"></div>`;
  const cupsContainer = document.getElementById("cups");
  const msg = document.getElementById("cup-msg");
  const cupCount = 5;
  let ballPos = Math.floor(Math.random() * cupCount); // logical position (index in cupElems)
  let cupElems = [];

  // create cups and listeners
  cupsContainer.innerHTML = "";
  for (let i = 0; i < cupCount; i++) {
    const cup = document.createElement("div");
    cup.className = "cup";
    // dataset.index is initial index (not relied on for guessing)
    cup.dataset.initialIndex = i;
    cup.addEventListener("click", () => {
      const clickedIndex = cupElems.indexOf(cup); // current logical index
      // Reveal ball at logical position
      document.querySelectorAll(".ball").forEach(b => b.remove());
      const correctCup = cupElems[ballPos];
      const ball = document.createElement("div"); ball.className = "ball bounce";
      correctCup.appendChild(ball);
      cupElems.forEach(c => c.classList.remove("lift"));
      cup.classList.add("lift");

      if (clickedIndex === ballPos) {
        msg.textContent = "🎉 Correct!";
        saveBest("cupball", 1, false);
      } else {
        msg.textContent = "❌ Wrong!";
        saveBest("cupball", 0, false);
      }
      setTimeout(() => cup.classList.remove("lift"), 1000);
    });
    cupsContainer.appendChild(cup);
    cupElems.push(cup);
  }

  // place ball under initial logical position visually
  cupElems[ballPos].appendChild(Object.assign(document.createElement("div"), { className: "ball" }));

  // after a short delay, remove ball and start shuffling
  setTimeout(() => {
    document.querySelectorAll(".ball").forEach(b => b.remove());
    msg.textContent = "Shuffling...";
    shuffleCups();
  }, 1200);

  function shuffleCups() {
    let swaps = 8;               // number of swaps
    let count = 0;
    const duration = 700;        // ms (animation duration)
    const pause = 150;           // short gap between swaps
    const step = cupElems[0].getBoundingClientRect().width + 20; // width + gap (20px as in CSS)

    const interval = setInterval(() => {
      // pick two distinct current logical indices
      const c1 = Math.floor(Math.random() * cupElems.length);
      let c2 = Math.floor(Math.random() * cupElems.length);
      while (c2 === c1) c2 = Math.floor(Math.random() * cupElems.length);

      const el1 = cupElems[c1];
      const el2 = cupElems[c2];

      // compute distance for visual translation
      const distance = (c2 - c1) * step;

      // animate moving
      el1.style.transition = `transform ${duration}ms ease`;
      el2.style.transition = `transform ${duration}ms ease`;
      el1.style.transform = `translateX(${distance}px)`;
      el2.style.transform = `translateX(${-distance}px)`;

      // after animation finishes, clear transform and reorder DOM to match new logical order
      setTimeout(() => {
        el1.style.transform = "";
        el2.style.transform = "";
        el1.style.transition = "";
        el2.style.transition = "";

        // swap elements in cupElems array (logical positions)
        const tmp = cupElems[c1];
        cupElems[c1] = cupElems[c2];
        cupElems[c2] = tmp;

        // rebuild DOM in cupElems order so the visual order matches logical order
        cupsContainer.innerHTML = "";
        cupElems.forEach(el => cupsContainer.appendChild(el));

        // update ballPos mapping
        if (ballPos === c1) ballPos = c2;
        else if (ballPos === c2) ballPos = c1;
      }, duration);

      count++;
      if (count >= swaps) {
        clearInterval(interval);
        // final short delay then enable guessing
        setTimeout(() => {
          msg.textContent = "Which cup has the ball?";
        }, duration + 150);
      }
    }, duration + pause);
  }
}

/* ----------------- Aim Trainer ----------------- */
function startAimTrainer(container) {
  container.innerHTML = `<h2>🟢 Aim Trainer</h2><p>Click as many targets as you can in 10 seconds!</p><div id="aim-area" style="position:relative;width:100%;height:300px;"></div>`;
  const area = document.getElementById("aim-area");
  area.innerHTML = "";
  let score = 0;
  const timeLimit = 10000;
  const start = Date.now();

  function createTarget() {
    const target = document.createElement("div");
    target.style.width = "40px";
    target.style.height = "40px";
    target.style.borderRadius = "50%";
    target.style.background = "red";
    target.style.position = "absolute";
    // ensure targets stay inside area
    const maxTop = Math.max(0, area.clientHeight - 40);
    const maxLeft = Math.max(0, area.clientWidth - 40);
    target.style.top = Math.random() * maxTop + "px";
    target.style.left = Math.random() * maxLeft + "px";
    target.onclick = () => {
      score++;
      target.remove();
      if (Date.now() - start < timeLimit) createTarget();
      else saveBest("aim", score, false);
    };
    area.appendChild(target);
  }

  // start by spawning first target
  createTarget();

  // end after timeLimit
  setTimeout(() => {
    alert("Time's up! Score: " + score);
    saveBest("aim", score, false);
  }, timeLimit);
}
