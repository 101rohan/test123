window.addEventListener("load", () => {
    window.scrollTo(0, 0);
});


/* ELEMENTS */

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


/* HOVER EFFECT (CURSOR FOLLOW WITH WEIGHT) */

(function () {
 if (!me) return;
 const cursor = document.createElement("div");
 cursor.style.position = "fixed"; cursor.style.width = "100px"; cursor.style.height = "2rem"; cursor.style.pointerEvents = "none"; cursor.style.zIndex = "9999"; cursor.style.opacity = "0"; cursor.style.transform = "translate(-50%, -50%)"; cursor.style.transition = "opacity 0.2s ease";
 cursor.innerHTML = `     <img src="/assets/cursor.cur"          style="width:100%;height: 2rem;;border-radius:16px;"> `;

    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let active = false;

    /* smooth follow (weight effect) */
    function animate() {
        currentX += (mouseX - currentX) * 0.12;
        currentY += (mouseY - currentY) * 0.12;

        cursor.style.left = currentX + "px";
        cursor.style.top = currentY + "px";

        requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    me.addEventListener("mouseenter", () => {
        active = true;
        cursor.style.opacity = "1";
    });

    me.addEventListener("mouseleave", () => {
        active = false;
        cursor.style.opacity = "0";
    });

})();


/* DRAGGABLE ABOUT IMAGE */

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

    window.addEventListener("load", () => setTimeout(initPos, 600));
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
    });

    document.addEventListener("touchmove", (e) => {
        dragMove(e.touches[0].clientX, e.touches[0].clientY);
    });

    document.addEventListener("touchend", dragEnd);

})();


/* HERO ANIMATION (GSAP) */

function wrapForMask(el) {
    const outer = document.createElement("span");
    outer.style.cssText = "display:block;overflow:hidden;";

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
        { y: 0, opacity: 1, duration: 1.5, ease: "expo.out" }
    );

});


/* MENU TOGGLE */


function openMenu() {
    menuWrapper.classList.add("active");
    menuText.textContent = "Close";

    topLine.style.transform = "rotate(45deg)";
    topLine.style.top = "0.35rem";

    bottomLine.style.transform = "rotate(-45deg)";
    bottomLine.style.bottom = "0.35rem";
}

function closeMenu() {
    menuWrapper.classList.remove("active");
    menuText.textContent = "Menu";

    topLine.style.transform = "rotate(0deg)";
    topLine.style.top = "0.1rem";

    bottomLine.style.transform = "rotate(0deg)";
    bottomLine.style.bottom = "0.1rem";
}

menuBtn.addEventListener("click", (e) => {

    if (themeToggle.contains(e.target)) return;

    if (menuWrapper.classList.contains("active")) {
        closeMenu();
    } else {
        openMenu();
    }

    e.stopPropagation();
});


document.addEventListener("click", (e) => {
    if (!menuWrapper.contains(e.target)) {
        closeMenu();
    }
});


/* DARK MODE */

themeToggle.addEventListener("click", (e) => {

    e.stopPropagation();

    document.body.classList.toggle("dark");

    logoImg.src = document.body.classList.contains("dark")
        ? "/assets/logoDark.png"
        : "/assets/logoLight.png";
});


/* SCROLL PROGRESS */

window.addEventListener("scroll", () => {

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    const percent = docHeight > 0
        ? Math.round((scrollTop / docHeight) * 100)
        : 0;

    scrollFill.style.width = `${percent}%`;
    scrollText.textContent = `${percent}%`;

});


/* GSAP SCROLL EFFECTS */

gsap.registerPlugin(ScrollTrigger);

gsap.to(".heroTop", {
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        scrub: true
    },
    y: -120,
    opacity: 0.2
});

gsap.to(".imgCircle", {
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        scrub: true
    },
    y: -200,
    scale: 0.8,
    opacity: 0
});


/* ABOUT REVEALS */

gsap.from(".abt-head", {
    scrollTrigger: { trigger: ".about", start: "top 80%" },
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: "expo.out"
});

gsap.from(".abt-text", {
    scrollTrigger: { trigger: ".about", start: "top 80%" },
    y: 80,
    opacity: 0,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out"
});