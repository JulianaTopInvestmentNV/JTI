# JulianaTopInvestment

## Build the website CSS

The site is static HTML/CSS/JavaScript. Tailwind utilities are compiled locally for production; no Tailwind CDN is used.

```sh
npm ci
npm run build
```

The build writes the compiled stylesheet to `css/tailwind.css`. GitHub Actions runs the same build before deploying GitHub Pages.