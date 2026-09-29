/* =========================
   $MOMS BADGES — PREVIEW UI
   ========================= */
const badgesFab = document.getElementById("badgesFab");
const badgesPanel = document.getElementById("badgesPanel");
const badgesClose = document.getElementById("badgesClose");
const badgesBackdrop = document.getElementById("badgesBackdrop");

function openBadgesPreview() {
  if (!badgesPanel) return;
  badgesBackdrop.hidden = false;
  badgesPanel.classList.add("is-open");
  badgesPanel.setAttribute("aria-hidden", "false");
  badgesFab.setAttribute("aria-expanded", "true");
  document.body.classList.add("badges-open");
  badgesClose.focus();
}
function closeBadgesPreview() {
  if (!badgesPanel) return;
  badgesPanel.classList.remove("is-open");
  badgesPanel.setAttribute("aria-hidden", "true");
  badgesFab.setAttribute("aria-expanded", "false");
  document.body.classList.remove("badges-open");
  window.setTimeout(() => { badgesBackdrop.hidden = true; }, 360);
  badgesFab.focus();
}
if (badgesFab && badgesPanel && badgesClose && badgesBackdrop) {
  badgesFab.addEventListener("click", openBadgesPreview);
  badgesClose.addEventListener("click", closeBadgesPreview);
  badgesBackdrop.addEventListener("click", closeBadgesPreview);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && badgesPanel.classList.contains("is-open")) closeBadgesPreview();
  });
}
