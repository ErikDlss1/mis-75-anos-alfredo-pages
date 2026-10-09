(() => {
  'use strict';

  const opening = document.getElementById('opening');
  const invitation = document.getElementById('invitation');
  const openButton = document.getElementById('open-invitation');
  const masterImage = document.querySelector('.master-art');
  const song = document.getElementById('event-song');
  const musicToggle = document.getElementById('music-toggle');
  const musicLabel = document.getElementById('music-label');
  const audioStatus = document.getElementById('audio-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const timeZone = 'America/Mexico_City';
  const address = 'Glück Salón de Eventos, Ciprés 585, Mactumatza, 29057 Tuxtla Gutiérrez, Chiapas, México';
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const rsvpMessage = 'Hola, confirmo mi asistencia a los 75 años de Alfredo.';
  const whatsappUrl = `https://wa.me/529613070923?text=${encodeURIComponent(rsvpMessage)}`;
  let isOpen = false;

  const masterArtworkReady = typeof masterImage.decode === 'function'
    ? masterImage.decode().then(() => true, () => false)
    : new Promise((resolve) => {
      if (masterImage.complete) {
        resolve(masterImage.naturalWidth > 0);
        return;
      }
      masterImage.addEventListener('load', () => resolve(true), { once: true });
      masterImage.addEventListener('error', () => resolve(false), { once: true });
    });

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  document.getElementById('maps-link').href = mapUrl;
  document.getElementById('whatsapp-link').href = whatsappUrl;

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
      const observedAsUtc = Date.UTC(
        Number(parts.year), Number(parts.month) - 1, Number(parts.day),
        Number(parts.hour), Number(parts.minute), Number(parts.second)
      );
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
  const countdownWords = document.getElementById('countdown-words');
  const countdownLabel = document.getElementById('countdown-label');

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
    const words = `${days} ${dayWord}, ${hours} ${hourWord} y ${minutes} ${minuteWord}`;
    countdownWords.textContent = words;
    countdownLabel.textContent = `Faltan ${words} para la celebración.`;
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
    const lines = [
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
      `LOCATION:${escapeICal(address)}`,
      `DESCRIPTION:${escapeICal('Celebración de 75 años de Alfredo. Vestimenta: casual elegante.')}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ];

    const blob = new Blob([`${lines.join('\r\n')}\r\n`], { type: 'text/calendar;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = '75-anos-de-alfredo.ics';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  });

  function updateMusicControl(isPlaying) {
    musicToggle.classList.toggle('is-paused', !isPlaying);
    musicToggle.setAttribute('aria-pressed', String(isPlaying));
    const label = isPlaying ? 'Pausar música' : 'Reanudar música';
    musicToggle.setAttribute('aria-label', label);
    musicLabel.textContent = label;
  }

  async function startMusic() {
    song.volume = 0.32;
    song.loop = true;
    try {
      await song.play();
      audioStatus.hidden = true;
      updateMusicControl(true);
    } catch (error) {
      updateMusicControl(false);
      audioStatus.textContent = 'Toca el control de música para iniciar la canción.';
      audioStatus.hidden = false;
    }
  }

  musicToggle.addEventListener('click', async () => {
    if (song.paused) {
      try {
        await song.play();
        audioStatus.hidden = true;
        updateMusicControl(true);
      } catch (error) {
        audioStatus.textContent = 'No se pudo iniciar el audio. Vuelve a intentarlo.';
        audioStatus.hidden = false;
      }
    } else {
      song.pause();
      audioStatus.hidden = true;
      updateMusicControl(false);
    }
  });

  song.addEventListener('play', () => updateMusicControl(true));
  song.addEventListener('pause', () => updateMusicControl(false));

  function activateMotion() {
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
    document.body.classList.add('motion-ready');
    const reveals = document.querySelectorAll('.paper-reveal');
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-open');
        currentObserver.unobserve(entry.target);
        window.setTimeout(() => { entry.target.hidden = true; }, 900);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((reveal) => observer.observe(reveal));
  }

  function loadRealMap() {
    const map = document.getElementById('venue-map');
    if (!map.hasAttribute('src')) map.src = map.dataset.src;
  }

  openButton.addEventListener('click', async () => {
    if (isOpen) return;
    isOpen = true;
    window.scrollTo(0, 0);
    openButton.disabled = true;
    void startMusic();
    document.body.classList.remove('is-closed');
    document.body.classList.add('is-open');
    opening.classList.add('is-preparing');

    if (!(await masterArtworkReady)) {
      song.pause();
      song.currentTime = 0;
      updateMusicControl(false);
      isOpen = false;
      openButton.disabled = false;
      opening.classList.remove('is-preparing');
      document.body.classList.remove('is-open');
      document.body.classList.add('is-closed');
      audioStatus.textContent = 'No se pudo cargar la invitación. Intenta abrirla de nuevo.';
      audioStatus.hidden = false;
      return;
    }

    opening.classList.add('is-opening');

    const wait = reducedMotion.matches ? 40 : 1190;
    window.setTimeout(() => {
      opening.hidden = true;
      invitation.inert = false;
      invitation.setAttribute('aria-hidden', 'false');
      musicToggle.hidden = false;
      loadRealMap();
      activateMotion();
      window.scrollTo(0, 0);
      document.getElementById('event-title').focus({ preventScroll: true });
    }, wait);
  });
})();
