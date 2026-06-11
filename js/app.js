/* ============================================================
   app.js  —  Full animation & interaction layer
   Requires: GSAP 3 + ScrollTrigger (loaded before this file)
   ============================================================ */

import { prepareWithSegments, layoutNextLineRange, materializeLineRange } from 'https://esm.sh/@chenglou/pretext';

/* Grab GSAP globals exposed by CDN scripts */
const gsap          = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

/* ================================
   REGISTER PLUGINS
   ================================ */

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

    window.scrollTo(0, 0);

    gsap.set(loaderTexts, { y: 50, opacity: 0 });

    const tl = gsap.timeline({
        delay: 0.15,
        onComplete: () => {
            gsap.set(loaderContainer, { autoAlpha: 0, pointerEvents: "none" });
        }
    });

    tl.to(loaderTexts, { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "expo.out" });
    tl.to({}, { duration: 0.8 });
    tl.to(loaderPanels, {
        y: "-100%",
        duration: 1.2,
        stagger: { each: 0.1, from: "start" },
        ease: "power4.inOut"
    }, "+=0.1");
    tl.to(loaderTexts, { opacity: 0, duration: 0.3, ease: "power2.in" }, "<+=0.3");
})();


/* ================================================================
   2. HERO ANIMATION  —  Mask-reveal on load + scroll parallax
   ================================================================ */

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
    if (!heroTopEl || !heroNameEl) return;

    // Hide immediately before fonts resolve — prevents flash
    const heroH1s = Array.from(heroTopEl.querySelectorAll("h1"));
    const heroP   = heroTopEl.querySelector("p");
    const allEls  = heroP ? [...heroH1s, heroP] : heroH1s;

    gsap.set(allEls, { yPercent: 110 });
    gsap.set(heroNameEl, { yPercent: 110 });

    document.fonts.ready.then(() => {
        gsap.to(heroH1s, {
            yPercent: 0,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.12,
            delay: 2.5
        });

        if (heroP) {
            gsap.to(heroP, {
                yPercent: 0,
                duration: 1,
                ease: "expo.out",
                delay: 2.75
            });
        }

        gsap.to(heroNameEl, {
            yPercent: 0,
            duration: 1.4,
            ease: "expo.out",
            delay: 2.8
        });
    });

    const heroTl = gsap.timeline({
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
    heroTl.to(heroTopEl, { y: -120, opacity: 0.2, ease: "none" });
})();


/* ================================================================
   3. ABOUT SECTION  —  Scroll reveals + draggable image + Pretext flow
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


    
    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       PRETEXT — dynamic text reflow around the draggable photo
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    const PARA1 = "I'm an aspiring UI/UX designer and Laravel developer focused on creating products that are both intuitive and technically solid. I enjoy translating user needs into clean interfaces and then bringing them to life with scalable backend systems.";
    const PARA2 = "From wireframes to working applications, I like building solutions where design and development support each other instead of competing.";

    /* Replace static <p> tags with a single managed container */
    const leftAbtText   = document.querySelector(".abt-body .abt-text");
    const paras         = leftAbtText ? leftAbtText.querySelectorAll("p") : [];
    const flowContainer = document.createElement("div");
    flowContainer.className = "abt-flow-container";
    if (paras.length >= 2) {
        paras[0].parentNode.insertBefore(flowContainer, paras[0]);
        paras[0].remove();
        paras[1].remove();
    }

    /* Pretext state — populated after fonts resolve */
    let preparedPara1 = null;
    let preparedPara2 = null;
    let FONT        = "18px Inter";
    let LINE_HEIGHT = 24;
    const PARA_GAP  = 22;  /* matches original margin-bottom on <p> */

    /* Container geometry cached in section-relative coords.
       cR.top - sR.top stays constant during scroll — no viewport dependency. */
    let contLeft = 0, contTop = 0, contRight = 0, contW = 0;

    function updateContainerGeometry() {
        const sR  = aboutSection.getBoundingClientRect();
        const cR  = flowContainer.getBoundingClientRect();
        contLeft  = cR.left   - sR.left;
        contTop   = cR.top    - sR.top;
        contRight = cR.right  - sR.left;
        contW     = flowContainer.offsetWidth;
    }

    document.fonts.ready.then(() => {
        const basePx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const fontPx = Math.round(basePx * 1.15);
        FONT        = `${fontPx}px Inter`;
        LINE_HEIGHT = Math.round(fontPx * 1.32);

        preparedPara1 = prepareWithSegments(PARA1, FONT);
        preparedPara2 = prepareWithSegments(PARA2, FONT);

        updateContainerGeometry();
        reflowText();
    });

    /* ── Core reflow: rebuild all line spans, routing around the image ── */
    let reflowPending = false;

    function reflowText() {
        if (!preparedPara1 || !preparedPara2 || contW <= 0) return;

        /* Image bounds in section-relative coords.
           tx / ty come from the drag system and are already section-relative. */
        const imgL = tx;
        const imgT = ty;
        const imgR = tx + meImg.offsetWidth;
        const imgB = ty + meImg.offsetHeight;

        /* Pre-check horizontal overlap — same for every line */
        const overH = imgL < contRight && imgR > contLeft;

        flowContainer.innerHTML = "";

        function renderPara(prepared, startY) {
            let cursor = { segmentIndex: 0, graphemeIndex: 0 };
            let y = startY;

            while (true) {
                /* Convert container-local y to section coords for overlap test */
                const lineT = contTop + y;
                const lineB = lineT + LINE_HEIGHT;
                const overV = lineT < imgB && lineB > imgT;

                let lineX = 0, lineW = contW;

                if (overH && overV) {
                    /* Image position relative to this container's left edge */
                    const iL = imgL - contLeft;
                    const iR = imgR - contLeft;

                    if ((iL + iR) / 2 > contW / 2) {
                        /* Image on the right half → shrink line, text flows left */
                        lineW = Math.max(50, iL - 10);
                    } else {
                        /* Image on the left half → offset line, text flows right */
                        lineX = Math.max(0, iR + 10);
                        lineW = Math.max(50, contW - lineX);
                    }
                }

                const range = layoutNextLineRange(prepared, cursor, lineW);
                if (range === null) break;

                const { text } = materializeLineRange(prepared, range);

                const span       = document.createElement("span");
                span.className   = "abt-flow-line";
                span.style.left  = `${lineX}px`;
                span.style.top   = `${y}px`;
                span.textContent = text;
                flowContainer.appendChild(span);

                cursor = range.end;
                y += LINE_HEIGHT;
            }
            return y;
        }

        let y = renderPara(preparedPara1, 0);
        y += PARA_GAP;
        y = renderPara(preparedPara2, y);
        flowContainer.style.height = `${y}px`;
    }

    function scheduleReflow() {
        if (reflowPending) return;
        reflowPending = true;
        requestAnimationFrame(() => { reflowPending = false; reflowText(); });
    }

    window.addEventListener("resize", () => { updateContainerGeometry(); scheduleReflow(); });


    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       DRAGGABLE IMAGE
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    let tx = 0, ty = 0;

    function initDragPos() {
        const ar = aboutSection.getBoundingClientRect();
        const wr = meAnchor.getBoundingClientRect();
        tx = wr.left - ar.left;
        ty = wr.top  - ar.top + aboutSection.scrollTop;
        meImg.style.transform = `translate(${tx}px, ${ty}px)`;
        updateContainerGeometry();
        reflowText();
    }

    setTimeout(initDragPos, 600);
    window.addEventListener("resize", initDragPos);

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
        scheduleReflow();   /* throttled to one reflow per animation frame */
    }

    function onDragEnd() {
        dragActive = false;
        meImg.classList.remove("dragging");
        reflowText();
    }

    meImg.addEventListener("mousedown",    (e) => { e.preventDefault(); onDragStart(e.clientX, e.clientY); });
    document.addEventListener("mousemove", (e) => onDragMove(e.clientX, e.clientY));
    document.addEventListener("mouseup",   onDragEnd);

    meImg.addEventListener("touchstart",   (e) => onDragStart(e.touches[0].clientX, e.touches[0].clientY));
    document.addEventListener("touchmove", (e) => onDragMove(e.touches[0].clientX, e.touches[0].clientY));
    document.addEventListener("touchend",  onDragEnd);


    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       CUSTOM CURSOR
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

    const cursor = document.createElement("div");
    cursor.style.cssText = "position:fixed;width:100px;height:2rem;pointer-events:none;z-index:9999;opacity:0;transform:translate(-50%,-50%);transition:opacity 0.2s ease;";
    cursor.innerHTML = `<img src="/assets/cursor.cur" style="width:100%;height:2rem;border-radius:16px;">`;
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;

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

document.querySelectorAll(".dropdownMenu a[href^='#']").forEach((link) => {
    link.addEventListener("click", (e) => {
        const id     = link.getAttribute("href").slice(1);
        const target = document.getElementById(id);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); }
        closeMenu();
    });
});

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

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent   = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
    if (scrollFill) scrollFill.style.width  = `${percent}%`;
    if (scrollText) scrollText.textContent  = `${percent}%`;
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
                card.style.opacity = "0";
                card.style.zIndex  = "0";
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
   5.5 WORK HEADER REVEAL ANIMATION
   ================================================================ */

(function initWorkHeaderReveal() {
  const workHeaderMask = document.querySelector('.work-header-mask');
  if (!workHeaderMask) return;

  const revealElements = workHeaderMask.querySelectorAll('.reveal');
  
  // Create an Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add 'revealed' class when the header comes into view
        revealElements.forEach(el => {
          el.classList.add('revealed');
        });
        
        // Stop observing after animation triggers
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2, // Trigger when 20% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Slight offset for better timing
  });

  // Start observing the header mask
  observer.observe(workHeaderMask);
  
  // Reset classes on page load (in case of hot reload)
  revealElements.forEach(el => {
    el.classList.remove('revealed');
  });
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


document.getElementById("contactBtn").addEventListener("click", () => {
    document.getElementById("touch").scrollIntoView({
        behavior: "smooth"
    });
});


