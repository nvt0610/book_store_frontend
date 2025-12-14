// src/utils/imagePlaceholder.ts
export const NO_IMAGE_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
  <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="400" fill="#f0f0f0"/>
    <text x="50%" y="50%" dominant-baseline="middle" 
      text-anchor="middle" fill="#999" font-size="20" font-family="Arial">
      No Image
    </text>
  </svg>
`);
