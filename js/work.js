const viewport = document.getElementById("scrollViewport");

const projects = document.querySelectorAll(".project");
const thumbs = document.querySelectorAll(".thumb");
const cards = document.querySelectorAll(".stack-card");

const totalCards = cards.length;

/* =========================
   STACK POSITIONS
========================= */

function updateCards(activeIndex) {

  cards.forEach((card, index) => {

    const offset = index - activeIndex;

    // ONLY SHOW CURRENT + NEXT STACKED CARDS
    if (offset < 0) {
      card.style.opacity = "0";
      card.style.pointerEvents = "none";

      card.style.transform = `
        translateY(80px)
        scale(0.85)
        rotate(-8deg)
      `;

      return;
    }

    // STACK EFFECT
    const translateY = offset * 16;
    const scale = 1 - offset * 0.04;
    const rotate = offset * -2;
    const blur = offset * 0.5;
    const opacity = 1 - offset * 0.15;

    card.style.transform = `
      translateY(${translateY}px)
      scale(${scale})
      rotate(${rotate}deg)
    `;

    card.style.filter = `blur(${blur}px)`;
    card.style.opacity = opacity;
    card.style.zIndex = 100 - offset;
  });

  // LEFT ACTIVE
  projects.forEach((project, index) => {
    project.classList.toggle(
      "active",
      index === activeIndex
    );
  });

  // RIGHT ACTIVE
  thumbs.forEach((thumb, index) => {
    thumb.classList.toggle(
      "active",
      index === activeIndex
    );
  });
}

/* =========================
   SCROLL ANIMATION
========================= */

function animateStack() {

  const maxScroll = viewport.scrollHeight - viewport.clientHeight;
  const scrollTop = viewport.scrollTop;

  const progress =
    (scrollTop / maxScroll) * (totalCards - 1);

  const activeIndex = Math.round(progress);

  updateCards(activeIndex);
}

animateStack();

viewport.addEventListener("scroll", animateStack);
window.addEventListener("resize", animateStack);

thumb.addEventListener("click", () => {
  updateCards(index);

  cards[index].scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
});




/* =========================
   LENIS
========================= */

const lenis = new Lenis({
  wrapper: viewport,
  content: document.querySelector(".work"),
  smoothWheel: true,
  duration: 1.1,
  lerp: 0.08
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);