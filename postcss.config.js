const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
    plugins: [
      purgecss({
        content: ['./src/template.html'],
        safelist: {
          standard: [/offcanvas/, /modal/, /alert/, /popover/, /valid/, /collapsing/, /border-success/],
          deep: [/offcanvas/, /modal/, /popover/],          
        }
      }),
      require("cssnano")
    ]
  }