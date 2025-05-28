# Custom Fonts for Cyberpunk RED GM Screen

This directory contains custom fonts used by the Cyberpunk RED GM Screen application.

## Font Files

- **Cyberpunk.woff2**: Main display font for headers and logos
- **Acquire.woff2**: Technical, data-oriented displays
- **VeniteAdoremus.woff2**: Stylized headings and titles
- **Angora.woff2**: Specialized UI elements

## Usage

These fonts are referenced in the CSS via `@font-face` declarations in `css/cyberpunk-fonts.css`.

## Licensing

**IMPORTANT**: The placeholder files in this directory need to be replaced with properly licensed font files before deployment.

Sources for appropriate cyberpunk-style fonts:
1. [Google Fonts](https://fonts.google.com/) (Free, open-source)
2. [Adobe Fonts](https://fonts.adobe.com/) (Subscription)
3. [MyFonts](https://www.myfonts.com/) (Commercial)
4. [FontSquirrel](https://www.fontsquirrel.com/) (Free for commercial use)

## Fallback Strategy

If these fonts fail to load, the application will fall back to:
- Cyberpunk → Orbitron → sans-serif
- Acquire → Share Tech Mono → monospace
- Venite Adoremus → Rajdhani → sans-serif
- Angora → Arial → sans-serif