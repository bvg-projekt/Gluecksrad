const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupText = document.getElementById("popup-text");
const closeBtn = document.getElementById("closeBtn");
const confettiBtn = document.getElementById("confettiBtn");
const dailyInfo = document.getElementById("dailyInfo");

const segments = [
  { label: "Hauptgewinn", color: "yellow" },
  { label: "Mittlerer Gewinn", color: "gray" },
  { label: "Mittlerer Gewinn", color: "gray" },
  { label: "Kleiner Gewinn", color: "white" },
  { label: "Kleiner Gewinn", color: "white" },
  { label: "Niete", color: "black" },
];

let isSpinning = false;
let dailyUsed = false;

// Zeichnet das Rad
function drawWheel(rotation=0) {
  const radius = canvas.width / 2;
  const anglePerSegment = (2 * Math.PI) / segments.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(radius, radius);
  ctx.rotate(rotation);

  segments.forEach((seg, i) => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.fillStyle = seg.color;
    ctx.arc(0, 0, radius, i * anglePerSegment, (i + 1) * anglePerSegment);
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.fillStyle = seg.color === "black" ? "white" : "black";
    ctx.rotate(i * anglePerSegment + anglePerSegment / 2);
    ctx.textAlign = "right";
    ctx.font = "16px Arial";
    ctx.fillText(seg.label, radius - 10, 10);
    ctx.restore();
  });

  // Punkt in der Mitte
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();

  ctx.restore();
}

let rotation = 0;
drawWheel();

// Drehen
spinBtn.addEventListener("click", () => {
  if (isSpinning || dailyUsed) return;

  isSpinning = true;
  let spinTime = 0;
  let spinAngle = Math.random() * 10 + 20;

  const spinInterval = setInterval(() => {
    rotation += spinAngle * Math.PI/180;
    spinTime += 30;
    drawWheel(rotation);

    if (spinTime > 3000) {
      clearInterval(spinInterval);
      isSpinning = false;
      dailyUsed = true;
      dailyInfo.textContent = "Verfügbar: 0/1 Dreh heute";
      showResult();
    }
  }, 30);
});

// Ergebnis anzeigen
function showResult() {
  const anglePerSegment = (2 * Math.PI) / segments.length;
  const winningIndex = Math.floor(((rotation % (2*Math.PI)) / anglePerSegment + segments.length) % segments.length);
  const result = segments[segments.length - 1 - winningIndex];

  if (result.label === "Hauptgewinn") {
    popupTitle.textContent = "Herzlichen Glückwunsch, Sie haben gewonnen!";
    popupText.textContent = "Das Fundament für nachhaltige Projekte entsteht durch Kreislaufwirtschaft und Wiederverwendung.";
  } else if (result.label === "Mittlerer Gewinn") {
    popupTitle.textContent = "Herzlichen Glückwunsch, Sie haben gewonnen!";
    popupText.textContent = "Wie unsere Infrastruktur verbindet auch dieser Gewinn Natur und Zukunft.";
  } else if (result.label === "Kleiner Gewinn") {
    popupTitle.textContent = "Herzlichen Glückwunsch, Sie haben gewonnen!";
    popupText.textContent = "Aus kleinen Samen wächst neuer Lebensraum – nachhaltig und lebendig.";
  } else {
    popupTitle.textContent = "Leider verloren!";
    popupText.textContent = "Versuchen Sie es morgen erneut.";
  }

  popup.classList.remove("hidden");
  startConfetti();
}

// Buttons
closeBtn.addEventListener("click", () => {
  popup.classList.add("hidden");
});

confettiBtn.addEventListener("click", () => {
  startConfetti();
});

// Einfaches Konfetti
function startConfetti() {
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDuration = (Math.random() * 3 + 2) + "s";
    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
}
