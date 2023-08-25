import './scss/estilos.scss';
import '@melloware/coloris/dist/coloris.css';
import { coloris, init } from '@melloware/coloris';

type Variacion = {
  ruta: string;
  img: HTMLImageElement | null;
  dims: { ancho: number; alto: number };
};

inicio();

function inicio() {
  init();
  coloris({
    el: '#color',
    theme: 'polaroid',
    parent: '#opciones',
    onChange: pintar,
    swatches: [
      '#264653',
      '#2a9d8f',
      '#e9c46a',
      'rgb(244,162,97)',
      '#e76f51',
      '#d62828',
      'navy',
      '#07b',
      '#0096c7',
      '#00b4d880',
      'rgba(0,119,182,0.8)',
    ],
  });
  const lienzo = document.querySelector<HTMLCanvasElement>('#lienzo');
  if (!lienzo) return;
  const ctx = lienzo?.getContext('2d');
  const campoAncho = document.getElementById('ancho') as HTMLInputElement;
  const campoAlto = document.getElementById('alto') as HTMLInputElement;
  const campoEscala = document.getElementById('escala') as HTMLInputElement;
  const colorFondo = document.getElementById('fondo') as HTMLInputElement;
  const botonExportar = document.getElementById('exportar') as HTMLButtonElement;

  const variaciones: Variacion[] = new Array(53).fill(0).map((n, i) => {
    return {
      ruta: `/logos/variaciones/transparente/${String(i).padStart(4, '0')}.png`,
      img: null,
      dims: { ancho: 0, alto: 0 },
    };
  });

  let anchoImg = 0;
  let altoImg = 0;
  // Tamaño carta 300dpi
  campoAncho.value = '2250';
  campoAlto.value = '3300';

  const eventos = () => {
    botonExportar.onclick = () => {
      const url = lienzo.toDataURL();
      const elemento = document.createElement('a');
      elemento.href = url;
      elemento.download = 'fondo';
      elemento.click();
      elemento.remove();
    };

    campoAlto.onchange = pintar;
    campoAncho.onchange = pintar;
    campoEscala.onchange = pintar;
  };

  cargarImgs();
  eventos();

  function cargarImgs() {
    let cargadas = 0;

    variaciones.forEach((obj) => {
      const img = new Image();
      img.onload = () => {
        obj.img = img;
        obj.dims = {
          ancho: img.naturalWidth,
          alto: img.naturalHeight,
        };

        if (img.naturalWidth !== anchoImg) {
          console.log(`de ${anchoImg} a ${img.naturalWidth}`);
          anchoImg = img.naturalWidth;
        }

        if (img.naturalHeight !== altoImg) {
          console.log(`de ${altoImg} a ${img.naturalHeight}`);
          altoImg = img.naturalHeight;
        }

        cargadas++;

        if (cargadas === variaciones.length) {
          pintar();
        }
      };
      img.src = obj.ruta;
    });
  }

  function pintar() {
    if (!ctx || !lienzo) return;
    lienzo.width = +campoAncho.value;
    lienzo.height = +campoAlto.value;

    if (colorFondo.value) {
      ctx.fillStyle = colorFondo.value;
      ctx.fillRect(0, 0, lienzo.width, lienzo.height);
    }

    let y = 0;
    let contador = 0;
    let i = 0;
    let lleno = false;
    const escala = +campoEscala.value;
    const ancho = (anchoImg * escala) | 0;
    const alto = (altoImg * escala) | 0;

    while (!lleno) {
      const { img } = variaciones[i];
      if (!img) continue;

      let x = ancho * contador;

      if (x + ancho > lienzo.width) {
        y += alto;
        contador = 0;
        x = 0;

        if (y >= lienzo.height - alto) {
          lleno = true;
          // exportar();
          break;
        }
      }

      ctx.drawImage(img, x, y, ancho, alto);
      contador++;

      if (i + 1 < variaciones.length) {
        i++;
      } else {
        i = 0;
      }
    }
  }
}

console.log('..:: EnFlujo ::..');
