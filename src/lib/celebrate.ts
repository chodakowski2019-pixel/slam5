import confetti from "canvas-confetti";

const MOTIVATIONAL_LINES = [
  "Boom. One down. 💥",
  "That's how you do it. 🔥",
  "Keep going. Don't stop. 🥊",
  "Another one bites the dust. 💪",
  "You're on fire. 🔥",
  "Slammed it. Next. ⚡",
  "Winner move. Keep pushing. 🏆",
  "Easy work. What's next? 💣",
  "That felt good, right? 😏",
  "Unstoppable. 🚀",
  "Your brain just leveled up. 🧠",
  "One less thing on your mind. ✅",
  "You showed up. That's everything. 👊",
  "Discipline > Motivation. Always. 🎯",
  "Stack those wins. 📈",
];

export function getMotivationalLine(): string {
  return MOTIVATIONAL_LINES[Math.floor(Math.random() * MOTIVATIONAL_LINES.length)];
}

export function fireConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.7 },
    colors: ["#10b981", "#14b8a6", "#f59e0b", "#ef4444", "#34d399"],
  });
}

export function fireBigConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#10b981", "#14b8a6", "#f59e0b"],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#ef4444", "#34d399", "#06b6d4"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
}

export function playSound(type: "complete" | "win" | "lose") {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = 0.15;

    if (type === "complete") {
      osc.frequency.value = 523.25; // C5
      osc.type = "sine";
      osc.start();
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.15, ctx.currentTime + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === "win") {
      osc.frequency.value = 523.25;
      osc.type = "sine";
      osc.start();
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3);
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.45); // C6
      gain.gain.setValueAtTime(0.15, ctx.currentTime + 0.55);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
      osc.stop(ctx.currentTime + 0.9);
    } else {
      osc.frequency.value = 311.13; // Eb4
      osc.type = "sine";
      osc.start();
      osc.frequency.setValueAtTime(261.63, ctx.currentTime + 0.2); // C4
      gain.gain.setValueAtTime(0.12, ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.stop(ctx.currentTime + 0.6);
    }
  } catch {
    // Audio not available
  }
}

export function vibrateDevice() {
  try {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  } catch {
    // Vibration not available
  }
}

export function celebrate() {
  fireConfetti();
  playSound("complete");
  vibrateDevice();
  return getMotivationalLine();
}

export function celebrateWin() {
  fireBigConfetti();
  playSound("win");
  vibrateDevice();
}
