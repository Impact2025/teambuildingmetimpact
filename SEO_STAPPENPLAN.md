# SEO & Marketing Stappenplan - Teambuilding met Impact

## FASE 1: Google Aanmeldingen (Dag 1 - Prioriteit: HOOG)

### 1. Google Search Console Setup (15 min)

**Stappen:**
1. Ga naar: https://search.google.com/search-console
2. Klik op "Start nu"
3. Kies: **URL-voorvoegsel**
4. Vul in: `https://www.teambuildingmetimpact.nl`
5. **Verificatie methode kiezen:**

#### Optie A: HTML-tag verificatie (MAKKELIJKST)
1. Kopieer de meta tag die Google geeft
2. Voeg toe aan `src/app/layout.tsx` in de `<head>` sectie
3. Push naar GitHub
4. Wacht 2-3 minuten voor deployment
5. Klik "Verifiëren" in Google Search Console

#### Optie B: DNS verificatie (via je domain provider)
1. Log in bij je domain registrar (waar je .nl hebt gekocht)
2. Voeg TXT record toe dat Google geeft
3. Wacht 15 min - 24 uur
4. Klik "Verifiëren"

**Na verificatie:**
- Klik op "Sitemap indienen"
- Vul in: `sitemap.xml`
- Klik "Verzenden"

**Resultaat:** Google indexeert je site binnen 24-48 uur

---

### 2. Google Analytics 4 Setup (10 min)

**Stappen:**
1. Ga naar: https://analytics.google.com
2. Klik "Beginnen met meten"
3. Maak account aan:
   - Accountnaam: "Teambuilding met Impact"
   - Property naam: "teambuildingmetimpact.nl"
   - Tijdzone: Nederland (Amsterdam)
   - Valuta: EUR
4. Selecteer "Web" als platform
5. Vul in:
   - Website URL: `https://www.teambuildingmetimpact.nl`
   - Streamnaam: "Web"
6. **Kopieer je Measurement ID** (bijv. G-XXXXXXXXXX)

**Implementatie in Next.js:**
- Voeg toe aan `.env.local`:
  ```
  NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
  ```
- Installeer analytics pakket (later te doen met developer)

---

### 3. Google Business Profile (15 min) ⭐ **LOKAAL SUPER BELANGRIJK**

**Stappen:**
1. Ga naar: https://business.google.com
2. Klik "Nu beheren"
3. Vul in:
   - **Bedrijfsnaam:** Teambuilding met Impact
   - **Categorie:** Evenementenplanner / Teambuilding dienst
   - **Locatie:** Haarlemmermeer (of je kantooradres)
   - **Bezorgservice:** Ja - hele Nederland
4. Voeg toe:
   - ✅ Telefoonnummer
   - ✅ Website: www.teambuildingmetimpact.nl
   - ✅ Openingstijden
   - ✅ Bedrijfsomschrijving (gebruik je homepage beschrijving)
   - ✅ Logo en foto's
5. **Verificatie:**
   - Google stuurt postkaart naar je adres (5-7 dagen)
   - Of: telefonische verificatie (direct)

**Resultaat:** Je verschijnt op Google Maps en lokale zoekresultaten!

---

### 4. Bing Webmaster Tools (5 min) - Bonus

**Stappen:**
1. Ga naar: https://www.bing.com/webmasters
2. Log in met Microsoft account
3. Klik "Site toevoegen"
4. Vul in: `https://www.teambuildingmetimpact.nl`
5. Importeer van Google Search Console (makkelijk!)
6. Sitemap indienen: `https://www.teambuildingmetimpact.nl/sitemap.xml`

**Waarom:** 5-10% van NL gebruikt Bing. Easy extra traffic!

---

## FASE 2: Linkbuilding Strategie (Week 1-4)

### Snelle Wins (Week 1) - Gemakkelijke Backlinks

#### A. Business Directories (Dag 1-3)
**Gratis bedrijvengidsen waar je MOET staan:**

1. **Google Business Profile** (zie hierboven) ⭐⭐⭐
2. **Detailhandel.info** - https://www.detailhandel.info
3. **Bedrijven.com** - https://www.bedrijven.com
4. **Startpagina.nl** - https://www.startpagina.nl
5. **2Findlocal** - https://www.2findlocal.nl
6. **Yoys** - https://www.yoys.nl
7. **Bedrijfspagina.nl** - https://www.bedrijfspagina.nl
8. **Tupalo** - https://www.tupalo.nl

**Template voor aanmelding:**
```
Bedrijfsnaam: Teambuilding met Impact
Website: www.teambuildingmetimpact.nl
Categorie: Evenementenplanning / Teambuilding
Omschrijving:
"Teambuilding met Impact ontwerpt betekenisvolle teamdagen waarin LEGO®
Serious Play en maatschappelijke projecten zorgen voor verbinding,
energie en tastbare impact. Gevestigd in Haarlemmermeer, actief in
heel Nederland."

Keywords: teambuilding, LEGO Serious Play, bedrijfsuitje, teamdag,
Haarlemmermeer, maatschappelijke impact
```

#### B. Social Media Profielen (Dag 4-5)
**Maak complete profielen aan met link naar je website:**

1. **LinkedIn Bedrijfspagina** ⭐⭐⭐
   - https://www.linkedin.com/company/setup
   - Post 2-3x per week over teambuilding, LEGO Serious Play
   - Link naar je website in bio en posts

2. **Facebook Bedrijfspagina**
   - https://www.facebook.com/pages/create
   - Link naar website, post events, foto's van events

3. **Instagram Business Account**
   - Visueel platform - post foto's van LEGO sessies
   - Link in bio naar website

4. **YouTube Channel** (optioneel)
   - Upload case studies, testimonials
   - Beschrijving met link naar website

#### C. Branche Directories (Week 2)
**Gespecialiseerde websites:**

1. **Eventplanner.nl** - https://www.eventplanner.nl
2. **Goesting.be** (België) - https://www.goesting.be
3. **Emerce** (marketing/events) - https://www.emerce.nl
4. **Meetings.nl** - https://www.meetings.nl

### Kwaliteitsvolle Linkbuilding (Week 2-4)

#### D. Content Marketing & Guest Blogging
**Schrijf gastblogs voor:**

1. **Lokale business blogs** (Haarlemmermeer)
   - Gemeentelijke websites
   - Lokale ondernemersverenigingen
   - MKB Nederland regio Haarlemmermeer

2. **HR & Management websites:**
   - Schrijf artikel over "5 redenen waarom LEGO Serious Play werkt voor teams"
   - Pitch naar: Intermediair.nl, MT.nl, Managementsite.nl

3. **Duurzaamheid/MVO websites:**
   - Focus op "maatschappelijke impact" aspect
   - Pitch naar: MVO Nederland, Duurzaam Ondernemen

**Template pitch email:**
```
Onderwerp: Gastblog voorstel - Innovatieve teambuilding met maatschappelijke impact

Beste [Naam],

Ik ben [Naam], oprichter van Teambuilding met Impact. We combineren
LEGO® Serious Play met maatschappelijke projecten voor betekenisvolle
teamdagen.

Ik zou graag een gastblog schrijven voor [Website] over [Onderwerp],
dat perfect aansluit bij jullie lezers die geïnteresseerd zijn in
[relevantie].

Mogelijke onderwerpen:
- "Hoe LEGO® Serious Play innovatie stimuleert in teams"
- "Van teambuilding naar teamimpact: duurzame bedrijfscultuur"
- "5 signalen dat je team toe is aan een teamdag"

Interesse? Ik lever graag een uniek artikel van 800-1200 woorden.

Met vriendelijke groet,
[Naam]
```

#### E. Partnership & Samenwerkingen
**Zoek partnerships met:**

1. **Event locaties**
   - Link exchange: "Onze preferred venues"
   - Zij linken terug: "Aanbevolen activiteiten"

2. **HR & Training bureaus**
   - Complementaire diensten
   - Cross-promotion

3. **MVO organisaties**
   - Goede Doelen organisaties
   - Duurzame bedrijven

4. **LEGO® User Groups & Communities**
   - LEGO® Serious Play facilitators netwerk
   - LinkedIn groepen

#### F. PR & Media (Week 3-4)
**Zoek media aandacht:**

1. **Lokale kranten:**
   - Haarlems Dagblad
   - Nieuw West-Amsterdams Weekblad
   - Pitch: "Local business combineert LEGO met maatschappelijke impact"

2. **Vakbladen:**
   - Personeelsbeleid
   - Human Capital Management
   - MKB Nieuws

3. **Online media:**
   - Startups.nl
   - Quote.nl
   - Sprout.nl (voor duurzaamheid aspect)

**Pitch template:**
```
Onderwerp: Persbericht - Haarlemmers bedrijf vernieuwt teambuilding sector

Beste [Journalist],

Teambuilding met Impact uit Haarlemmermeer heeft een unieke aanpak
ontwikkeld die teambuilding combineert met maatschappelijke projecten.
Tijdens sessies met LEGO® Serious Play werken teams niet alleen aan
hun onderlinge samenwerking, maar leveren ze ook tastbare bijdragen
aan lokale initiatieven.

[Case study / cijfers / quotes]

Interesse in een artikel? Ik deel graag meer details en
achtergronden.

Met vriendelijke groet,
```

---

## FASE 3: Technische SEO Optimalisaties (Week 2)

### Belangrijke verbeteringen voor je website:

#### 1. Structured Data (Schema.org)
Voeg toe aan je website:
- LocalBusiness schema
- Event schema (voor teamdagen)
- Review schema (testimonials)

#### 2. Site Speed Optimalisatie
- Comprimeer afbeeldingen
- Lazy loading voor images
- Minimize CSS/JS

#### 3. Internal Linking
- Link van homepage naar belangrijkste pagina's
- Blog posts linken naar service pages
- "Related posts" sectie in blogs

#### 4. Content Uitbreiding
**Minimaal nodig:**
- 5-10 blog posts over teambuilding onderwerpen
- Case studies pagina met concrete voorbeelden
- FAQ pagina met veelgestelde vragen
- "Over ons" pagina met verhaal en expertise

---

## FASE 4: Monitoring & Optimalisatie (Week 4+)

### Tools om bij te houden:

1. **Google Search Console** (wekelijks checken)
   - Indexatie status
   - Zoekprestaties
   - Errors/warnings

2. **Google Analytics** (wekelijks)
   - Traffic sources
   - Most visited pages
   - Conversion tracking

3. **Rank Tracking** (maandelijks)
   - Gebruik: SERanking, Ahrefs, of SEMrush
   - Track keywords:
     - "teambuilding Nederland"
     - "LEGO Serious Play"
     - "bedrijfsuitje Haarlemmermeer"
     - "teamdag maatschappelijke impact"

---

## Samenvatting: Eerste Week Checklist

### Dag 1 (2 uur):
- [ ] Google Search Console opzetten & sitemap indienen
- [ ] Google Analytics opzetten
- [ ] Google Business Profile aanmaken
- [ ] Bing Webmaster Tools

### Dag 2-3 (3 uur):
- [ ] 8 business directories aanmelden
- [ ] Social media profielen aanmaken (LinkedIn, Facebook, Instagram)
- [ ] Eerste posts op social media

### Dag 4-5 (2 uur):
- [ ] 4 branche directories aanmelden
- [ ] Lijst maken van potentiële guest blog websites
- [ ] 3 pitch emails versturen voor guest blogs

### Week 2:
- [ ] Lokale media benaderen
- [ ] Partnerships zoeken (locaties, HR bureaus)
- [ ] Content plan maken (10 blog onderwerpen)

---

## KPI's om bij te houden:

| Metric | Doel Week 4 | Doel Maand 3 |
|--------|-------------|--------------|
| Indexed pages (Google) | 15+ | 30+ |
| Backlinks | 20+ | 50+ |
| Organic traffic | 50/maand | 300/maand |
| Google Business views | 100/maand | 500/maand |
| Keyword rankings (top 10) | 5 keywords | 15 keywords |

---

## Budget indicatie:

| Item | Kosten | Prioriteit |
|------|--------|------------|
| Business directories | €0 | Hoog |
| Google Ads (optioneel) | €200-500/maand | Medium |
| SEO tool (Ahrefs/SEMrush) | €100/maand | Laag (later) |
| Content writer | €50-100/artikel | Medium |
| Professionele foto's | €300-500 eenmalig | Hoog |

**Totaal eerste maand: €0-300** (als je zelf content schrijft)

---

## Vragen?
Dit plan kan overweldigend lijken. Begin met FASE 1 (Google aanmeldingen)
en werk stap voor stap verder. Consistentie is belangrijker dan perfectie!
