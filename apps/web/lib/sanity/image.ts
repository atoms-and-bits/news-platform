import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";
import type { SanityImageSource } from "./types";

const builder = imageUrlBuilder(client);

/**
 * Generate an image URL from a Sanity image reference.
 * Usage: urlFor(article.mainImage).width(800).url()
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
