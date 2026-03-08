# Plan: Forbedre DVcode - Digitale Verk

## Nåværende status

Nettsiden (digitaleverk.no) er en enkel "kommer snart"-landingsside med:
- Én enkelt HTML-fil med inline CSS
- Ingen JavaScript
- Ingen byggsystem eller rammeverk
- To bildefiler (logo.png, ikon.png)
- Custom domene via CNAME

## Forbedringsplan

### Fase 1: Strukturelle forbedringer

**1.1 Separere CSS fra HTML**
- Flytt all inline CSS til en egen `styles/main.css`-fil
- Gjor koden enklere å vedlikeholde og cache-vennlig

**1.2 Legg til meta-tagger for SEO og deling**
- Open Graph-tagger (og:title, og:description, og:image)
- Twitter Card-tagger
- Strukturerte data (JSON-LD) for bedriftsinformasjon
- Canonical URL

**1.3 Legg til favicon-sett**
- Generer favicons i ulike storrelser (16x16, 32x32, 180x180, 512x512)
- Legg til `site.webmanifest` for PWA-stotte

### Fase 2: DVcode-produktside

**2.1 Opprett en dedikert DVcode-seksjon**
- Beskriv hva DVcode er og tilbyr
- Tjenesteoversikt med ikoner/kort:
  - Interne systemer
  - Bookinglosninger
  - Kursplattformer
  - Nettside-utvikling
- Prising eller "ta kontakt for tilbud"

**2.2 Portefolje/referanser**
- Vis tidligere prosjekter eller case-studier
- Testimonials fra kunder (når tilgjengelig)

**2.3 Prosess-seksjon**
- Beskriv arbeidsprosessen steg for steg
- Visuell tidslinje eller steg-indikator

### Fase 3: Funksjonalitet

**3.1 Kontaktskjema**
- Legg til et enkelt kontaktskjema (kan bruke Formspree, Netlify Forms, eller lignende)
- Felter: Navn, E-post, Melding, Tjeneste (dropdown)

**3.2 Navigasjon**
- Legg til ankerpunkt-navigasjon til ulike seksjoner
- Mobilvennlig hamburgermeny
- Smooth scroll mellom seksjoner

**3.3 Animasjoner**
- Fade-in-animasjoner ved scrolling (CSS-basert eller med IntersectionObserver)
- Subtile hover-effekter pa kort og knapper

### Fase 4: Teknisk kvalitet

**4.1 Ytelse**
- Optimaliser bilder (WebP-format, lazy loading)
- Legg til preconnect/preload for kritiske ressurser
- Minimer CSS

**4.2 Tilgjengelighet (a11y)**
- ARIA-attributter der nodvendig
- Tastaturnavigasjon
- Fargekontrast-sjekk (WCAG AA)
- Skip-to-content-lenke

**4.3 Responsivt design**
- Forbedre eksisterende media queries
- Test pa flere skjermstorrelser
- Legg til tablet-breakpoint

### Fase 5: Utvidelse

**5.1 Flerside-struktur (valgfritt)**
- Vurder om siden bor splittes til flere sider:
  - `/` - Forside
  - `/tjenester` - DVcode tjenester
  - `/om` - Om Digitale Verk
  - `/kontakt` - Kontaktside

**5.2 Blog/Nyheter (valgfritt)**
- Enkel blogg-seksjon for a dele oppdateringer
- Kan implementeres med statisk site generator (11ty, Astro) senere

**5.3 Analytics**
- Legg til personvernvennlig analytics (f.eks. Plausible, Umami)
- Cookie-banner om nodvendig

## Prioritert rekkefølge

| Prioritet | Oppgave | Estimat |
|-----------|---------|---------|
| 1 | Separere CSS fra HTML | 1 time |
| 2 | SEO meta-tagger | 30 min |
| 3 | DVcode tjeneste-seksjoner | 3-4 timer |
| 4 | Kontaktskjema | 1-2 timer |
| 5 | Navigasjon med ankerpunkter | 1 time |
| 6 | Scroll-animasjoner | 1-2 timer |
| 7 | Bilde-optimalisering | 1 time |
| 8 | Tilgjengelighet | 1-2 timer |
| 9 | Portefolje-seksjon | 2-3 timer |
| 10 | Analytics | 30 min |

## Designretningslinjer

Basert pa eksisterende design:
- **Primaerfarge:** `#c9b07a` (gull/sand)
- **Bakgrunn:** `#0f0f10` (mork)
- **Tekst:** `#f5f5f5` (lys)
- **Sekundaertekst:** `#c8c8c8`
- **Font:** Inter, Arial, sans-serif
- **Border-radius:** 14px (knapper), 28px (kort), 999px (pills)
- **Stil:** Mork, minimalistisk, profesjonell med subtile glassmorfisme-effekter
