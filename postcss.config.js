const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
    plugins: [
      purgecss({
        content: ['./src/index.html'],
        safelist: {
          standard: [/offcanvas/, /modal/, /alert/, /popover/, /valid/, /collapsing/],
          deep: [/offcanvas/, /modal/, /popover/],          
        }
      }),
      require("cssnano")
    ]
  }