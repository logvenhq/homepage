# Logven Homepage

A focused, one-page marketing site built with [Zola](https://www.getzola.org/) and vanilla CSS.

## Local development

```sh
zola serve
```

The site is available at `http://127.0.0.1:1111`.

## Production build

```sh
zola build
```

Generated files are written to `public/`.

## Structure

- `templates/` contains the shared page shell and homepage template.
- `static/css/style.css` contains the ordered, plain-CSS stylesheet.
- `static/fonts/` contains the self-hosted Geist variable font.
- `static/images/` and `static/brand/` contain Logven's existing visual assets.
