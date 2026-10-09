# Mis 75 años · Alfredo — nueva dirección

**Estado:** master gráfico final congelado tras render y auditoría visual en navegador; candidato local implementado y en QA.

## Concepto elegido: una carta que se abre

La invitación toma la forma de una sola carta personal. El sobre no es un splash: es la primera capa física de la pieza; al abrirlo, deja aparecer la portada fotográfica. El recorrido pasa de una bienvenida cercana a la fecha, encuentra un silencio visual en una fotografía a sangre y termina con una imagen horizontal y la frase de cierre proporcionada.

## Sistema

- **Formato del master:** tira vertical de 390 px; los planos se continúan sin tarjetas repetidas.
- **Tipografía:** Georgia para titulares y frases; Arial para datos, controles y etiquetas.
- **Paleta:** marfil `#F2EEE3`, tinta verde carbón `#29352F`, vino `#80473F` y cobre `#B78D62`.
- **Recursos:** un pliegue diagonal en portada y cierre, una regla en el bloque de fecha y una sola esquina plegada en la carta de regalos. Sin ornamentos repetidos.
- **Fotografía:** solo Fotos 4, 2 y 8. La 4 presenta a Alfredo con micrófono y papel; la 2 ofrece una pausa casi de viewport completo; la 8 da un cierre apaisado. No se infiere cronología ni parentesco. No se recortan rostros ni se inventa un cutout. Las tres imágenes del master están incrustadas para que el arte funcione tanto en SVG directo como en `<img>`.

## Recorrido

1. **Portada:** Foto 4 a sangre. Una hoja de papel cruza su borde inferior y compone “Mis 75 años · Alfredo” sobre la imagen.
2. **Fecha:** bloque de tinta oscura con el 14 como ancla, mes y año asociados, hora clara y espacios previstos para countdown y calendario.
3. **Lugar:** nombre y dirección en papel limpio; una superficie neutra queda reservada a un iframe real de Google Maps en implementación. El master no dibuja calles.
4. **Pausa:** Foto 2 a sangre, sin marco y con una sola firma pequeña.
5. **Vestimenta:** composición tipográfica en dos ejes; conserva “Ven como te sientas bien”.
6. **Regalos:** el texto se lee como una carta abierta sobre el plano vino. El buzón se nombra, sin iconos genéricos.
7. **RSVP:** fecha límite, número y acción WhatsApp reunidos en un plano oscuro de alto contraste.
8. **Cierre:** Foto 8 en formato apaisado, parcialmente cubierta por el último pliegue con la frase exacta de cierre.

## Movimiento previsto para la implementación

- **Apertura principal:** la solapa levanta, el sello se desplaza y la portada asciende desde el sobre; el gesto inicia el MP3. La imagen se precarga y se decodifica antes de retirar el sobre para evitar una revelación en blanco.
- **Revelado secundario:** la hoja de portada cruza el borde de la Foto 4 y se detiene con un pequeño desfase, sin rebote.
- **Pausa fotográfica:** una máscara rectangular sencilla se abre de arriba abajo al entrar en viewport.
- **Cierre:** el pliegue final se retira una sola vez para revelar la Foto 8.
- **Microinteracciones:** respuesta sutil al pasar, enfocar y presionar calendario, Maps y WhatsApp; el control de audio cambia entre reproducción y pausa.
- **Reduced motion:** elimina desplazamientos de escena y conserva apertura instantánea y legible.

## Correcciones de auditoría

- El epígrafe de portada se dividió para respetar el margen derecho y se retiró una etiqueta de ubicación que chocaba con el 75.
- Se redujo el 14 y se desplazó su divisoria para que los dos elementos respiren; día, mes y año siguen leyéndose de inmediato.
- Se corrigió la herencia de color SVG que ocultaba texto claro sobre planos oscuros; countdown, calendario, teléfono y título de la canción ya tienen contraste visible.
- El panel de regalos cambió el borde dentado por una sola esquina plegada; se quitó la falsa apariencia de código de barras.
- Se retiró la línea que atravesaba el rótulo «Buzón en la entrada»; el cierre de la carta queda limpio.
- Se eliminaron guiones estáticos detrás del countdown dinámico para que los números no aparezcan tachados.
- Se quitó la fecha duplicada del encabezado para dejar espacio al control discreto de música. El control queda integrado al encabezado, sin flotar sobre los textos durante el recorrido.
- La segunda línea del RSVP se redujo para permanecer dentro del margen móvil.
- El sobre perdió la línea diagonal inferior que cruzaba el nombre y la fecha.
- El bloque de mapa es un plano neutro sin calles inventadas; la web lo reemplaza por un embed real de Google Maps.

## Copia

No se añadieron frases narrativas. Se emplean solo los datos y textos proporcionados, más etiquetas funcionales breves.
