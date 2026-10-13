import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';

const inputPath = new URL('../css/tailwind.input.css', import.meta.url);
const outputPath = new URL('../css/tailwind.css', import.meta.url);
const input = await readFile(inputPath, 'utf8');
const result = await postcss([tailwindcss()]).process(input, {
  from: fileURLToPath(inputPath),
  to: fileURLToPath(outputPath),
  map: false,
});

await writeFile(outputPath, result.css);
console.log(`Compiled Tailwind CSS to ${fileURLToPath(outputPath)}`);
