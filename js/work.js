const viewport = document.getElementById("scrollViewport");

const cards = document.querySelectorAll(".stack-card");
const projects = document.querySelectorAll(".project");
const thumbs = document.querySelectorAll(".thumb");

const totalCards = cards.length;

let activeIndex = 0;


function render(index) {
  activeIndex = Math.max(0, Math.min(totalCards - 1, index));

  cards.forEach((card, i) => {
    const offset = i - activeIndex;

    // ACTIVE CARD
    if (offset === 0) {
      card.style.opacity = "1";
      card.style.transform = "scale(1)";
      card.style.zIndex = 100;
      return;
    }

    // BEHIND CARDS (STACKED EXACTLY ON TOP)
    if (offset > 0) {
      card.style.opacity = "0.15";
      card.style.transform = `scale(${1 - offset * 0.03})`;
      card.style.zIndex = 100 - offset;
      return;
    }

    // FUTURE CARDS (HIDDEN)
    card.style.opacity = "0";
    card.style.zIndex = 0;
  });

  /* LEFT + RIGHT SYNC */
  projects.forEach((p, i) => {
    p.classList.toggle("active", i === activeIndex);
  });

  thumbs.forEach((t, i) => {
    t.classList.toggle("active", i === activeIndex);
  });
}

/* =========================
   SCROLL → INDEX (SMOOTH BUT ACCURATE)
========================= */

function getIndex() {
  const scrollTop = viewport.scrollTop;
  const maxScroll = viewport.scrollHeight - viewport.clientHeight;

  const progress = scrollTop / maxScroll;

  return Math.round(progress * (totalCards - 1));
}

/* SCROLL LISTENER */
viewport.addEventListener("scroll", () => {
  render(getIndex());
});

/* INIT */
render(0);



thumbs.forEach((thumb, index) => {
  thumb.addEventListener("click", () => {

    const maxScroll =
      viewport.scrollHeight - viewport.clientHeight;

    viewport.scrollTo({
      top: (maxScroll / (totalCards - 1)) * index,
      behavior: "smooth"
    });

    render(index);
  });
});



projects.forEach((project, index) => {
  project.addEventListener("click", () => {
    const maxScroll = viewport.scrollHeight - viewport.clientHeight;

    viewport.scrollTo({
      top: (maxScroll / (totalCards - 1)) * index,
      behavior: "smooth"
    });

    render(index);
  });
});