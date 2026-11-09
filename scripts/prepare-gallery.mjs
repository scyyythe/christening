// Builds the gallery photos from the originals in images/ into
// src/assets/toby/*.webp (900px wide).
// Run with: node scripts/prepare-gallery.mjs
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const photoOut = path.join(root, "src/assets/toby");

const photos = [
  ["5a58decc-de8d-48e4-9c76-409620e7e3c4.jpg", "toby-01-hospital-hat"],
  ["afa18a1a-ba30-4a26-bab5-158792339679.jpg", "toby-02-hospital-peek"],
  ["e5f58b67-696c-4c70-83be-a5426e1fce19.jpg", "toby-03-hospital-bed"],
  ["889474b9-1d8f-4bac-bafa-99de2c4d0a0f.jpg", "toby-04-home-newborn"],
  ["2cd79061-02a1-4931-9a0c-acc8443e43ee.jpg", "toby-05-nap-leaves"],
  ["1f47eb0f-34f9-418f-8386-9634cbbc39c3.jpg", "toby-06-nap-hands"],
  ["2b9d67fc-e73c-4a1a-8780-627fc5e4030e.jpg", "toby-07-socks"],
  ["beb17034-e2f9-4dbe-b888-d0f4b1557290.jpg", "toby-08-big-eyes"],
  ["2d4f9b3f-550c-47ac-9e69-d660150cb460.jpg", "toby-09-smile"],
  ["54cfeaba-5892-444b-8ccd-9e96037c8e58.jpg", "toby-10-chubby"],
  ["toby-11-bib-smile.jpg", "toby-11-bib-smile"],
  ["toby-12-shoulder-kiss.jpg", "toby-12-shoulder-kiss"],
  ["toby-13-held-close.jpg", "toby-13-held-close"],
  ["toby-14-star-onesie.jpg", "toby-14-star-onesie"],
  ["toby-15-big-laugh.jpg", "toby-15-big-laugh"],
  ["toby-16-happy-grin.jpg", "toby-16-happy-grin"],
  ["toby-17-bear-beanie.png", "toby-17-bear-beanie"],
  ["toby-18-sleepy-smile.png", "toby-18-sleepy-smile"],
];

async function buildPhotos() {
  await fs.mkdir(photoOut, { recursive: true });
  for (const [file, name] of photos) {
    const info = await sharp(path.join(root, "images", file))
      .rotate()
      .resize({ width: 900, withoutEnlargement: true })
      .webp({ quality: 78, effort: 6 })
      .toFile(path.join(photoOut, `${name}.webp`));
    console.log(`${name}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
  }
}

await buildPhotos();
