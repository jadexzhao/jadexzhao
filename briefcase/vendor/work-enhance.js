import PhotoSwipeLightbox from "./photoswipe/photoswipe-lightbox.esm.js";

const galleries = document.querySelectorAll("[data-pswp-gallery]");

for (const gallery of galleries) {
  const lightbox = new PhotoSwipeLightbox({
    gallery,
    children: "a[data-pswp-width]",
    pswpModule: () => import("./photoswipe/photoswipe.esm.js"),
    padding: { top: 32, bottom: 32, left: 16, right: 16 },
  });
  lightbox.init();
}
