# Nordic Builder - Byggfirma Template

## Oversikt
Nordic Builder er en profesjonell, responsiv nettside-template designet spesielt for byggfirmaer og entreprenører. Templaten er bygget med ren HTML, CSS og JavaScript og er lett å tilpasse for ulike kunder.

## Funksjoner
- ✅ Responsivt design som fungerer på alle enheter
- ✅ Moderne, profesjonelt design
- ✅ Interaktiv prosjektfiltrering
- ✅ Kontaktskjema med validering
- ✅ Smooth scrolling og animasjoner
- ✅ SEO-optimalisert struktur
- ✅ Lett å tilpasse og vedlikeholde

## Filstruktur
```
byggfirma-template/
├── index.html              # Hovedfil
├── css/
│   └── style.css           # Alle stiler
├── js/
│   └── script.js           # JavaScript-funksjonalitet
└── assets/
    └── images/
        ├── hero/           # Hero-bilder
        ├── projects/       # Prosjektbilder
        ├── team/          # Team-bilder
        └── services/      # Tjeneste-bilder
```

## Tilpasning for nye kunder

### 1. Bedriftsinformasjon
**Filer å endre:** `index.html`

**Søk og erstatt følgende:**
- `Nordic Builder` → Nytt firmanavn
- `post@nordicbuilder.no` → Ny e-postadresse
- `+47 22 12 34 56` → Nytt telefonnummer
- `Byggeveien 123, 0150 Oslo` → Ny adresse

### 2. Logo og farger
**Filer å endre:** `css/style.css`

**Fargevariabler (linje 15-25):**
```css
:root {
    --primary-color: #2C3E50;    /* Hovedfarge */
    --secondary-color: #E67E22;  /* Accent-farge */
    --accent-color: #3498DB;     /* Sekundær accent */
    /* ... */
}
```

**Logo:** Erstatt hammer-ikonet i `index.html` (linje 25) med eget logo.

### 3. Bilder
**Mapper å oppdatere:** `assets/images/`

**Hero-bilder:**
- Erstatt `hero-1.jpg` og `hero-2.jpg` med nye hero-bilder

**Prosjektbilder:**
- Erstatt bildene i `projects/`-mappen
- Oppdater bildereferanser i HTML (søk etter `assets/images/projects/`)

**Team-bilder:**
- Erstatt bildene i `team/`-mappen

### 4. Innhold
**Filer å endre:** `index.html`

**Hovedtekster:**
- Hero-tittel (linje 45): "Bygger fremtidens Norge"
- Hero-beskrivelse (linje 48-51)
- Om oss-tekst (linje 95-105)
- Tjenestebeskrivelser (linje 150-220)
- Prosjektinformasjon (linje 280-400)
- Kundeuttalelser (linje 450-520)

### 5. Kontaktinformasjon
**Filer å endre:** `index.html`

**Kontaktdetaljer (linje 550-600):**
- Telefonnummer
- E-postadresse
- Besøksadresse

**Google Maps:** Oppdater iframe-src (linje 650) med ny adresse.

### 6. Sosiale medier
**Filer å endre:** `index.html`

**Footer-lenker (linje 680-690):**
- Facebook-lenke
- Instagram-lenke
- LinkedIn-lenke

## Tekniske detaljer

### Responsivt design
Templaten bruker CSS Grid og Flexbox for layout og har breakpoints for:
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobil: 767px og mindre

### JavaScript-funksjoner
- **Mobilmeny:** Hamburger-meny for mobile enheter
- **Smooth scrolling:** Myk scrolling mellom seksjoner
- **Prosjektfiltrering:** Filtrer prosjekter etter kategori
- **Skjemavalidering:** Validering av kontaktskjema
- **Scroll-to-top:** Knapp for å scrolle til toppen
- **Aktiv navigasjon:** Markerer aktiv seksjon i navigasjonen

### SEO-optimalisering
- Semantisk HTML-struktur
- Meta-tags for søkemotorer
- Alt-tekster på bilder
- Strukturerte overskrifter (H1-H6)

### Ytelse
- Optimaliserte bilder
- Minimale eksterne avhengigheter
- Effektiv CSS og JavaScript

## Nettleserstøtte
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Installasjon og bruk

1. **Last ned templaten**
2. **Tilpass innhold** som beskrevet over
3. **Test lokalt** ved å åpne `index.html` i nettleseren
4. **Last opp** til webserver eller hosting-tjeneste

## Support og vedlikehold

### Vanlige problemer
- **Bilder vises ikke:** Sjekk at bildestier er korrekte
- **Mobilmeny fungerer ikke:** Kontroller at JavaScript er aktivert
- **Kontaktskjema sender ikke:** Implementer backend for skjemabehandling

### Fremtidige oppdateringer
- Legg til flere prosjektkategorier ved å oppdatere filter-knapper og data-attributter
- Utvid kontaktskjemaet med flere felt etter behov
- Legg til flere animasjoner ved å bruke ScrollReveal-biblioteket

## Lisens
Denne templaten er laget for Medcom og kan brukes fritt for kommersielle prosjekter.

---

**Utviklet av:** Manus AI  
**Versjon:** 1.0  
**Dato:** Desember 2024

