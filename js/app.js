

const menuWrapper = document.querySelector(".menuWrapper");
const menuBtn = document.querySelector(".menuBtn");

const menuText = document.querySelector(".menuText");

const topLine = document.querySelector(".menuLine.top");
const bottomLine = document.querySelector(".menuLine.bottom");

const themeToggle = document.getElementById("themeToggle");

const logoImg = document.querySelector(".logo img");

const scrollFill = document.querySelector(".scrollFill");
const scrollText = document.querySelector(".scrollText");

const heroName = document.querySelector(".heroName");
const imgCircle = document.querySelector(".imgCircle");

const heroTop = document.querySelector(".heroTop");

/* HERO GSAP ANIMATION */

window.addEventListener("load", () => {

  gsap.fromTo(
    heroTop,
    {
      y: 60,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out"
    }
  );

  gsap.fromTo(
    heroName,
    {
      y: 120,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 1.4,
      ease: "expo.out",
      delay: 0.15
    }
  );

  gsap.fromTo(
    imgCircle,
    {
      y: 200,
      opacity: 0
    },
    {
      y: -20,
      opacity: 1,
      duration: 1.8,
      ease: "expo.out",
      delay: 0.25
    }
  );
  

});

/* MENU */

menuBtn.addEventListener("click", (e) => {

  if (themeToggle.contains(e.target)) return;

  menuWrapper.classList.toggle("active");

  if (menuWrapper.classList.contains("active")) {

    menuText.textContent = "Close";

    topLine.style.transform = "rotate(45deg)";
    topLine.style.top = "0.35rem";

    bottomLine.style.transform = "rotate(-45deg)";
    bottomLine.style.bottom = "0.35rem";

  } else {

    menuText.textContent = "Menu";

    topLine.style.transform = "rotate(0deg)";
    topLine.style.top = "0.1rem";

    bottomLine.style.transform = "rotate(0deg)";
    bottomLine.style.bottom = "0.1rem";

  }

});

/* CLOSE MENU ON OUTSIDE CLICK */

document.addEventListener("click", (e) => {

  if (!menuWrapper.contains(e.target)) {

    menuWrapper.classList.remove("active");

    menuText.textContent = "Menu";

    topLine.style.transform = "rotate(0deg)";
    topLine.style.top = "0.1rem";

    bottomLine.style.transform = "rotate(0deg)";
    bottomLine.style.bottom = "0.1rem";

  }

});

/* DARK MODE */

themeToggle.addEventListener("click", (e) => {

  e.stopPropagation();

  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {

    logoImg.src = "/assets/logoDark.png";

  } else {

    logoImg.src = "/assets/logoLight.png";

  }

});

/* SCROLL PROGRESS */

window.addEventListener("scroll", () => {

  const scrollTop = window.scrollY;

  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const scrollPercent =
    docHeight > 0
      ? Math.round((scrollTop / docHeight) * 100)
      : 0;

  scrollFill.style.width = `${scrollPercent}%`;

  scrollText.textContent = `${scrollPercent}%`;

});

/* GSAP PLUGINS */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* HERO -> ABOUT PARALLAX */

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: 1
  }
});

/* HERO ELEMENTS MOVE */

tl.to(".heroTop", {
  y: -120,
  opacity: 0.2
}, 0);

tl.to(".heroName", {
  y: -220,
  opacity: 0
}, 0);

tl.to(".imgCircle", {
  y: -300,
  scale: 0.8,
  opacity: 0
}, 0);

/* ABOUT SECTION REVEAL */

gsap.from(".abt-head", {
  scrollTrigger: {
    trigger: ".about",
    start: "top 80%"
  },

  y: 100,
  opacity: 0,
  duration: 1.2,
  ease: "expo.out"
});

gsap.from(".abt-headbtm", {
  scrollTrigger: {
    trigger: ".about",
    start: "top 75%"
  },

  y: 100,
  opacity: 0,
  duration: 1.2,
  delay: 0.1,
  ease: "expo.out"
});

gsap.from(".abt-text", {
  scrollTrigger: {
    trigger: ".abt-body",
    start: "top 80%"
  },

  y: 80,
  opacity: 0,
  duration: 1,
  stagger: 0.2,
  ease: "power3.out"
});

gsap.from(".me-wrapper", {
  scrollTrigger: {
    trigger: ".abt-body",
    start: "top 80%"
  },

  scale: 0.7,
  opacity: 0,
  duration: 1.2,
  ease: "expo.out"
});

