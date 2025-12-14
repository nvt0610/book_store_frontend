import { NO_IMAGE_PLACEHOLDER } from "@/utils/imagePlaceholder";

function replacePath(url: string, folder: string, suffix: string) {
  return url
    .replace("/original/", `/${folder}/`)
    .replace(".webp", `-${suffix}.webp`);
}

export function getThumb(url?: string | null) {
  return url ? replacePath(url, "thumb", "thumb") : NO_IMAGE_PLACEHOLDER;
}

export function getMedium(url?: string | null) {
  return url ? replacePath(url, "medium", "medium") : NO_IMAGE_PLACEHOLDER;
}

export function getLarge(url?: string | null) {
  return url ? replacePath(url, "large", "large") : NO_IMAGE_PLACEHOLDER;
}

export function getOriginal(url?: string | null) {
  return url || NO_IMAGE_PLACEHOLDER;
}
