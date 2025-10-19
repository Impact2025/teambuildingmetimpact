# Row Level Security (RLS) Migration

Deze migratie schakelt Row Level Security in voor alle database tabellen om je applicatie te beveiligen tegen ongeautoriseerde client-side toegang.

## Wat doet deze migratie?

### Beveiligingsmodel

De applicatie gebruikt **server-side Prisma queries** met de Supabase `service_role` key. Dit betekent:

1. **Server-side (Prisma/NextAuth)**: Heeft volledige toegang via `service_role`
2. **Client-side**: Geblokkeerd tenzij expliciet toegestaan voor publieke content

### Toegangsregels per tabel

#### 🔒 Volledig geblokkeerd (Server-side only)
- **Auth tabellen**: User, Account, Session, VerificationToken
- **Workshop management**: Workshop, WorkshopSession, SessionState, BuildUpload, ChecklistItem, AIReport, AlarmSetting, RunOfShowEvent, WorkshopState
- **Teamday admin**: TeamdaySession, TeamdayUpload

#### 📖 Publiek lezen + Server-side beheren
- **BlogPost**:
  - ✅ Public read voor `status = 'PUBLISHED'`
  - 🔒 Server-side full access voor admin panel

- **TeamdayProgram**:
  - ✅ Public read (voor viewer page)
  - 🔒 Server-side full access voor admin panel

#### ✍️ Publiek schrijven + Server-side beheren
- **QuoteRequest**:
  - ✅ Public insert (offerteformulier op website)
  - 🔒 Server-side read/delete voor admin panel

- **TeamdayReview**:
  - ✅ Public read voor `status = 'APPROVED'` (homepage reviews)
  - ✅ Public insert (review formulier)
  - 🔒 Server-side full access voor admin panel

## Waarom is dit veilig?

1. **Prisma gebruikt service_role**: Je `DATABASE_URL` bevat de service_role key, dus alle Prisma queries werken normaal
2. **Client-side geblokkeerd**: Directe Supabase client queries worden geblokkeerd tenzij expliciet toegestaan
3. **Defense-in-depth**: Extra beveiligingslaag naast NextAuth middleware

## Impact op je applicatie

✅ **Geen breaking changes**: Je applicatie blijft exact hetzelfde werken
✅ **Betere beveiliging**: Database is beschermd tegen client-side misbruik
✅ **Supabase Security Advisor**: Waarschuwingen verdwijnen

## Hoe te gebruiken

Deze migratie is klaar om toegepast te worden via de Supabase dashboard SQL editor.

### Optie 1: Via Supabase Dashboard (Aanbevolen)

1. Ga naar Supabase Dashboard → SQL Editor
2. Klik op "New Query"
3. Kopieer de inhoud van `migration.sql`
4. Klik op "Run"

### Optie 2: Via Prisma (Als je Prisma migraties gebruikt)

```bash
# Pas de migratie toe
npx prisma migrate deploy
```

## Testen

Na het uitvoeren van de migratie, test of alles werkt:

```bash
# Start de app
npm run dev

# Test deze functionaliteiten:
# ✅ Inloggen als admin
# ✅ Blog posts lezen op de website
# ✅ Offerte aanvragen via formulier
# ✅ Review schrijven via teamdag formulier
# ✅ Reviews lezen op homepage
# ✅ Admin panel (alle functionaliteit)
```

Alles zou moeten werken zoals voorheen!

## Rollback

Als er problemen zijn, kun je RLS uitschakelen met:

```sql
-- Zet RLS uit voor alle tabellen (TIJDELIJK, ALLEEN VOOR DEBUGGING)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
    LOOP
        EXECUTE 'ALTER TABLE ' || quote_ident(r.tablename) || ' DISABLE ROW LEVEL SECURITY';
    END LOOP;
END $$;
```

⚠️ **Let op**: Dit schakelt RLS uit voor alle tabellen. Gebruik dit alleen tijdelijk voor debugging.
