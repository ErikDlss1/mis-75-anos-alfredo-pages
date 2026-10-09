# QA final — Mis 75 años · Alfredo

Fecha de revisión: 9 de octubre de 2026.

## Dirección gráfica y master

- Master vertical continuo de 390 × 6840, en azul marino, marfil y ocre envejecido.
- Sistema tipográfico: Georgia (serif editorial) + Arial (sans de apoyo).
- Se seleccionaron cinco fotografías adjuntas: foto 4 para presentar, foto 2 para ubicar, foto 5 como pausa de retrato, foto 7 como impresión que cruza vestimenta y regalos, y foto 8 para cerrar. Las fotos 1, 3 y 6 quedaron fuera para evitar redundancia y ruido.
- No se regeneró ni recortó la identidad de Alfredo. No se usaron cutouts.
- Master congelado: `master-azul.svg`; apertura: `sobre-cerrado.svg`; composición de revisión: `master-completo.svg`.

## Auditoría visual responsive

Se abrió la invitación en navegador y se revisaron las composiciones en 375, 390 y 430 px, en ese orden. Se comprobó portada, fecha y contador, transición de lugar, fotografía, RSVP y cierre.

- 375 px: los textos y el CTA quedan dentro de la pieza; la fotografía de ubicación y el print de vestimenta mantienen margen; mapa cargado con la etiqueta real de Glück Salón de Eventos.
- 390 px: portada a sangre legible, fecha clara, contador sin duplicación y composición de lugar alineada.
- 430 px: la escala del contador y los tres campos conserva separación; ubicación y fotografía siguen dentro de sus planos.
- El cierre retoma el sello ocre y el pliegue del sobre para rematar el recorrido.

## Correcciones aplicadas durante QA

1. La ventana reservada al mapa dejó de ser un rectángulo vacío: se carga un mapa real de Google con la dirección proporcionada.
2. La impresión de la foto 7 cruza el cambio de plano entre vestimenta y regalos para enlazar ambos momentos.
3. Se retiró una línea de cierre no proporcionada por el usuario.
4. En la versión ejecutable, los números de muestra del master se ocultan antes de superponer el contador vivo. El master gráfico permanece intacto. Esto corrigió la colisión visible de minutos.

## QA funcional

- Apertura: el gesto abre el sobre y revela la portada; el mismo gesto inicia la pista adjunta.
- Audio: MP3 adjunto; loop activado; pausa y reanudación verificadas con el control.
- Countdown: usa la hora civil del 14 de noviembre de 2026 a las 18:00 en `America/Mexico_City`; actualización cada 30 segundos.
- Calendario: archivo `.ics` con inicio correcto convertido a UTC y sin `DTEND` ni hora final.
- Mapa: el iframe cargó Google Maps y el marcador del recinto. El botón Maps abre la búsqueda de navegación de la dirección dada.
- WhatsApp: URL revisada con el número `529613070923` y el mensaje acordado; no se envió ningún mensaje.
- Accesibilidad: controles con nombre accesible, regiones informativas ocultas para lectores de pantalla, foco visible y reglas `prefers-reduced-motion` para CSS y movimiento SVG.
- Sintaxis JavaScript y XML de los tres SVG principales validada. No se detectaron desbordamientos horizontales en los tres anchos revisados.

## Alcance de la prueba

La preferencia de movimiento reducido se revisó en la implementación, pero no se forzó una preferencia del sistema operativo en esta sesión. El CTA de Maps y el enlace de WhatsApp se verificaron por destino; no se envió un mensaje de prueba. La revisión de consola del navegador no estuvo disponible en la interfaz de QA utilizada.
