/* =========================
   ELEMENTS
========================= */

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

const me = document.getElementById("meImg");


/* =========================
   ABOUT IMAGE HOVER CURSOR
========================= */

(function () {

    if (!me) return;

    const hoverImg = document.createElement("div");

    hoverImg.style.position = "fixed";
    hoverImg.style.width = "100px";
    hoverImg.style.height = "2rem";
    hoverImg.style.pointerEvents = "none";
    hoverImg.style.zIndex = "9999";
    hoverImg.style.opacity = "0";
    hoverImg.style.transform = "translate(-50%, -50%) scale(0.9)";
    hoverImg.style.transition = "opacity 0.25s ease, transform 0.15s ease";

    hoverImg.innerHTML = `
        <img src="/assets/cursor.cur"
             style="width:100%;height: 2rem;;border-radius:14px;transform: translate3d(2rem, 0, 0) scale(1.1); transition: all 0.6s cubic-bezier(0.76, 0, 0.24, 1);">
    `;

    document.body.appendChild(hoverImg);

    let active = false;

    document.addEventListener("mousemove", (e) => {
        if (!active) return;

        hoverImg.style.left = e.clientX + "px";
        hoverImg.style.top = e.clientY + "px";
    });

    me.addEventListener("mouseenter", () => {
        active = true;
        hoverImg.style.opacity = "1";
        hoverImg.style.transform = "translate(-50%, -50%) scale(1)";
    });

    me.addEventListener("mouseleave", () => {
        active = false;
        hoverImg.style.opacity = "0";
        hoverImg.style.transform = "translate(-50%, -50%) scale(0.9)";
    });

})();


/* =========================
   DRAGGABLE ABOUT IMAGE
========================= */

(function () {

    const about = document.querySelector(".about");
    const anchor = document.getElementById("meAnchor");

    let tx = 0, ty = 0;

    function initPos() {
        const ar = about.getBoundingClientRect();
        const wr = anchor.getBoundingClientRect();

        tx = wr.left - ar.left;
        ty = wr.top - ar.top + about.scrollTop;

        me.style.transform = `translate(${tx}px, ${ty}px)`;
    }

    window.addEventListener("load", () => setTimeout(initPos, 800));
    window.addEventListener("resize", initPos);

    let active = false;
    let startCx = 0, startCy = 0;
    let startTx = 0, startTy = 0;

    function clamp(v, min, max) {
        return Math.max(min, Math.min(v, max));
    }

    function dragStart(cx, cy) {
        active = true;
        startCx = cx;
        startCy = cy;
        startTx = tx;
        startTy = ty;
        me.classList.add("dragging");
    }

    function dragMove(cx, cy) {
        if (!active) return;

        const maxX = about.clientWidth - me.offsetWidth;
        const maxY = about.clientHeight - me.offsetHeight;

        tx = clamp(startTx + cx - startCx, 0, maxX);
        ty = clamp(startTy + cy - startCy, 0, maxY);

        me.style.transform = `translate(${tx}px, ${ty}px)`;
    }

    function dragEnd() {
        active = false;
        me.classList.remove("dragging");
    }

    me.addEventListener("mousedown", (e) => {
        e.preventDefault();
        dragStart(e.clientX, e.clientY);
    });

    document.addEventListener("mousemove", (e) => dragMove(e.clientX, e.clientY));
    document.addEventListener("mouseup", dragEnd);

    me.addEventListener("touchstart", (e) => {
        dragStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    document.addEventListener("touchmove", (e) => {
        dragMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    document.addEventListener("touchend", dragEnd);

})();


/* =========================
   HERO MASK REVEAL (GSAP)
========================= */

function wrapForMask(el) {
    const outer = document.createElement("span");
    outer.style.cssText = "display:block;overflow:hidden;line-height:inherit;";

    const inner = document.createElement("span");
    inner.style.display = "block";
    inner.innerHTML = el.innerHTML;

    outer.appendChild(inner);
    el.innerHTML = "";
    el.appendChild(outer);

    return inner;
}

window.addEventListener("load", () => {

    const heroLines = document.querySelectorAll(".heroTop h1, .heroTop p");
    const heroInners = Array.from(heroLines).map(wrapForMask);

    gsap.fromTo(heroInners,
        { yPercent: 110 },
        {
            yPercent: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.1
        }
    );

    const heroNameInner = wrapForMask(heroName);

    gsap.fromTo(heroNameInner,
        { yPercent: 110 },
        {
            yPercent: 0,
            duration: 1.4,
            ease: "expo.out",
            delay: 0.3
        }
    );

    gsap.fromTo(imgCircle,
        { y: 200, opacity: 0 },
        { y: -20, opacity: 1, duration: 1.8, ease: "expo.out", delay: 0.25 }
    );

});


/* =========================
   MENU TOGGLE
========================= */

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


/* =========================
   DARK MODE
========================= */

themeToggle.addEventListener("click", (e) => {

    e.stopPropagation();

    document.body.classList.toggle("dark");

    logoImg.src = document.body.classList.contains("dark")
        ? "/assets/logoDark.png"
        : "/assets/logoLight.png";
});


/* =========================
   SCROLL PROGRESS
========================= */

window.addEventListener("scroll", () => {

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    const percent = docHeight > 0
        ? Math.round((scrollTop / docHeight) * 100)
        : 0;

    scrollFill.style.width = `${percent}%`;
    scrollText.textContent = `${percent}%`;

});


/* =========================
   GSAP PLUGINS + HERO PARALLAX
========================= */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
    }
});

tl.to(".heroTop", {
    y: -120,
    opacity: 0.2
}, 0);

tl.to(".heroName .mask-inner, .heroName", {
    y: -220,
    opacity: 0
}, 0);

tl.to(".imgCircle", {
    y: -300,
    scale: 0.8,
    opacity: 0
}, 0);


/* ABOUT REVEALS */

gsap.from(".abt-head", {
    scrollTrigger: { trigger: ".about", start: "top 80%" },
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: "expo.out"
});

gsap.from(".abt-headbtm", {
    scrollTrigger: { trigger: ".about", start: "top 75%" },
    y: 100,
    opacity: 0,
    duration: 1.2,
    delay: 0.1,
    ease: "expo.out"
});

gsap.from(".abt-text", {
    scrollTrigger: { trigger: ".abt-body", start: "top 80%" },
    y: 80,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out"
});

gsap.from(".me-wrapper", {
    scrollTrigger: { trigger: ".abt-body", start: "top 80%" },
    scale: 0.7,
    opacity: 0,
    duration: 1.2,
    ease: "expo.out"
});