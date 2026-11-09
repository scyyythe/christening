// To add a photo: drop the original into images/, list it in
// scripts/prepare-gallery.mjs, run `node scripts/prepare-gallery.mjs`, then
// import the WebP below and add an entry. Captions are optional.
// `position` is the object-position that keeps Toby's face in the square frame.
import hospitalHat from "../assets/toby/toby-01-hospital-hat.webp";
import hospitalPeek from "../assets/toby/toby-02-hospital-peek.webp";
import hospitalBed from "../assets/toby/toby-03-hospital-bed.webp";
import homeNewborn from "../assets/toby/toby-04-home-newborn.webp";
import napLeaves from "../assets/toby/toby-05-nap-leaves.webp";
import napHands from "../assets/toby/toby-06-nap-hands.webp";
import socks from "../assets/toby/toby-07-socks.webp";
import bigEyes from "../assets/toby/toby-08-big-eyes.webp";
import smile from "../assets/toby/toby-09-smile.webp";
import chubby from "../assets/toby/toby-10-chubby.webp";
import bibSmile from "../assets/toby/toby-11-bib-smile.webp";
import shoulderKiss from "../assets/toby/toby-12-shoulder-kiss.webp";
import heldClose from "../assets/toby/toby-13-held-close.webp";
import starOnesie from "../assets/toby/toby-14-star-onesie.webp";
import bigLaugh from "../assets/toby/toby-15-big-laugh.webp";
import happyGrin from "../assets/toby/toby-16-happy-grin.webp";
import bearBeanie from "../assets/toby/toby-17-bear-beanie.webp";
import sleepySmile from "../assets/toby/toby-18-sleepy-smile.webp";

export type GalleryPhoto = {
  src: string;
  width: number;
  height: number;
  position?: string;
  caption?: string;
};

export const gallery: GalleryPhoto[] = [
  { src: hospitalHat, width: 900, height: 1200, position: "50% 30%", caption: "hello, world!" },
  { src: hospitalPeek, width: 900, height: 1200, position: "50% 12%" },
  { src: hospitalBed, width: 900, height: 1200, position: "50% 22%" },
  { src: homeNewborn, width: 900, height: 1200, position: "50% 30%" },
  { src: napLeaves, width: 900, height: 1200, position: "50% 58%" },
  { src: napHands, width: 900, height: 1200, position: "50% 42%", caption: "sleepy sunday" },
  { src: socks, width: 900, height: 1200, position: "50% 8%" },
  { src: bigEyes, width: 900, height: 1623, position: "50% 70%" },
  { src: smile, width: 900, height: 1200, position: "50% 32%", caption: "first smile" },
  { src: chubby, width: 900, height: 1200, position: "50% 40%" },
  { src: bibSmile, width: 900, height: 1600, position: "50% 42%" },
  { src: shoulderKiss, width: 900, height: 1200, position: "50% 55%" },
  { src: heldClose, width: 900, height: 1200, position: "50% 40%" },
  { src: starOnesie, width: 900, height: 1200, position: "50% 30%" },
  { src: bigLaugh, width: 900, height: 1200, position: "50% 42%" },
  { src: happyGrin, width: 900, height: 1200, position: "50% 50%" },
  { src: bearBeanie, width: 900, height: 1200, position: "50% 50%" },
  { src: sleepySmile, width: 900, height: 1200, position: "50% 45%" },
];
