/*
  Gera bitmap de máscara (1 dentro, 0 fora) a partir de paths SVG.
  Mensagens:
  - IN:  { type: 'mask-generate', requestId, paths: string[], logicalGridCols, viewWidth, viewHeight }
  - OUT: { type: 'mask-result', requestId, bitmap:ArrayBuffer, rowCounts:ArrayBuffer, cols:number, rows:number, insideCount:number } | { type:'mask-result', requestId, error:string }
*/

self.onmessage = function (event) {
  const data = event.data || {};
  if (data.type !== 'mask-generate') return;

  const { requestId, paths, logicalGridCols, viewWidth, viewHeight } = data;

  try {
    if (typeof OffscreenCanvas === 'undefined') {
      throw new Error('OffscreenCanvas não suportado neste ambiente');
    }
    if (typeof Path2D === 'undefined') {
      throw new Error('Path2D não suportado no worker');
    }

    const cols = Number(logicalGridCols) || 640;
    const cellSize = viewWidth / cols;
    const rows = Math.ceil(viewHeight / cellSize);

    const canvas = new OffscreenCanvas(cols, rows);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Contexto 2D indisponível no OffscreenCanvas');
    }

    // Escalar de viewBox -> grelha (cols x rows)
    ctx.save();
    ctx.scale(cols / viewWidth, rows / viewHeight);
    ctx.fillStyle = '#000';
    for (const d of paths) {
      try {
        const p = new Path2D(d);
        ctx.fill(p);
      } catch (_) {
        // ignora path malformado
      }
    }
    ctx.restore();

    const imageData = ctx.getImageData(0, 0, cols, rows);
    const src = imageData.data;
    const bitmap = new Uint8Array(cols * rows);
    const rowCounts = new Uint32Array(rows);
    let insideCount = 0;
    for (let y = 0; y < rows; y++) {
      let rowInside = 0;
      const rowOffset = y * cols;
      for (let x = 0; x < cols; x++) {
        const i = (rowOffset + x) * 4;
        if (src[i + 3] > 0) {
          bitmap[rowOffset + x] = 1;
          rowInside++;
        }
      }
      rowCounts[y] = rowInside;
      insideCount += rowInside;
    }

    self.postMessage(
      { type: 'mask-result', requestId, bitmap: bitmap.buffer, rowCounts: rowCounts.buffer, cols, rows, insideCount },
      [bitmap.buffer, rowCounts.buffer]
    );
  } catch (err) {
    self.postMessage({ type: 'mask-result', requestId, error: String(err && err.message ? err.message : err) });
  }
};


