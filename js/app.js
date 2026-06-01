gsap.registerPlugin(ScrollTrigger);


/* ================================
   DOM REFERENCES
   ================================ */

const loaderContainer = document.querySelector(".page-fade-sequence__container");
const loaderTexts     = document.querySelectorAll(".page-fade-sequence__text-wrapper h2");
const loaderPanels    = document.querySelectorAll(".page-fade-sequence__item");

const menuWrapper  = document.querySelector(".menuWrapper");
const menuBtn      = document.querySelector(".menuBtn");
const menuText     = document.querySelector(".menuText");
const topLine      = document.querySelector(".menuLine.top");
const bottomLine   = document.querySelector(".menuLine.bottom");
const themeToggle  = document.getElementById("themeToggle");
const logoImg      = document.querySelector(".logo img");
const scrollFill   = document.querySelector(".scrollFill");
const scrollText   = document.querySelector(".scrollText");

const heroTopEl  = document.querySelector(".heroTop");
const heroNameEl = document.querySelector(".heroName");
const imgCircle  = document.querySelector(".imgCircle");

const aboutSection = document.querySelector(".about");
const meAnchor     = document.getElementById("meAnchor");
const meImg        = document.getElementById("meImg");

const workSection  = document.querySelector(".work-section");
const workSpacer   = document.querySelector(".work-spacer");
const stackCards   = document.querySelectorAll(".stack-card");
const projectItems = document.querySelectorAll(".project");
const thumbItems   = document.querySelectorAll(".thumb");

const laravelSection = document.querySelector(".laravel");
const touchSection   = document.querySelector(".touch");


/* ================================================================
   1. PAGE LOAD SEQUENCE  —  Staircase wipe + text entrance
   ================================================================ */

(function initLoader() {
    if (!loaderContainer || loaderTexts.length === 0 || loaderPanels.length === 0) return;

    // Always start at top
    window.scrollTo(0, 0);

    gsap.set(loaderTexts, { y: 50, opacity: 0 });

    const tl = gsap.timeline({
        delay: 0.15,
        onComplete: () => {
            gsap.set(loaderContainer, { autoAlpha: 0, pointerEvents: "none" });
        }
    });

    // Text slides up
    tl.to(loaderTexts, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "expo.out"
    });

    // Hold for reading
    tl.to({}, { duration: 0.8 });

    // Panels slide UP and OUT — left-to-right staircase
    tl.to(loaderPanels, {
        y: "-100%",
        duration: 1.2,
        stagger: { each: 0.1, from: "start" },
        ease: "power4.inOut"
    }, "+=0.1");

    // Text fades out at the same time panels start moving
    tl.to(loaderTexts, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
    }, "<+=0.3");
})();


/* ================================================================
   2. HERO ANIMATION  —  Mask-reveal on load + scroll parallax
   ================================================================ */

/**
 * Wraps an element's innerHTML in overflow:hidden + inner span.
 * Lets GSAP animate a clean clip-style slide-up.
 * Returns the inner span to animate.
 */
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

(function initHero() {
    if (!heroTopEl || !heroNameEl || !imgCircle) return;

    document.fonts.ready.then(() => {

        // Lines in .heroTop (h1 + p)
        const heroLines  = heroTopEl.querySelectorAll("h1, p");
        const heroInners = Array.from(heroLines).map(wrapForMask);

        gsap.fromTo(heroInners,
            { yPercent: 110 },
            {
                yPercent: 0,
                duration: 1.1,
                ease: "expo.out",
                stagger: 0.1,
                delay: 2.5   // fires after loader finishes
            }
        );

        // Large name
        const heroNameInner = wrapForMask(heroNameEl);
        gsap.fromTo(heroNameInner,
            { yPercent: 110 },
            { yPercent: 0, duration: 1.4, ease: "expo.out", delay: 2.8 }
        );

        // Profile circle
        gsap.fromTo(imgCircle,
            { y: 200, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.5, ease: "expo.out", delay: 2.5 }
        );
    });

    // Scroll parallax on hero content
    const heroTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
    heroTl.to(heroTopEl, { y: -120, opacity: 0.2, ease: "none" });
    heroTl.to(imgCircle, { y: -200, scale: 0.8, opacity: 0, ease: "none" }, 0);
})();


/* ================================================================
   3. ABOUT SECTION  —  Scroll reveals + draggable image + cursor
   ================================================================ */

(function initAbout() {
    if (!aboutSection || !meImg || !meAnchor) return;

    /* --- Scroll-triggered entrance --- */
    const abtTl = gsap.timeline({
        scrollTrigger: { trigger: ".about", start: "top 80%" }
    });

    abtTl.from(".abt-head",    { y: 100, opacity: 0, duration: 1.2, ease: "expo.out" });
    abtTl.from(".abt-headbtm", { y: 100, opacity: 0, duration: 1.2, ease: "expo.out" }, "-=1");
    abtTl.from(".abt-text",    { y: 80, opacity: 0, stagger: 0.2, duration: 1, ease: "power3.out" }, "-=0.8");


    /* --- Draggable image — position at anchor on load --- */
    let tx = 0, ty = 0;

    function initDragPos() {
        const ar = aboutSection.getBoundingClientRect();
        const wr = meAnchor.getBoundingClientRect();
        tx = wr.left - ar.left;
        ty = wr.top  - ar.top + aboutSection.scrollTop;
        meImg.style.transform = `translate(${tx}px, ${ty}px)`;
    }

    setTimeout(initDragPos, 600);
    window.addEventListener("resize", initDragPos);

    /* Drag state */
    let dragActive = false;
    let startCx = 0, startCy = 0;
    let startTx = 0, startTy = 0;

    function clamp(v, min, max) { return Math.max(min, Math.min(v, max)); }

    function onDragStart(cx, cy) {
        dragActive = true;
        startCx = cx; startCy = cy;
        startTx = tx; startTy = ty;
        meImg.classList.add("dragging");
    }

    function onDragMove(cx, cy) {
        if (!dragActive) return;
        const maxX = aboutSection.clientWidth  - meImg.offsetWidth;
        const maxY = aboutSection.clientHeight - meImg.offsetHeight;
        tx = clamp(startTx + cx - startCx, 0, maxX);
        ty = clamp(startTy + cy - startCy, 0, maxY);
        meImg.style.transform = `translate(${tx}px, ${ty}px)`;
    }

    function onDragEnd() {
        dragActive = false;
        meImg.classList.remove("dragging");
    }

    // Mouse events
    meImg.addEventListener("mousedown", (e) => { e.preventDefault(); onDragStart(e.clientX, e.clientY); });
    document.addEventListener("mousemove", (e) => onDragMove(e.clientX, e.clientY));
    document.addEventListener("mouseup", onDragEnd);

    // Touch events
    meImg.addEventListener("touchstart", (e) => onDragStart(e.touches[0].clientX, e.touches[0].clientY));
    document.addEventListener("touchmove",  (e) => onDragMove(e.touches[0].clientX, e.touches[0].clientY));
    document.addEventListener("touchend", onDragEnd);


    /* --- Custom cursor using /assets/cursor.cur — smooth weighted follow --- */
    const cursor = document.createElement("div");
    cursor.style.position    = "fixed";
    cursor.style.width       = "100px";
    cursor.style.height      = "2rem";
    cursor.style.pointerEvents = "none";
    cursor.style.zIndex      = "9999";
    cursor.style.opacity     = "0";
    cursor.style.transform   = "translate(-50%, -50%)";
    cursor.style.transition  = "opacity 0.2s ease";
    cursor.innerHTML = `<img src="/assets/cursor.cur" style="width:100%;height:2rem;border-radius:16px;">`;
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    (function animateCursor() {
        currentX += (mouseX - currentX) * 0.12;
        currentY += (mouseY - currentY) * 0.12;
        cursor.style.left = currentX + "px";
        cursor.style.top  = currentY + "px";
        requestAnimationFrame(animateCursor);
    })();

    document.addEventListener("mousemove", (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    meImg.addEventListener("mouseenter", () => { cursor.style.opacity = "1"; });
    meImg.addEventListener("mouseleave", () => { cursor.style.opacity = "0"; });

})();


/* ================================================================
   4. NAVBAR  —  Menu toggle + dark-mode toggle + scroll progress
   ================================================================ */

/* --- Menu open / close --- */

function openMenu() {
    if (menuWrapper) menuWrapper.classList.add("active");
    if (menuText)    menuText.textContent = "Close";
    if (topLine)    { topLine.style.transform    = "rotate(45deg)";  topLine.style.top      = "0.35rem"; }
    if (bottomLine) { bottomLine.style.transform = "rotate(-45deg)"; bottomLine.style.bottom = "0.35rem"; }
}

function closeMenu() {
    if (menuWrapper) menuWrapper.classList.remove("active");
    if (menuText)    menuText.textContent = "Menu";
    if (topLine)    { topLine.style.transform    = "rotate(0deg)";  topLine.style.top      = "0.1rem"; }
    if (bottomLine) { bottomLine.style.transform = "rotate(0deg)";  bottomLine.style.bottom = "0.1rem"; }
}

if (menuBtn) {
    menuBtn.addEventListener("click", (e) => {
        if (themeToggle && themeToggle.contains(e.target)) return;
        menuWrapper.classList.contains("active") ? closeMenu() : openMenu();
        e.stopPropagation();
    });
}

document.addEventListener("click", (e) => {
    if (menuWrapper && !menuWrapper.contains(e.target)) closeMenu();
});

// Smooth-scroll anchor links inside dropdown
document.querySelectorAll(".dropdownMenu a[href^='#']").forEach((link) => {
    link.addEventListener("click", (e) => {
        const id     = link.getAttribute("href").slice(1);
        const target = document.getElementById(id);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); }
        closeMenu();
    });
});


/* --- Dark-mode toggle --- */

if (themeToggle) {
    themeToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        document.body.classList.toggle("dark");
        if (logoImg) {
            logoImg.src = document.body.classList.contains("dark")
                ? "/assets/logoDark.png"
                : "/assets/logoLight.png";
        }
    });
}


/* --- Scroll progress bar --- */

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent   = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
    if (scrollFill) scrollFill.style.width   = `${percent}%`;
    if (scrollText) scrollText.textContent   = `${percent}%`;
}, { passive: true });


/* ================================================================
   5. WORK SECTION  —  Scroll-driven card stack
   ================================================================ */

(function initWork() {
    if (!workSection || !workSpacer || stackCards.length === 0) return;

    const totalCards = stackCards.length;

    function renderWork(index) {
        index = Math.max(0, Math.min(totalCards - 1, index));

        stackCards.forEach((card, i) => {
            const offset = i - index;

            if (offset === 0) {
                card.style.opacity   = "1";
                card.style.transform = "scale(1)";
                card.style.zIndex    = "100";
            } else if (offset > 0) {
                card.style.opacity   = "0.15";
                card.style.transform = `scale(${1 - offset * 0.03})`;
                card.style.zIndex    = String(100 - offset);
            } else {
                card.style.opacity   = "0";
                card.style.zIndex    = "0";
            }
        });

        projectItems.forEach((p, i) => p.classList.toggle("active", i === index));
        thumbItems.forEach((t, i)   => t.classList.toggle("active", i === index));
    }

    function updateWorkOnScroll() {
        const rect       = workSection.getBoundingClientRect();
        const sectionH   = workSpacer.offsetHeight;
        const viewportH  = window.innerHeight;
        const scrolled   = -rect.top;
        const scrollable = sectionH - viewportH;
        const progress   = Math.max(0, Math.min(1, scrolled / scrollable));
        renderWork(Math.round(progress * (totalCards - 1)));
    }

    window.addEventListener("scroll", updateWorkOnScroll, { passive: true });

    function scrollToCard(i) {
        const sectionH   = workSpacer.offsetHeight;
        const viewportH  = window.innerHeight;
        const scrollable = sectionH - viewportH;
        const target     = (scrollable / (totalCards - 1)) * i;
        const sectionTop = workSection.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: sectionTop + target, behavior: "smooth" });
    }

    projectItems.forEach((p, i) => p.addEventListener("click", () => scrollToCard(i)));
    thumbItems.forEach((t, i)   => t.addEventListener("click", () => scrollToCard(i)));

    renderWork(0);
    updateWorkOnScroll();
})();


/* ================================================================
   6. LARAVEL SECTION  —  Scroll-triggered entrance
   ================================================================ */

(function initLaravel() {
    if (!laravelSection) return;

    const tl = gsap.timeline({
        scrollTrigger: { trigger: laravelSection, start: "top 80%" }
    });

    tl.from(".project-title", {
        y: 80, opacity: 0, duration: 1.2, ease: "expo.out"
    });

    tl.from(".github-btn", {
        y: 60, opacity: 0, duration: 1, ease: "expo.out"
    }, "-=0.8");

    tl.from(".section-line", {
        scaleX: 0, opacity: 0, duration: 0.8, transformOrigin: "left center", ease: "power3.out"
    }, "-=0.6");

    tl.from(".project-card", {
        y: 100, opacity: 0, duration: 1, ease: "power3.out"
    }, "-=0.5");
})();


/* ================================================================
   7. TOUCH / CONTACT SECTION  —  Scroll-triggered entrance
   ================================================================ */

(function initTouch() {
    if (!touchSection) return;

    const tl = gsap.timeline({
        scrollTrigger: { trigger: touchSection, start: "top 80%" }
    });

    const touchP  = touchSection.querySelector("p");
    const touchA  = touchSection.querySelector("a");
    const touchH1 = touchSection.querySelector("h1");

    if (touchP)  tl.from(touchP,  { y: 60,  opacity: 0, duration: 1,   ease: "power3.out" });
    if (touchA)  tl.from(touchA,  { y: 40,  opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");
    if (touchH1) tl.from(touchH1, { y: 100, opacity: 0, duration: 1.2, ease: "expo.out"   }, "-=0.6");
})();


/* ================================================================
   8. FOOTER  —  Double-span hover-reveal
   Pure CSS — no JS needed.
   The .foot-top a and .foot-name a both use the
   translateY(-100%) trick on span:first-child on hover.
   ================================================================ */