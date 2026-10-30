// To add a photo: drop the file into src/assets/toby/, import it below,
// and add an entry to the list. Captions are optional.
import placeholderOne from "../assets/toby/placeholder-1.svg";
import placeholderTwo from "../assets/toby/placeholder-2.svg";
import placeholderThree from "../assets/toby/placeholder-3.svg";

export type GalleryPhoto = {
  src: string;
  caption?: string;
};

export const gallery: GalleryPhoto[] = [
  { src: placeholderOne, caption: "hello, world!" },
  { src: placeholderTwo, caption: "first smile" },
  { src: placeholderThree },
];
