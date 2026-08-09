(function () {
  "use strict";

  /* ==========================================================
     GALLERY
     Images are already directly inside HTML.
     JavaScript does NOT create images, does NOT guess
     extensions, and does NOT load the gallery dynamically.
     ========================================================== */

  const gallery = document.querySelector(".gallery");

  /* ==========================================================
     IMAGE REVEAL
     Purely cosmetic bookkeeping — adds a "loaded" class once
     each image has actually loaded (or errored), for anyone
     who wants to hook into it later. Visibility of the image
     itself is NEVER dependent on this: the CSS already shows
     images at opacity: 1 by default, with or without this class.
     ========================================================== */

  function initImageReveal() {
    if (!gallery) return;

    const images = gallery.querySelectorAll(".post img");

    images.forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add("loaded");
      } else {
        img.addEventListener("load", () => {
          img.classList.add("loaded");
        });

        img.addEventListener("error", () => {
          console.warn("Image failed to load:", img.src);
        });
      }
    });
  }

  /* ==========================================================
     HOVER EFFECT
     ========================================================== */

  function initHoverInteraction() {
    if (!gallery) return;

    const isFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    if (!isFinePointer) return;

    let activePost = null;

    gallery.addEventListener(
      "pointerover",
      (e) => {
        const post = e.target.closest(".post");

        if (
          !post ||
          post === activePost ||
          post.classList.contains("is-hidden")
        ) {
          return;
        }

        activePost = post;

        gallery.classList.add("is-hovering");

        const previous = gallery.querySelector(".post.is-active");

        if (previous) {
          previous.classList.remove("is-active");
        }

        post.classList.add("is-active");
      },
      true
    );

    gallery.addEventListener("pointerleave", () => {
      gallery.classList.remove("is-hovering");

      const previous = gallery.querySelector(".post.is-active");

      if (previous) {
        previous.classList.remove("is-active");
      }

      activePost = null;
    });
  }

  /* ==========================================================
     CUSTOM CURSOR
     ========================================================== */

  function initCursor() {
    const isFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    const dot = document.getElementById("cursorDot");

    if (!isFinePointer || !dot || !gallery) return;

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    let visible = false;

    window.addEventListener("mousemove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!visible) {
        dot.classList.add("is-visible");
        visible = true;
      }
    });

    document.addEventListener("mouseleave", () => {
      dot.classList.remove("is-visible");
      visible = false;
    });

    gallery.addEventListener("pointerover", (e) => {
      if (e.target.closest(".post")) {
        dot.classList.add("is-expanded");
      }
    });

    gallery.addEventListener("pointerleave", () => {
      dot.classList.remove("is-expanded");
    });

    function animateCursor() {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;

      dot.style.transform =
        "translate3d(" +
        currentX +
        "px, " +
        currentY +
        "px, 0)";

      requestAnimationFrame(animateCursor);
    }

    requestAnimationFrame(animateCursor);
  }

  /* ==========================================================
     START
     ========================================================== */

  document.addEventListener("DOMContentLoaded", () => {
    initImageReveal();
    initHoverInteraction();
    initCursor();
  });

})();
