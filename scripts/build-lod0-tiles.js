/*
  Gera tiles LOD0 (raster) do mapa de Portugal a partir dos paths do PortugalMapSvg.
  Requisitos: npm i -D canvas

  Uso: node scripts/build-lod0-tiles.js [--tile 512] [--out public/tiles/lod0]
*/

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const DEFAULT_TILE_PX =
  parseInt(
    process.argv.includes('--tile') ? process.argv[process.argv.indexOf('--tile') + 1] : '512',
    10
  ) || 512;
const OUTPUT_DIR = process.argv.includes('--out')
  ? process.argv[process.argv.indexOf('--out') + 1]
  : 'public/tiles/lod0';

const SRC_FILE = path.join(process.cwd(), 'src', 'components', 'pixel-grid', 'PortugalMapSvg.tsx');

function extractViewBox(svgSource) {
  const m = svgSource.match(/viewBox="(\d+)\s+(\d+)\s+(\d+)\s+(\d+)"/);
  if (!m) throw new Error('viewBox não encontrado em PortugalMapSvg.tsx');
  const [, , , w, h] = m.map(Number);
  return { width: w, height: h };
}

function extractPaths(svgSource) {
  // Parse hierarchical transforms for groups and attach to paths
  const entries = [];
  const openTagRegex = /<\s*(g|path)([^>]*)>/gi;
  const closeGRegex = /<\s*\/\s*g\s*>/gi;
  const stack = [];
  const getAttr = (attrs, name) => {
    const m = new RegExp(name + '="([^"]*)"').exec(attrs);
    return m ? m[1] : undefined;
  };
  const parseTransform = t => {
    if (!t) return { tx: 0, ty: 0, sx: 1, sy: 1 };
    let tx = 0,
      ty = 0,
      sx = 1,
      sy = 1;
    const tr = /translate\(([-\d.]+)\s*,?\s*([\-\d.]+)?\)/.exec(t);
    if (tr) {
      tx += parseFloat(tr[1]);
      ty += parseFloat(tr[2] || '0');
    }
    const sc = /scale\(([-\d.]+)\s*,?\s*([\-\d.]+)?\)/.exec(t);
    if (sc) {
      const s1 = parseFloat(sc[1]);
      const s2 = sc[2] ? parseFloat(sc[2]) : s1;
      sx *= s1;
      sy *= s2;
    }
    return { tx, ty, sx, sy };
  };
  const compose = (a, b) => ({
    tx: a.tx + b.tx,
    ty: a.ty + b.ty,
    sx: a.sx * b.sx,
    sy: a.sy * b.sy,
  });

  while (true) {
    const mOpen = openTagRegex.exec(svgSource);
    const mClose = closeGRegex.exec(svgSource);
    if (!mOpen && !mClose) break;
    const nextIsOpen = mOpen && (!mClose || mOpen.index < mClose.index);
    if (nextIsOpen) {
      const tag = mOpen[1];
      const attrs = mOpen[2] || '';
      if (tag.toLowerCase() === 'g') {
        const t = parseTransform(getAttr(attrs, 'transform'));
        const top = stack[stack.length - 1] || { tx: 0, ty: 0, sx: 1, sy: 1 };
        stack.push(compose(top, t));
      } else if (tag.toLowerCase() === 'path') {
        const d = getAttr(attrs, 'd');
        if (d) {
          const top = stack[stack.length - 1] || { tx: 0, ty: 0, sx: 1, sy: 1 };
          entries.push({ d, transform: top });
        }
      }
    } else {
      if (stack.length > 0) stack.pop();
    }
  }
  if (entries.length === 0) throw new Error('Nenhum path encontrado');
  return entries;
}

async function main() {
  const src = fs.readFileSync(SRC_FILE, 'utf8');
  const { width: VBW, height: VBH } = extractViewBox(src);
  const entries = extractPaths(src);

  const tilePx = DEFAULT_TILE_PX;
  const cols = Math.max(1, Math.ceil(VBW / tilePx));
  const rows = Math.max(1, Math.ceil(VBH / tilePx));

  const outDir = path.join(process.cwd(), OUTPUT_DIR);
  fs.mkdirSync(outDir, { recursive: true });

  const manifest = [];
  const total = cols * rows;
  let done = 0;

  for (let ty = 0; ty < rows; ty++) {
    for (let tx = 0; tx < cols; tx++) {
      const canvas = createCanvas(tilePx, tilePx);
      const ctx = canvas.getContext('2d');

      // Escalar de viewBox -> tilePx, e transladar para recortar o tile
      const tileWvb = VBW / cols;
      const tileHvb = VBH / rows;
      const scaleX = tilePx / tileWvb;
      const scaleY = tilePx / tileHvb;
      ctx.scale(scaleX, scaleY);
      ctx.translate(-tx * tileWvb, -ty * tileHvb);

      // Fundo transparente, preencher paths a branco (aplicando transforms)
      ctx.fillStyle = '#ffffff';
      for (const e of entries) {
        try {
          ctx.save();
          const tf = e.transform || { tx: 0, ty: 0, sx: 1, sy: 1 };
          ctx.transform(tf.sx, 0, 0, tf.sy, tf.tx, tf.ty);
          const p = new (require('canvas').Path2D)(e.d);
          ctx.fill(p);
          ctx.restore();
        } catch {}
      }

      const filename = `${cols}x${rows}-${tilePx}x${tilePx}-${tx}-${ty}.png`;
      const filePath = path.join(outDir, filename);
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(filePath, buffer);
      manifest.push(filename);
      done++;
      if (done % 10 === 0) {
        process.stdout.write(`Tiles: ${done}/${total}\r`);
      }
    }
  }

  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\nGerado LOD0: ${manifest.length} tiles em ${OUTPUT_DIR}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
