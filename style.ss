
/* ---------- General ---------- */
body {
  background: #e6f0fa; /* Soft pastel blue */
  color: #333;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
}
h1, h2 {
  text-align: center;
  color: #222;
  margin-top: 20px;
}

/* ---------- Dashboard / Cards ---------- */
.score-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 20px;
  justify-items: center;
  margin: 20px;
}
.score-card {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  width: 140px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}
.score-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.15);
}
.game-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #1a73e8;
  margin-bottom: 8px;
  text-align: center;
}
.game-score {
  font-size: 1rem;
  color: #555;
  text-align: center;
}

/* ---------- Game Area ---------- */
#game-area {
  margin: 20px auto;
  padding: 20px;
  max-width: 700px;
  min-height: 350px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* ---------- Buttons ---------- */
button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  background: #1a73e8;
  color: #fff;
  margin-top: 10px;
  transition: transform 0.2s, background 0.2s;
}
button:hover {
  transform: translateY(-2px);
  background: #155ab6;
}

/* ---------- Reaction Area ---------- */
#clickArea {
  border-radius: 12px;
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
}

/* ---------- Memory Cards ---------- */
#board {
  display: grid;
grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 10px;
  justify-content: center;
}
#board .card {
  background: #e0e0e0;
  border-radius: 8px;
  text-align: center;
  font-size: 2rem;
  padding: 15px;
  cursor: pointer;
  transition: 0.3s;
  user-select: none;
}
#board .card.hidden {
  background: #c8c8c8;
  color: transparent;
}

/* Pattern Game Board */
#pattern-board {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-gap: 10px;
  margin-top: 20px;
  justify-content: center;
}

#pattern-board div {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s;
}

#pattern-board div.flash {
  transform: scale(1.2);
  box-shadow: 0 0 15px #000;
}


/* ---------- Cup & Ball ---------- */
#cups {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}
.cup {
  width: 60px;
  height: 80px;
  background: #ddd;
  border-radius: 0 0 12px 12px;
  position: relative;
  cursor: pointer;
  transition: transform 0.5s ease;
}
.cup.lift { transform: translateY(-15px); }
.ball {
  width: 25px;
  height: 25px;
  background: #1a73e8;
  border-radius: 50%;
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
}
.ball.bounce { animation: bounce 0.5s ease infinite alternate; }
@keyframes bounce { from { bottom: 5px; } to { bottom: 25px; } }

/* ---------- Aim Trainer ---------- */
#aim-area div {
  cursor: pointer;
  transition: 0.2s;
  border-radius: 50%;
}
#aim-area div:hover { transform: scale(1.2); }

/* ---------- Countdown ---------- */
#countResult {
  margin-top: 15px;
  font-weight: bold;
  font-size: 1.2rem;
  color: #1a73e8;
}
