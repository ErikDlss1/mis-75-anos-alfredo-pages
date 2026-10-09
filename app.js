(() => {
  'use strict';

  const invitation = document.getElementById('invitation');
  const opening = document.getElementById('opening');
  const openButton = document.getElementById('open-invitation');
  const audio = document.getElementById('event-song');
  const musicToggle = document.getElementById('music-toggle');
  const musicLabel = document.getElementById('music-label');
  const audioStatus = document.getElementById('audio-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const timeZone = 'America/Mexico_City';
  const mapAddress = 'Glück Salón de Eventos, Ciprés 585, Mactumatza, 29057 Tuxtla Gutiérrez, Chiapas, México';
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapAddress)}`;
  const rsvpText = 'Hola, confirmo mi asistencia a los 75 años de Alfredo.';
  const whatsappUrl = `https://wa.me/529613070923?text=${encodeURIComponent(rsvpText)}`;
  let isOpen = false;

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  document.getElementById('maps-link').href = mapUrl;
  document.getElementById('whatsapp-link').href = whatsappUrl;

  function applyArtScale() {
    const width = Math.min(window.innerWidth, 430);
    const userUnit = width / 780;
    const scale = width / 390;
    invitation.style.width = `${width}px`;
    invitation.style.height = `${10150 * userUnit}px`;
    invitation.style.setProperty('--scale', scale);

    document.querySelectorAll('.at').forEach((node) => {
      node.style.left = `${Number(node.dataset.x) * userUnit}px`;
      node.style.top = `${Number(node.dataset.y) * userUnit}px`;
      node.style.fontSize = `${Number(node.dataset.size) * userUnit}px`;
      if (node.dataset.track) node.style.letterSpacing = `${Number(node.dataset.track) * userUnit}px`;
    });

    document.querySelectorAll('.hotspot, .map-view').forEach((node) => {
      node.style.left = `${Number(node.dataset.x) * userUnit}px`;
      node.style.top = `${Number(node.dataset.y) * userUnit}px`;
      node.style.width = `${Number(node.dataset.w) * userUnit}px`;
      node.style.height = `${Number(node.dataset.h) * userUnit}px`;
    });

    const peels = {
      portrait: { x: 0, y: 4320, w: 780, h: 1502 },
      attire: { x: 0, y: 5832, w: 340, h: 885 },
      music: { x: 404, y: 7705, w: 376, h: 1037 }
    };
    document.querySelectorAll('.paper-peel').forEach((node) => {
      const p = peels[node.dataset.peel];
      node.style.left = `${p.x * userUnit}px`;
      node.style.top = `${p.y * userUnit}px`;
      node.style.width = `${p.w * userUnit}px`;
      node.style.height = `${p.h * userUnit}px`;
    });
  }

  applyArtScale();
  window.addEventListener('resize', applyArtScale, { passive: true });
  const resizeObserver = new ResizeObserver(applyArtScale);
  resizeObserver.observe(invitation);

  function localDateInZone(year, month, day, hour, minute, zone) {
    const localAsUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
    let candidate = localAsUtc;
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
    });
    for (let i = 0; i < 4; i += 1) {
      const parts = Object.fromEntries(formatter.formatToParts(new Date(candidate)).map((part) => [part.type, part.value]));
      const observedAsUtc = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute), Number(parts.second));
      const correction = localAsUtc - observedAsUtc;
      candidate += correction;
      if (correction === 0) break;
    }
    return new Date(candidate);
  }

  const eventDate = localDateInZone(2026, 11, 14, 18, 0, timeZone);
  const dayOutput = document.getElementById('days');
  const hourOutput = document.getElementById('hours');
  const minuteOutput = document.getElementById('minutes');
  const wordsOutput = document.getElementById('countdown-words');

  function updateCountdown() {
    const remaining = Math.max(0, eventDate.getTime() - Date.now());
    const totalMinutes = Math.floor(remaining / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    dayOutput.textContent = String(days);
    hourOutput.textContent = String(hours).padStart(2, '0');
    minuteOutput.textContent = String(minutes).padStart(2, '0');
    const dayWord = days === 1 ? 'día' : 'días';
    const hourWord = hours === 1 ? 'hora' : 'horas';
    const minuteWord = minutes === 1 ? 'minuto' : 'minutos';
    wordsOutput.textContent = `${days} ${dayWord}, ${hours} ${hourWord} y ${minutes} ${minuteWord}`;
  }

  updateCountdown();
  window.setInterval(updateCountdown, 60000);

  function toICalUtc(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  function escapeICal(value) {
    return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  }

  document.getElementById('calendar-button').addEventListener('click', () => {
    const now = new Date();
    const eventLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Alfredo 75//Invitacion//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:75 años de Alfredo',
      'BEGIN:VEVENT',
      'UID:alfredo75-20261114@invitacion.local',
      `DTSTAMP:${toICalUtc(now)}`,
      `DTSTART:${toICalUtc(eventDate)}`,
      'SUMMARY:75 años de Alfredo',
      `LOCATION:${escapeICal(mapAddress)}`,
      `DESCRIPTION:${escapeICal('Celebración de 75 años de Alfredo. Vestimenta: casual elegante.')}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ];
    const blob = new Blob([`${eventLines.join('\r\n')}\r\n`], { type: 'text/calendar;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = '75-anos-de-alfredo.ics';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  });

  function updateAudioControl(isPlaying) {
    musicToggle.classList.toggle('is-paused', !isPlaying);
    musicToggle.setAttribute('aria-pressed', String(isPlaying));
    const label = isPlaying ? 'Pausar música' : 'Reanudar música';
    musicToggle.setAttribute('aria-label', label);
    musicLabel.textContent = label;
  }

  async function startMusic() {
    audio.volume = 0.32;
    audio.loop = true;
    try {
      await audio.play();
      audioStatus.hidden = true;
      updateAudioControl(true);
    } catch (error) {
      updateAudioControl(false);
      audioStatus.textContent = 'Toca el control de música para iniciar la canción.';
      audioStatus.hidden = false;
    }
  }

  musicToggle.addEventListener('click', async () => {
    if (audio.paused) {
      try {
        await audio.play();
        audioStatus.hidden = true;
        updateAudioControl(true);
      } catch (error) {
        audioStatus.textContent = 'No se pudo iniciar el audio. Vuelve a intentarlo.';
        audioStatus.hidden = false;
      }
    } else {
      audio.pause();
      audioStatus.hidden = true;
      updateAudioControl(false);
    }
  });

  audio.addEventListener('play', () => updateAudioControl(true));
  audio.addEventListener('pause', () => updateAudioControl(false));

  function activatePhotoMotion() {
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
    document.body.classList.add('motion-ready');
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-open');
        currentObserver.unobserve(entry.target);
        window.setTimeout(() => { entry.target.hidden = true; }, 850);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.paper-peel').forEach((peel) => observer.observe(peel));
  }

  function loadRealMap() {
    const mapFrame = document.querySelector('#map-view iframe');
    if (!mapFrame.hasAttribute('src')) mapFrame.src = mapFrame.dataset.src;
  }

  openButton.addEventListener('click', () => {
    if (isOpen) return;
    isOpen = true;
    window.scrollTo(0, 0);
    openButton.disabled = true;
    void startMusic();
    opening.classList.add('is-opening');
    document.body.classList.add('is-open');

    const wait = reducedMotion.matches ? 40 : 1370;
    window.setTimeout(() => {
      opening.hidden = true;
      invitation.inert = false;
      invitation.setAttribute('aria-hidden', 'false');
      musicToggle.hidden = false;
      loadRealMap();
      activatePhotoMotion();
      window.scrollTo(0, 0);
      document.getElementById('event-title').focus({ preventScroll: true });
    }, wait);
  });
})();
