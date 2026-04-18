/**
 * remove-bg.cjs
 * 
 * Remove fundo preto de imagens PNG e cria transparência REAL (canal alpha).
 * 
 * Algoritmo:
 * 1. Para cada pixel, calcula o brilho (luminance)
 * 2. Pixels com brilho abaixo do threshold → alpha = 0 (transparente)
 * 3. Pixels na zona de transição → alpha graduado (anti-aliasing suave)
 * 4. Pixels claros → alpha = 255 (totalmente opacos)
 */

const Jimp = require('jimp');
const path = require('path');

const MASCOT_DIR = path.join(__dirname, 'src', 'assets', 'mascot');

// Arquivos de origem (fundo preto puro)
const SOURCE_DIR = path.resolve(
  process.env.USERPROFILE || process.env.HOME,
  '.gemini', 'antigravity', 'brain',
  '1a76de3a-0956-47cb-ad91-68c3d1a562b2'
);

const FILES = [
  { src: 'nex_char_neutral_1776389220827.png',  out: 'nex-neutral.png'  },
  { src: 'nex_char_thinking_1776389235982.png', out: 'nex-thinking.png' },
  { src: 'nex_char_result_1776389249782.png',   out: 'nex-result.png'   },
];

// Threshold de brilho: pixels abaixo disso → transparente
const BLACK_THRESHOLD = 45;    // 0-255: abaixo = escuro = remove
const FADE_RANGE      = 35;    // zona de transição suave (anti-alias)

async function removeBackground(inputPath, outputPath) {
  console.log(`Processando: ${path.basename(inputPath)}`);

  const image = await Jimp.read(inputPath);
  const { width, height } = image.bitmap;

  let removed = 0;
  let faded   = 0;
  let kept    = 0;

  image.scan(0, 0, width, height, function (x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];

    // Luminance (percepção humana)
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    if (lum < BLACK_THRESHOLD) {
      // Pixel escuro demais → totalmente transparente
      this.bitmap.data[idx + 3] = 0;
      removed++;
    } else if (lum < BLACK_THRESHOLD + FADE_RANGE) {
      // Zona de transição → alpha graduado (anti-aliasing)
      const ratio = (lum - BLACK_THRESHOLD) / FADE_RANGE;
      this.bitmap.data[idx + 3] = Math.round(ratio * 255);
      faded++;
    } else {
      // Pixel claro → totalmente opaco
      this.bitmap.data[idx + 3] = 255;
      kept++;
    }
  });

  await image.writeAsync(outputPath);

  const total = width * height;
  console.log(`  ✓ ${path.basename(outputPath)}`);
  console.log(`    ${width}x${height} (${total} pixels)`);
  console.log(`    Removidos: ${removed} (${(removed/total*100).toFixed(1)}%)`);
  console.log(`    Transição: ${faded}`);
  console.log(`    Mantidos:  ${kept} (${(kept/total*100).toFixed(1)}%)`);
  console.log();
}

async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║  VYNEX — Nex Background Removal             ║');
  console.log('║  Convertendo fundo preto → alpha real        ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log();

  for (const file of FILES) {
    const srcPath = path.join(SOURCE_DIR, file.src);
    const outPath = path.join(MASCOT_DIR, file.out);

    try {
      await removeBackground(srcPath, outPath);
    } catch (err) {
      console.error(`  ✗ Erro em ${file.src}: ${err.message}`);
    }
  }

  // Copiar neutral como guiding e idle (mesmo personagem, poses similares)
  try {
    const neutral = await Jimp.read(path.join(MASCOT_DIR, 'nex-neutral.png'));
    await neutral.writeAsync(path.join(MASCOT_DIR, 'nex-guiding.png'));
    await neutral.writeAsync(path.join(MASCOT_DIR, 'nex-idle.png'));
    console.log('  ✓ nex-guiding.png (cópia de neutral)');
    console.log('  ✓ nex-idle.png    (cópia de neutral)');
  } catch (err) {
    console.error(`  ✗ Erro ao copiar: ${err.message}`);
  }

  console.log();
  console.log('Concluído! Todos os assets agora possuem canal alpha real.');
}

main().catch(console.error);
