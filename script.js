"use strict";

const contractAddress = "HDYP5e1dUM3zjqw3tQvDHDxtt6CKxkgyEN3NdNcXTRiX";
const copyButton = document.getElementById("copyButton");
const copyMessage = document.getElementById("copyMessage");
const floatingWorld = document.getElementById("floatingWorld");
const effectsLayer = document.getElementById("effectsLayer");
const cigaretteCount = 3;
const wineGlassCount = 3;
const floatingItems = [];

function randomNumber(min, max) { return Math.random() * (max - min) + min; }

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(contractAddress);
    copyButton.textContent = "✅ COPIED!";
    copyButton.classList.add("copied");
    copyMessage.textContent = "Contract address copied!";
    setTimeout(() => {
      copyButton.textContent = "📋 COPY CA";
      copyButton.classList.remove("copied");
      copyMessage.textContent = "";
    }, 2200);
  } catch {
    copyMessage.textContent = "Could not copy automatically. Please copy the address manually.";
  }
});

function createWineGlass() {
  const item = document.createElement("div");
  item.className = "floating-item wine-glass";
  item.innerHTML = `<div class="wine-bowl"><div class="wine-liquid"></div><div class="wine-shine"></div></div><div class="wine-stem"></div><div class="wine-base"></div>`;
  setupFloatingItem(item);
}

function createCigarette() {
  const item = document.createElement("div");
  item.className = "floating-item cigarette";
  item.innerHTML = `<div class="cigarette-smoke"></div><div class="cigarette-smoke-second"></div><div class="cigarette-fire"></div><div class="cigarette-ash"></div><div class="cigarette-paper"></div><div class="cigarette-filter"></div>`;
  setupFloatingItem(item);
}

function setupFloatingItem(element) {
  const item = {
    element,
    x: randomNumber(0, Math.max(1, window.innerWidth - 120)),
    y: randomNumber(0, Math.max(1, window.innerHeight - 120)),
    speedX: randomNumber(-0.45, 0.45),
    speedY: randomNumber(-0.35, 0.35),
    rotation: randomNumber(-18, 18),
    rotationSpeed: randomNumber(-0.15, 0.15),
    scale: randomNumber(0.72, 1.05),
    shooting: false
  };
  if (Math.abs(item.speedX) < 0.18) item.speedX = item.speedX < 0 ? -0.18 : 0.18;
  if (Math.abs(item.speedY) < 0.14) item.speedY = item.speedY < 0 ? -0.14 : 0.14;
  element.addEventListener("click", () => shootItem(item));
  floatingWorld.appendChild(element);
  floatingItems.push(item);
}

function animateFloatingItems() {
  floatingItems.forEach((item) => {
    if (item.shooting) return;
    const width = item.element.offsetWidth;
    const height = item.element.offsetHeight;
    item.x += item.speedX;
    item.y += item.speedY;
    item.rotation += item.rotationSpeed;
    if (item.x <= 0 || item.x + width >= window.innerWidth) item.speedX *= -1;
    if (item.y <= 0 || item.y + height >= window.innerHeight) item.speedY *= -1;
    item.x = Math.max(0, Math.min(item.x, Math.max(0, window.innerWidth - width)));
    item.y = Math.max(0, Math.min(item.y, Math.max(0, window.innerHeight - height)));
    item.element.style.transform = `translate(${item.x}px, ${item.y}px) rotate(${item.rotation}deg) scale(${item.scale})`;
  });
  requestAnimationFrame(animateFloatingItems);
}

function shootItem(item) {
  if (item.shooting) return;
  item.shooting = true;
  item.element.classList.add("is-shooting");
  const centerX = item.x + item.element.offsetWidth / 2;
  const centerY = item.y + item.element.offsetHeight / 2;
  createBlast(centerX, centerY);
  const directionX = centerX < window.innerWidth / 2 ? -1 : 1;
  const directionY = centerY < window.innerHeight / 2 ? -1 : 1;
  item.element.style.transform = `translate(${item.x + directionX * window.innerWidth}px, ${item.y + directionY * window.innerHeight}px) rotate(${item.rotation + 720}deg) scale(0.15)`;
  item.element.style.opacity = "0";
  setTimeout(() => {
    item.x = randomNumber(20, Math.max(21, window.innerWidth - 130));
    item.y = randomNumber(20, Math.max(21, window.innerHeight - 130));
    item.rotation = randomNumber(-20, 20);
    item.element.style.opacity = "1";
    item.element.classList.remove("is-shooting");
    item.shooting = false;
  }, 850);
}

function createBlast(x, y) {
  const particleCount = 12;
  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("div");
    particle.className = "blast-particle";
    const angle = (Math.PI * 2 * index) / particleCount;
    const distance = randomNumber(45, 105);
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.background = index % 2 === 0 ? "#ffef58" : "#ff3fa4";
    particle.style.setProperty("--particle-x", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--particle-y", `${Math.sin(angle) * distance}px`);
    effectsLayer.appendChild(particle);
    setTimeout(() => particle.remove(), 850);
  }
  const smoke = document.createElement("div");
  smoke.className = "blast-smoke";
  smoke.style.left = `${x - 15}px`;
  smoke.style.top = `${y - 15}px`;
  effectsLayer.appendChild(smoke);
  setTimeout(() => smoke.remove(), 850);
}

for (let i = 0; i < cigaretteCount; i += 1) createCigarette();
for (let i = 0; i < wineGlassCount; i += 1) createWineGlass();
animateFloatingItems();
