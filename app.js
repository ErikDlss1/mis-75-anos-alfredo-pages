(() => {
  const event = {
    title: '75 años de Alfredo',
    timeZone: 'America/Mexico_City',
    local: { year: 2026, month: 11, day: 14, hour: 18, minute: 0, second: 0 },
    address: 'Glück Salón de Eventos, Ciprés 585, Mactumatza, 29057 Tuxtla Gutiérrez, Chiapas, México',
    phone: '529613070923',
    confirmation: 'Hola, confirmo mi asistencia a los 75 años de Alfredo.',
  };

  const opening = document.getElementById('opening');
  const openButton = document.getElementById('openInvitation');
  const envelopeArt = document.getElementById('envelopeArt');
  const invitation = document.getElementById('invitation');
  const masterArt = document.getElementById('masterArt');
  const mapFrame = document.getElementById('mapFrame');
  const music = document.getElementById('eventMusic');
  const musicButton = document.getElementById('musicAction');
  const calendarAction = document.getElementById('calendarAction');
  const calendarStatus = document.getElementById('calendarStatus');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const zonedWallTime = (wallTime, timeZone) => {
    const { year, month, day, hour, minute, second } = wallTime;
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
    });
    const desiredAsUtc = Date.UTC(year, month - 1, day, hour, minute, second);
    let instant = desiredAsUtc;
    for (let pass = 0; pass < 3; pass += 1) {
      const parts = Object.fromEntries(formatter.formatToParts(new Date(instant)).map(({ type, value }) => [type, value]));
      const formattedAsUtc = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute), Number(parts.second));
      const correction = desiredAsUtc - formattedAsUtc;
      if (correction === 0) break;
      instant += correction;
    }
    return new Date(instant);
  };

  const eventInstant = zonedWallTime(event.local, event.timeZone);
  const pad = (number) => String(number).padStart(2, '0');

  const updateCountdown = () => {
    const remaining = Math.max(0, eventInstant.getTime() - Date.now());
    const totalMinutes = Math.floor(remaining / 60_000);
    const days = Math.floor(totalMinutes / 1_440);
    const hours = Math.floor((totalMinutes % 1_440) / 60);
    const minutes = totalMinutes % 60;
    document.querySelector('[data-count="days"]').textContent = String(days);
    document.querySelector('[data-count="hours"]').textContent = pad(hours);
    document.querySelector('[data-count="minutes"]').textContent = pad(minutes);
    document.getElementById('countdown').setAttribute('aria-label', `Faltan ${days} días, ${hours} horas y ${minutes} minutos`);
  };

  let mapLoaded = false;
  const loadMap = () => {
    if (mapLoaded) return;
    mapLoaded = true;
    const mapQuery = encodeURIComponent(event.address);
    mapFrame.src = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  };

  const setMusicState = (playing) => {
    musicButton.setAttribute('aria-pressed', String(playing));
    musicButton.setAttribute('aria-label', `${playing ? 'Pausar' : 'Reanudar'} música: Mi Viejo`);
  };
  music.volume = 0.32;
  music.loop = true;
  music.addEventListener('play', () => setMusicState(true));
  music.addEventListener('pause', () => setMusicState(false));
  music.addEventListener('error', () => setMusicState(false));

  const startArtworkMotion = () => {
    if (masterArt.dataset.motionReady === 'true') return;
    const svgDoc = masterArt.contentDocument;
    if (!svgDoc) return;
    masterArt.dataset.motionReady = 'true';

    for (const id of ['countdown-static-days', 'countdown-static-hours', 'countdown-static-minutes']) {
      const staticNumber = svgDoc.getElementById(id);
      if (staticNumber) staticNumber.style.visibility = 'hidden';
    }
    if (reducedMotion.matches) return;

    const targets = {
      'photo-place': { start: 'translateY(14px) rotate(2deg)', opacity: '0.72', duration: '760ms' },
      'pause-photo': { start: 'translateY(18px) scale(.985)', opacity: '0.86', duration: '920ms' },
      'gift-letter': { start: 'translateY(16px)', opacity: '0.9', duration: '760ms' },
      'closing-paper': { start: 'translateY(28px)', opacity: '1', duration: '900ms' },
    };
    for (const [id, motion] of Object.entries(targets)) {
      const target = svgDoc.getElementById(id);
      if (!target) continue;
      target.style.transformBox = 'fill-box';
      target.style.transformOrigin = 'center';
      target.style.transition = `transform ${motion.duration} cubic-bezier(.2,.72,.24,1), opacity ${motion.duration} ease`;
      target.style.transform = motion.start;
      target.style.opacity = motion.opacity;
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const id = entry.target.dataset.motion;
        const target = svgDoc.getElementById(id);
        if (target) {
          target.style.transform = id === 'photo-place' ? 'translateY(0) rotate(2deg)' : 'translateY(0) scale(1)';
          target.style.opacity = '1';
        }
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.01, rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.motion-trigger').forEach((trigger) => observer.observe(trigger));
  };

  masterArt.addEventListener('load', () => {
    if (!invitation.hidden) startArtworkMotion();
  });

  let hasOpened = false;
  const openInvitation = () => {
    if (hasOpened) return;
    hasOpened = true;
    openButton.disabled = true;

    const envelopeSvg = envelopeArt.contentDocument?.documentElement;
    if (envelopeSvg) envelopeSvg.classList.add('is-opening');

    music.currentTime = 0;
    music.play().catch(() => setMusicState(false));
    opening.classList.add('is-opening');

    const waitForCard = reducedMotion.matches ? 30 : 930;
    const closeOpening = reducedMotion.matches ? 180 : 1810;
    window.setTimeout(() => {
      invitation.hidden = false;
      document.body.classList.remove('locked');
      updateCountdown();
      loadMap();
      if (masterArt.contentDocument) startArtworkMotion();
    }, waitForCard);
    window.setTimeout(() => {
      opening.hidden = true;
      invitation.focus({ preventScroll: true });
    }, closeOpening);
  };
  openButton.addEventListener('click', openInvitation);

  musicButton.addEventListener('click', () => {
    if (music.paused) music.play().catch(() => setMusicState(false));
    else music.pause();
  });

  calendarAction.addEventListener('click', () => {
    calendarAction.classList.add('is-complete');
    calendarStatus.textContent = 'Evento preparado para agregar al calendario; no se asignó una hora de finalización.';
    window.setTimeout(() => calendarAction.classList.remove('is-complete'), 650);
  });

  updateCountdown();
  window.setInterval(updateCountdown, 30_000);
})();
