const face = (family, file) => `@font-face {
  font-family: '${family}';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/mock/v1/${file}.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}`;
module.exports = {
  "https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap": face("Geist", "geist"),
  "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap": face("Geist Mono", "geistmono"),
};
