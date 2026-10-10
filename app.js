(() => {
  "use strict";

  const root = document.documentElement;
  const opening = document.getElementById("opening");
  const openButton = document.getElementById("open-envelope");
  const openingHint = document.getElementById("opening-hint");
  const music = document.getElementById("event-music");
  const musicToggle = document.getElementById("music-toggle");
  const musicStatus = document.getElementById("music-status");
  const countdown = document.getElementById("countdown");
  const skipLink = document.querySelector(".skip-link");
  const openingCard = document.getElementById("opening-card");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const timezone = "America/Mexico_City";
  root.classList.add("js-locked");
  window.history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  function zonedDateTimeToUtc(year, month, day, hour, minute, second, zone) {
    const desiredAsUtc = Date.UTC(year, month - 1, day, hour, minute, second);
    let instant = desiredAsUtc;
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    });

    for (let index = 0; index < 4; index += 1) {
      const parts = Object.fromEntries(
        formatter.formatToParts(new Date(instant))
          .filter((part) => part.type !== "literal")
          .map((part) => [part.type, Number(part.value)])
      );
      const actualAsUtc = Date.UTC(
        parts.year,
        parts.month - 1,
        parts.day,
        parts.hour,
        parts.minute,
        parts.second
      );
      instant += desiredAsUtc - actualAsUtc;
    }

    return instant;
  }

  const eventTime = zonedDateTimeToUtc(2026, 11, 14, 18, 0, 0, timezone);
  let lastCountdownText = "";

  function updateCountdown() {
    const remainingSeconds = Math.max(0, Math.floor((eventTime - Date.now()) / 1000));
    const days = Math.floor(remainingSeconds / 86400);
    const hours = Math.floor((remainingSeconds % 86400) / 3600);
    const nextText = `FALTAN ${days} DÍAS · ${String(hours).padStart(2, "0")} H`;

    if (nextText !== lastCountdownText) {
      countdown.textContent = nextText;
      lastCountdownText = nextText;
    }
  }

  updateCountdown();
  window.setInterval(updateCountdown, 60000);

  function setMusicState(playing) {
    musicToggle.hidden = false;
    musicToggle.setAttribute("aria-pressed", String(playing));
    musicToggle.setAttribute("aria-label", playing ? "Pausar música" : "Reproducir música");
    musicStatus.textContent = playing ? "La música está reproduciéndose." : "La música está en pausa.";
  }

  function startMusicFromGesture() {
    music.loop = true;
    music.volume = 0.72;
    const playback = music.play();

    if (playback && typeof playback.then === "function") {
      playback.then(() => setMusicState(true)).catch(() => {
        musicStatus.textContent = "No se pudo iniciar la música. Usa el control de música para volver a intentarlo.";
        musicToggle.hidden = false;
        musicToggle.setAttribute("aria-label", "Reproducir música");
        musicToggle.setAttribute("aria-pressed", "false");
      });
    } else {
      setMusicState(true);
    }
  }

  music.addEventListener("play", () => setMusicState(true));
  music.addEventListener("pause", () => setMusicState(false));
  music.addEventListener("error", () => {
    musicStatus.textContent = "No se pudo cargar la música.";
  });

  musicToggle.addEventListener("click", () => {
    if (music.paused) {
      const playback = music.play();
      if (playback && typeof playback.catch === "function") {
        playback.catch(() => {
          musicStatus.textContent = "No se pudo reanudar la música.";
        });
      }
    } else {
      music.pause();
    }
  });

  const revealScenes = document.querySelectorAll(".scene--history, .scene--memories, .scene--closing");
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    revealScenes.forEach((scene) => scene.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const image = entry.target.querySelector("img");
          if (image && image.loading === "lazy") image.loading = "eager";
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      }
    }, { rootMargin: "120px 0px", threshold: 0.01 });

    revealScenes.forEach((scene) => observer.observe(scene));
  }

  let hasOpened = false;
  let skipAfterOpening = false;

  function focusAfterOpening() {
    opening.setAttribute("aria-hidden", "true");
    document.getElementById(skipAfterOpening ? "scene-02" : "scene-01")
      .focus({ preventScroll: true });
    if (skipAfterOpening) {
      document.getElementById("scene-02").scrollIntoView({ block: "start", behavior: "auto" });
    }
  }

  function openInvitation() {
    if (hasOpened) return;
    hasOpened = true;
    openButton.disabled = true;
    startMusicFromGesture();

    if (reducedMotion.matches) {
      root.classList.add("is-open", "opening-finished");
      root.classList.remove("js-locked");
      if (openingHint) openingHint.textContent = "";
      window.setTimeout(focusAfterOpening, 40);
      return;
    }

    root.classList.add("seal-released");
    window.setTimeout(() => root.classList.add("envelope-open"), 180);
    window.setTimeout(() => {
      root.classList.add("is-open", "card-emerging");
      if (openingHint) openingHint.textContent = "";
    }, 560);
    window.setTimeout(() => root.classList.add("card-expanded"), 920);
    window.setTimeout(() => {
      root.classList.add("opening-finished");
      root.classList.remove("js-locked");
    }, 1770);
    window.setTimeout(focusAfterOpening, 2320);
  }

  openButton.addEventListener("click", openInvitation);
  skipLink.addEventListener("click", (event) => {
    if (!hasOpened) {
      event.preventDefault();
      skipAfterOpening = true;
      openInvitation();
    }
  });

  openingCard.addEventListener("transitionend", (event) => {
    if (event.propertyName === "width" && root.classList.contains("card-expanded")) {
      openingCard.setAttribute("aria-hidden", "true");
    }
  });
})();
