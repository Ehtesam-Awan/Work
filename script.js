(function () {
  "use strict";

  var TOTAL_POSTS = 40;
  var gallery = document.querySelector(".gallery");

  /* ----------------------------------------------------------
     Robust image loader — for each post, tries the numbered
     filename against a list of common extensions in order
     (jpg, jpeg, png, webp). The first one that loads successfully
     is kept; if none exist, the post stays visible with its
     neutral placeholder background instead of being hidden.
     ---------------------------------------------------------- */
  var IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

  function attachImageLoader(img, index) {
    var extIndex = 0;

    function tryNextExtension() {
      if (extIndex >= IMAGE_EXTENSIONS.length) {
        // No matching file found for this index — keep the tile
        // visible with its neutral placeholder background.
        img.removeEventListener("error", onError);
        img.style.display = "none";
        var parentPost = img.closest(".post");
        if (parentPost) parentPost.classList.add("is-placeholder");
        return;
      }
      img.src = index + "." + IMAGE_EXTENSIONS[extIndex];
      extIndex++;
    }

    function onError() {
      tryNextExtension();
    }

    img.addEventListener("error", onError);
    img.addEventListener("load", function () {
      this.classList.add("loaded");
    });

    tryNextExtension();
  }

  /* ----------------------------------------------------------
     Every post uses the same fixed-aspect-ratio tile (sizing is
     handled entirely in CSS via .post), so the gallery is simply
     generated as a loop from 1 through TOTAL_POSTS.
     ---------------------------------------------------------- */
  function buildGallery() {
    var frag = document.createDocumentFragment();

    for (var i = 1; i <= TOTAL_POSTS; i++) {
      var post = document.createElement("figure");
      post.className = "post";
      post.setAttribute("data-index", i);

      var frame = document.createElement("div");
      frame.className = "post-frame";

      var img = document.createElement("img");
      img.alt = "Design work " + i;
      img.loading = "lazy";
      img.decoding = "async";

      attachImageLoader(img, i);

      var caption = document.createElement("figcaption");
      caption.className = "post-index";
      caption.textContent = String(i).padStart(2, "0");

      frame.appendChild(img);
      frame.appendChild(caption);
      post.appendChild(frame);
      frag.appendChild(post);
    }

    gallery.appendChild(frag);
  }

  /* ----------------------------------------------------------
     Hover choreography — desktop / fine-pointer only.
     Adds .is-hovering to the gallery + .is-active to the
     current post; CSS handles the smooth scale/blur/dim.
     ---------------------------------------------------------- */
  function initHoverInteraction() {
    var isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFinePointer) return;

    var activePost = null;

    gallery.addEventListener(
      "pointerover",
      function (e) {
        var post = e.target.closest(".post");
        if (!post || post === activePost || post.classList.contains("is-hidden")) return;
        activePost = post;
        gallery.classList.add("is-hovering");
        var prev = gallery.querySelector(".post.is-active");
        if (prev) prev.classList.remove("is-active");
        post.classList.add("is-active");
      },
      true
    );

    gallery.addEventListener("pointerleave", function () {
      gallery.classList.remove("is-hovering");
      var prev = gallery.querySelector(".post.is-active");
      if (prev) prev.classList.remove("is-active");
      activePost = null;
    });
  }

  /* ----------------------------------------------------------
     Subtle cursor follower — desktop only, lightweight rAF loop.
     ---------------------------------------------------------- */
  function initCursor() {
    var isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var dot = document.getElementById("cursorDot");
    if (!isFinePointer || !dot) return;

    var targetX = 0, targetY = 0, curX = 0, curY = 0;
    var visible = false;

    window.addEventListener("mousemove", function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        dot.classList.add("is-visible");
        visible = true;
      }
    });

    document.addEventListener("mouseleave", function () {
      dot.classList.remove("is-visible");
      visible = false;
    });

    gallery.addEventListener("pointerover", function (e) {
      if (e.target.closest(".post")) dot.classList.add("is-expanded");
    });
    gallery.addEventListener("pointerleave", function () {
      dot.classList.remove("is-expanded");
    });

    function tick() {
      curX += (targetX - curX) * 0.18;
      curY += (targetY - curY) * 0.18;
      dot.style.transform = "translate3d(" + curX + "px," + curY + "px,0)";
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildGallery();
    initHoverInteraction();
    initCursor();
  });
})();
