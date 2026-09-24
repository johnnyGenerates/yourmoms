"use strict";

const contractAddress = "HDYP5e1dUM3zjqw3tQvDHDxtt6CKxkgyEN3NdNcXTRiX";

const copyButton = document.getElementById("copyButton");
const copyMessage = document.getElementById("copyMessage");
const contractSection = document.getElementById("contractSection");

const floatingWorld = document.getElementById("floatingWorld");
const effectsLayer = document.getElementById("effectsLayer");

const wineGlassCount = 3;
const floatingItems = [];

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}


/* COPY CA */

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

    const temporaryInput = document.createElement("textarea");

    temporaryInput.value = contractAddress;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";

    document.body.appendChild(temporaryInput);

    temporaryInput.select();

    try {

      document.execCommand("copy");

      copyButton.textContent = "✅ COPIED!";
      copyButton.classList.add("copied");
      copyMessage.textContent = "Contract address copied!";

      setTimeout(() => {

        copyButton.textContent = "📋 COPY CA";
        copyButton.classList.remove("copied");
        copyMessage.textContent = "";

      }, 2200);

    } catch {

      copyMessage.textContent =
        "Could not copy automatically. Please copy the address manually.";

    }

    temporaryInput.remove();

  }

});


/* FLOATING WINE GLASSES */

function createWineGlass() {

  const item = document.createElement("div");

  item.className = "floating-item wine-glass";

  item.innerHTML = `
    <div class="wine-bowl">
      <div class="wine-liquid"></div>
      <div class="wine-shine"></div>
    </div>
    <div class="wine-stem"></div>
    <div class="wine-base"></div>
  `;

  setupFloatingItem(item);

}


function setupFloatingItem(element) {

  const item = {

    element,

    x: randomNumber(
      0,
      Math.max(1, window.innerWidth - 120)
    ),

    y: randomNumber(
      0,
      Math.max(1, window.innerHeight - 120)
    ),

    speedX: randomNumber(-0.45, 0.45),
    speedY: randomNumber(-0.35, 0.35),

    rotation: randomNumber(-18, 18),
    rotationSpeed: randomNumber(-0.15, 0.15),

    scale: randomNumber(0.72, 1.05),

    shooting: false

  };


  if (Math.abs(item.speedX) < 0.18) {
    item.speedX = item.speedX < 0 ? -0.18 : 0.18;
  }


  if (Math.abs(item.speedY) < 0.14) {
    item.speedY = item.speedY < 0 ? -0.14 : 0.14;
  }


  element.addEventListener(
    "click",
    () => shootItem(item)
  );


  floatingWorld.appendChild(element);

  floatingItems.push(item);

}


/* CHECK IF GLASS WOULD ENTER CONTRACT AREA */

function glassHitsContract(item, nextX, nextY) {

  if (!contractSection) {
    return false;
  }


  const contractRect =
    contractSection.getBoundingClientRect();


  const glassWidth =
    item.element.offsetWidth * item.scale;


  const glassHeight =
    item.element.offsetHeight * item.scale;


  /*
    Extra safety space around the contract box.
    This keeps the wine glasses clearly away from it.
  */

  const safety = 22;


  const contractLeft =
    contractRect.left - safety;


  const contractRight =
    contractRect.right + safety;


  const contractTop =
    contractRect.top - safety;


  const contractBottom =
    contractRect.bottom + safety;


  const glassLeft =
    nextX;


  const glassRight =
    nextX + glassWidth;


  const glassTop =
    nextY;


  const glassBottom =
    nextY + glassHeight;


  return (
    glassRight > contractLeft &&
    glassLeft < contractRight &&
    glassBottom > contractTop &&
    glassTop < contractBottom
  );

}


/* MOVE WINE GLASSES */

function animateFloatingItems() {

  floatingItems.forEach((item) => {

    if (item.shooting) {
      return;
    }


    const width =
      item.element.offsetWidth;


    const height =
      item.element.offsetHeight;


    let nextX =
      item.x + item.speedX;


    let nextY =
      item.y + item.speedY;


    /*
      If the next movement would put the glass
      inside the contract box, reverse direction.
    */

    if (glassHitsContract(item, nextX, nextY)) {

      const contractRect =
        contractSection.getBoundingClientRect();


      const glassCenterX =
        nextX + width / 2;


      const glassCenterY =
        nextY + height / 2;


      const contractCenterX =
        contractRect.left +
        contractRect.width / 2;


      const contractCenterY =
        contractRect.top +
        contractRect.height / 2;


      const horizontalDistance =
        Math.abs(
          glassCenterX -
          contractCenterX
        );


      const verticalDistance =
        Math.abs(
          glassCenterY -
          contractCenterY
        );


      if (horizontalDistance > verticalDistance) {

        item.speedX *= -1;

      } else {

        item.speedY *= -1;

      }


      nextX =
        item.x + item.speedX * 3;


      nextY =
        item.y + item.speedY * 3;

    }


    item.x = nextX;
    item.y = nextY;


    item.rotation +=
      item.rotationSpeed;


    if (
      item.x <= 0 ||
      item.x + width >= window.innerWidth
    ) {

      item.speedX *= -1;

    }


    if (
      item.y <= 0 ||
      item.y + height >= window.innerHeight
    ) {

      item.speedY *= -1;

    }


    item.x = Math.max(
      0,
      Math.min(
        item.x,
        Math.max(
          0,
          window.innerWidth - width
        )
      )
    );


    item.y = Math.max(
      0,
      Math.min(
        item.y,
        Math.max(
          0,
          window.innerHeight - height
        )
      )
    );


    item.element.style.transform =
      `translate(${item.x}px, ${item.y}px) rotate(${item.rotation}deg) scale(${item.scale})`;

  });


  requestAnimationFrame(
    animateFloatingItems
  );

}


/* SHOOT GLASS */

function shootItem(item) {

  if (item.shooting) {
    return;
  }


  item.shooting = true;

  item.element.classList.add(
    "is-shooting"
  );


  const centerX =
    item.x +
    item.element.offsetWidth / 2;


  const centerY =
    item.y +
    item.element.offsetHeight / 2;


  createBlast(
    centerX,
    centerY
  );


  const directionX =
    centerX < window.innerWidth / 2
      ? -1
      : 1;


  const directionY =
    centerY < window.innerHeight / 2
      ? -1
      : 1;


  item.element.style.transform =
    `translate(${item.x + directionX * window.innerWidth}px, ${item.y + directionY * window.innerHeight}px) rotate(${item.rotation + 720}deg) scale(0.15)`;


  item.element.style.opacity = "0";


  setTimeout(() => {

    item.x = randomNumber(
      20,
      Math.max(
        21,
        window.innerWidth - 130
      )
    );


    item.y = randomNumber(
      20,
      Math.max(
        21,
        window.innerHeight - 130
      )
    );


    item.rotation =
      randomNumber(-20, 20);


    /*
      If it respawns inside the contract area,
      put it near the bottom of the screen instead.
    */

    if (glassHitsContract(item, item.x, item.y)) {

      item.y =
        Math.max(
          20,
          window.innerHeight - 150
        );

    }


    item.element.style.opacity = "1";


    item.element.classList.remove(
      "is-shooting"
    );


    item.shooting = false;

  }, 850);

}


/* BLAST */

function createBlast(x, y) {

  const particleCount = 12;


  for (
    let index = 0;
    index < particleCount;
    index += 1
  ) {

    const particle =
      document.createElement("div");


    particle.className =
      "blast-particle";


    const angle =
      (Math.PI * 2 * index) /
      particleCount;


    const distance =
      randomNumber(45, 105);


    particle.style.left =
      `${x}px`;


    particle.style.top =
      `${y}px`;


    particle.style.background =
      index % 2 === 0
        ? "#ffef58"
        : "#ff3fa4";


    particle.style.setProperty(
      "--particle-x",
      `${Math.cos(angle) * distance}px`
    );


    particle.style.setProperty(
      "--particle-y",
      `${Math.sin(angle) * distance}px`
    );


    effectsLayer.appendChild(
      particle
    );


    setTimeout(
      () => particle.remove(),
      850
    );

  }


  const smoke =
    document.createElement("div");


  smoke.className =
    "blast-smoke";


  smoke.style.left =
    `${x - 15}px`;


  smoke.style.top =
    `${y - 15}px`;


  effectsLayer.appendChild(
    smoke
  );


  setTimeout(
    () => smoke.remove(),
    850
  );

}


/* CREATE GLASSES */

for (
  let i = 0;
  i < wineGlassCount;
  i += 1
) {

  createWineGlass();

}


animateFloatingItems();


/* =========================
   PANIC BUTTON
   ========================= */

const panicButton =
  document.getElementById("panicButton");

const panicOverlay =
  document.getElementById("panicOverlay");

const panicClose =
  document.getElementById("panicClose");

const panicStars =
  document.getElementById("panicStars");

const panicAlert =
  document.getElementById("panicAlert");

const panicGoodbye =
  document.getElementById("panicGoodbye");

const reducedMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

let panicTimer;
let previousFocus;
let alarmContext;
let alarmOscillators = [];


function stopAlarm() {

  alarmOscillators.forEach(
    (oscillator) => {

      try {
        oscillator.stop();
      } catch {}

    }
  );


  alarmOscillators = [];


  if (alarmContext) {

    const context =
      alarmContext;


    alarmContext =
      undefined;


    context
      .close()
      .catch(() => {});

  }

}


function startAlarm() {

  const AudioContextType =
    window.AudioContext ||
    window.webkitAudioContext;


  if (!AudioContextType) {
    return;
  }


  try {

    alarmContext =
      new AudioContextType();


    const context =
      alarmContext;


    const master =
      context.createGain();


    const compressor =
      context.createDynamicsCompressor();


    compressor.threshold.value =
      -18;


    compressor.ratio.value =
      8;


    master.gain.value =
      0.8;


    master
      .connect(compressor)
      .connect(context.destination);


    const now =
      context.currentTime;


    const duration =
      3.6;


    [0, 1].forEach((layer) => {

      const oscillator =
        context.createOscillator();


      const volume =
        context.createGain();


      oscillator.type =
        layer
          ? "square"
          : "sawtooth";


      volume.gain.value =
        layer
          ? 0.055
          : 0.12;


      oscillator
        .connect(volume)
        .connect(master);


      for (
        let i = 0;
        i < 5;
        i += 1
      ) {

        const time =
          now + i * 0.7;


        oscillator.frequency
          .setValueAtTime(
            layer ? 390 : 520,
            time
          );


        oscillator.frequency
          .exponentialRampToValueAtTime(
            layer ? 690 : 920,
            time + 0.35
          );


        oscillator.frequency
          .exponentialRampToValueAtTime(
            layer ? 390 : 520,
            time + 0.7
          );

      }


      oscillator.start(now);

      oscillator.stop(
        now + duration
      );


      alarmOscillators.push(
        oscillator
      );

    });


    const impact =
      context.createOscillator();


    const impactGain =
      context.createGain();


    impact.type =
      "sine";


    impact.frequency
      .setValueAtTime(
        135,
        now
      );


    impact.frequency
      .exponentialRampToValueAtTime(
        45,
        now + 0.35
      );


    impactGain.gain
      .setValueAtTime(
        0.6,
        now
      );


    impactGain.gain
      .exponentialRampToValueAtTime(
        0.001,
        now + 0.38
      );


    impact
      .connect(impactGain)
      .connect(master);


    impact.start(now);

    impact.stop(
      now + 0.4
    );


    alarmOscillators.push(
      impact
    );


    setTimeout(() => {

      if (alarmContext === context) {
        stopAlarm();
      }

    }, 3800);


  } catch {

    stopAlarm();

  }

}


function closePanic() {

  clearTimeout(panicTimer);

  stopAlarm();

  panicOverlay.hidden = true;

  panicOverlay.setAttribute(
    "aria-hidden",
    "true"
  );

  panicOverlay.classList.remove(
    "is-rare",
    "is-settling"
  );

  document.body.classList.remove(
    "panic-active"
  );

  panicStars.replaceChildren();

  panicButton.disabled = false;


  if (
    previousFocus &&
    typeof previousFocus.focus === "function"
  ) {

    previousFocus.focus();

  }

}


function startPanic() {

  if (!panicOverlay.hidden) {
    return;
  }


  startAlarm();


  previousFocus =
    document.activeElement;


  const rare =
    Math.random() < 0.05;


  panicAlert.textContent =
    rare
      ? "✦ RARE MOMS EVENT ✦"
      : "🚨 MOMS ALERT 🚨";


  panicGoodbye.textContent =
    rare
      ? "You found the rare MOMS moment. She’ll be back."
      : "She’ll be back.";


  panicOverlay.classList.toggle(
    "is-rare",
    rare
  );


  panicOverlay.classList.remove(
    "is-settling"
  );


  panicOverlay.hidden = false;


  panicOverlay.setAttribute(
    "aria-hidden",
    "false"
  );


  panicButton.disabled = true;

  panicClose.focus();


  if (!reducedMotion.matches) {

    document.body.classList.add(
      "panic-active"
    );


    for (
      let i = 0;
      i < 55;
      i += 1
    ) {

      const star =
        document.createElement("span");


      star.className =
        "panic-star";


      star.textContent =
        i % 3 === 0
          ? "✦"
          : "✧";


      star.style.setProperty(
        "--x",
        Math.random() * 100 + "%"
      );


      star.style.setProperty(
        "--y",
        Math.random() * 100 + "%"
      );


      star.style.setProperty(
        "--dx",
        (Math.random() - .5) * 500 + "px"
      );


      star.style.setProperty(
        "--dy",
        (Math.random() - .5) * 500 + "px"
      );


      star.style.setProperty(
        "--size",
        (12 + Math.random() * 30) + "px"
      );


      star.style.setProperty(
        "--duration",
        (1.5 + Math.random() * 2) + "s"
      );


      star.style.setProperty(
        "--color",
        i % 2
          ? "#ffe66f"
          : "#ff85d5"
      );


      panicStars.appendChild(
        star
      );

    }

  }


  panicTimer =
    setTimeout(() => {

      document.body.classList.remove(
        "panic-active"
      );


      panicOverlay.classList.add(
        "is-settling"
      );


      panicTimer =
        setTimeout(
          closePanic,
          reducedMotion.matches
            ? 2500
            : 2700
        );

    },
    reducedMotion.matches
      ? 1500
      : 5300
    );

}


panicButton.addEventListener(
  "click",
  startPanic
);


panicClose.addEventListener(
  "click",
  closePanic
);


panicOverlay.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Escape") {

      closePanic();

    }


    if (event.key === "Tab") {

      event.preventDefault();

      panicClose.focus();

    }

  }
);
