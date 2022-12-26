const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
    plugins: [
      purgecss({
        content: ['./src/index.html'],
        safelist: {
          // standard: [/offcanvas$/, /modal$/, /^alert/, /^popover/, /^form/],
          // deep: [/offcanvas$/, /modal$/, /^alert/, /^popover/, /^form/],
          // greedy: [/offcanvas$/, /modal$/, /^alert/, /^popover/, /^form/]
          // standard: [/offcanvas/, /modal/, /alert/, /popover/, /form/, /valid/],
          standard: [/offcanvas/, /modal/, /alert/, /popover/, /valid/],
          deep: [/offcanvas/, /modal/, /popover/],
          // greedy: [/offcanvas/, /modal/, /alert/, /popover/, /form/, /valid/]
        }
      }),
      require("cssnano")
    ]
  }