const WIDTH = 1000;
const HEIGHT = 700;

const COLORS = {
  bg: 0x071b12,
  panel: 0x0d2b1f,
  green: 0x1faa59,
  green2: 0x168a47,
  white: 0xf5f7f4,
  muted: 0xb9c8c0,
  gold: 0xf4c542,
  red: 0xe05252,
  dark: 0x10231b
};

let gameState = {
  topic: "All Topics",
  questions: [],
  current: 0,
  score: 0,
  answered: false
};

function text(scene, x, y, content, size = 24, color = "#f5f7f4", style = {}) {
  return scene.add.text(x, y, content, {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: `${size}px`,
    color,
    fontStyle: style.fontStyle || "normal",
    align: style.align || "left",
    wordWrap: style.wordWrapWidth ? { width: style.wordWrapWidth } : undefined,
    lineSpacing: style.lineSpacing || 4
  });
}

function roundedButton(scene, x, y, w, h, label, callback, fill = COLORS.green) {
  const bg = scene.add.rectangle(x, y, w, h, fill, 1).setInteractive({ useHandCursor: true });
  bg.setStrokeStyle(2, 0xffffff, 0.12);
  const t = text(scene, x, y, label, 22, "#ffffff", { align: "center" }).setOrigin(0.5);
  bg.on("pointerover", () => bg.setFillStyle(COLORS.green2));
  bg.on("pointerout", () => bg.setFillStyle(fill));
  bg.on("pointerdown", callback);
  return { bg, t };
}

function panel(scene, x, y, w, h, fill = COLORS.panel) {
  const p = scene.add.rectangle(x, y, w, h, fill, 0.98);
  p.setStrokeStyle(2, 0x4fc477, 0.2);
  return p;
}

class BootScene extends Phaser.Scene {
  constructor() { super("Boot"); }
  create() {
    this.scene.start("Menu");
  }
}

class MenuScene extends Phaser.Scene {
  constructor() { super("Menu"); }
  create() {
    this.cameras.main.setBackgroundColor(COLORS.bg);
    this.add.circle(850, 80, 180, COLORS.green, 0.08);
    this.add.circle(120, 650, 220, COLORS.green, 0.06);

    text(this, WIDTH/2, 110, "NAIJA CIVIC QUEST", 54, "#f5f7f4", { align:"center", fontStyle:"bold" }).setOrigin(.5);
    text(this, WIDTH/2, 168, "Learn • Play • Know Your Civic Rights", 24, "#8fe2ad", { align:"center" }).setOrigin(.5);

    panel(this, WIDTH/2, 320, 720, 230);
    text(this, WIDTH/2, 255, "A quick 2D quiz adventure about Nigerian civics, PVCs and responsible citizenship.", 23, "#d6e2db", {
      align:"center", wordWrapWidth: 650
    }).setOrigin(.5);

    roundedButton(this, WIDTH/2, 380, 300, 68, "START QUEST", () => this.scene.start("Topic"));
    roundedButton(this, WIDTH/2, 465, 300, 58, "HOW TO PLAY", () => this.scene.start("HowTo"), COLORS.green2);

    text(this, WIDTH/2, 615, "3MTT Game Development Demo • Web MVP", 16, "#8ba99a", { align:"center" }).setOrigin(.5);
  }
}

class HowToScene extends Phaser.Scene {
  constructor() { super("HowTo"); }
  create() {
    this.cameras.main.setBackgroundColor(COLORS.bg);
    text(this, WIDTH/2, 80, "HOW TO PLAY", 42, "#ffffff", { align:"center", fontStyle:"bold" }).setOrigin(.5);

    panel(this, WIDTH/2, 335, 760, 430);
    const rules = [
      "1. Choose a civic topic.",
      "2. Read each question carefully.",
      "3. Pick one of four answers.",
      "4. Correct answers earn 10 points.",
      "5. Learn from the explanation after each answer.",
      "6. Finish the quiz and see your final score."
    ];
    rules.forEach((r, i) => text(this, 170, 175 + i*48, r, 22, "#dce9e2"));

    roundedButton(this, WIDTH/2, 600, 260, 58, "BACK TO MENU", () => this.scene.start("Menu"), COLORS.green2);
  }
}

class TopicScene extends Phaser.Scene {
  constructor() { super("Topic"); }
  create() {
    this.cameras.main.setBackgroundColor(COLORS.bg);
    text(this, WIDTH/2, 75, "CHOOSE YOUR TOPIC", 40, "#ffffff", { align:"center", fontStyle:"bold" }).setOrigin(.5);
    text(this, WIDTH/2, 125, "Start with any topic, or take the full quest.", 19, "#b9c8c0", { align:"center" }).setOrigin(.5);

    const topics = [
      ["All Topics", 250, 220],
      ["PVC & Voting", 500, 220],
      ["Government", 750, 220],
      ["Citizenship", 250, 390],
      ["Democracy", 500, 390],
      ["Civic Participation", 750, 390]
    ];

    topics.forEach(([name, x, y]) => {
      roundedButton(this, x, y, 220, 82, name, () => {
        gameState.topic = name;
        const pool = name === "All Topics" ? QUESTIONS : QUESTIONS.filter(q => q.topic === name);
        gameState.questions = Phaser.Utils.Array.Shuffle(pool.slice()).slice(0, Math.min(10, pool.length));
        if (gameState.questions.length === 0) gameState.questions = Phaser.Utils.Array.Shuffle(QUESTIONS.slice()).slice(0, 10);
        gameState.current = 0;
        gameState.score = 0;
        gameState.answered = false;
        this.scene.start("Quiz");
      });
    });

    roundedButton(this, WIDTH/2, 555, 220, 54, "BACK", () => this.scene.start("Menu"), COLORS.green2);
  }
}

class QuizScene extends Phaser.Scene {
  constructor() { super("Quiz"); }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.bg);
    this.renderQuestion();
  }

  renderQuestion() {
    this.children.removeAll(true);
    const q = gameState.questions[gameState.current];
    const total = gameState.questions.length;
    const n = gameState.current + 1;

    text(this, 55, 45, `NAIJA CIVIC QUEST`, 20, "#8fe2ad", { fontStyle:"bold" });
    text(this, 945, 45, `SCORE: ${gameState.score}`, 20, "#f4c542", { align:"right", fontStyle:"bold" }).setOrigin(1,0);

    text(this, WIDTH/2, 92, `QUESTION ${n} / ${total}`, 18, "#b9c8c0", { align:"center" }).setOrigin(.5);
    const progress = this.add.rectangle(500, 125, 760, 10, 0x183c2b);
    this.add.rectangle(500 - 380 + (760 * n / total)/2, 125, 760 * n / total, 10, COLORS.green);

    text(this, 500, 175, q.topic.toUpperCase(), 16, "#8fe2ad", { align:"center", fontStyle:"bold" }).setOrigin(.5);

    panel(this, 500, 280, 850, 170);
    text(this, 500, 280, q.question, 29, "#ffffff", {
      align:"center", wordWrapWidth: 760, fontStyle:"bold"
    }).setOrigin(.5);

    const positions = [
      [270, 445], [730, 445],
      [270, 545], [730, 545]
    ];

    q.options.forEach((option, i) => {
      const b = roundedButton(this, positions[i][0], positions[i][1], 410, 70,
        `${String.fromCharCode(65+i)}. ${option}`, () => this.answer(i), COLORS.green2);
      b.bg.setData("option", i);
    });

    text(this, 500, 635, "Choose the best answer. You will see a civic explanation after answering.", 16, "#91a99c", { align:"center" }).setOrigin(.5);
  }

  answer(index) {
    if (gameState.answered) return;
    gameState.answered = true;
    const q = gameState.questions[gameState.current];
    const correct = index === q.answer;
    if (correct) gameState.score += 10;

    this.children.removeAll(true);
    text(this, WIDTH/2, 80, correct ? "CORRECT!" : "NOT QUITE", 46, correct ? "#63dc8e" : "#ff7a7a", { align:"center", fontStyle:"bold" }).setOrigin(.5);

    panel(this, WIDTH/2, 290, 760, 300);
    text(this, WIDTH/2, 185, correct ? "+10 POINTS" : "KEEP LEARNING", 22, correct ? "#f4c542" : "#ffb0b0", { align:"center", fontStyle:"bold" }).setOrigin(.5);
    text(this, WIDTH/2, 260, q.explanation, 23, "#e1ebe5", { align:"center", wordWrapWidth: 650 }).setOrigin(.5);
    text(this, WIDTH/2, 370, `Your score: ${gameState.score}`, 22, "#ffffff", { align:"center", fontStyle:"bold" }).setOrigin(.5);

    const nextLabel = gameState.current + 1 >= gameState.questions.length ? "SEE RESULTS" : "NEXT QUESTION";
    roundedButton(this, WIDTH/2, 510, 280, 62, nextLabel, () => {
      if (gameState.current + 1 >= gameState.questions.length) {
        this.scene.start("Results");
      } else {
        gameState.current++;
        gameState.answered = false;
        this.renderQuestion();
      }
    });
  }
}

class ResultsScene extends Phaser.Scene {
  constructor() { super("Results"); }
  create() {
    this.cameras.main.setBackgroundColor(COLORS.bg);
    const total = gameState.questions.length * 10;
    const percent = Math.round((gameState.score / total) * 100);
    let message = percent >= 80 ? "Excellent civic knowledge!" : percent >= 60 ? "Good work — keep learning!" : "Good start — practice makes progress!";

    text(this, WIDTH/2, 90, "QUEST COMPLETE!", 48, "#ffffff", { align:"center", fontStyle:"bold" }).setOrigin(.5);
    panel(this, WIDTH/2, 315, 650, 370);

    text(this, WIDTH/2, 205, `${gameState.score} / ${total}`, 72, "#f4c542", { align:"center", fontStyle:"bold" }).setOrigin(.5);
    text(this, WIDTH/2, 285, `${percent}%`, 34, "#8fe2ad", { align:"center", fontStyle:"bold" }).setOrigin(.5);
    text(this, WIDTH/2, 350, message, 24, "#ffffff", { align:"center" }).setOrigin(.5);
    text(this, WIDTH/2, 405, "Topic: " + gameState.topic, 18, "#b9c8c0", { align:"center" }).setOrigin(.5);

    roundedButton(this, WIDTH/2 - 160, 520, 280, 60, "PLAY AGAIN", () => this.scene.start("Topic"));
    roundedButton(this, WIDTH/2 + 160, 520, 180, 60, "MAIN MENU", () => this.scene.start("Menu"), COLORS.green2);

    text(this, WIDTH/2, 625, "Civic knowledge is a tool for responsible participation.", 16, "#91a99c", { align:"center" }).setOrigin(.5);
  }
}

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  parent: "game-container",
  backgroundColor: "#071b12",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, MenuScene, HowToScene, TopicScene, QuizScene, ResultsScene]
};

new Phaser.Game(config);
