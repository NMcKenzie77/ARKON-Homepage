# ARKON Systems Handoff — July 4, 2026

Use this document to continue ARKON Systems in a new chat.

## Current direction

ARKON Systems is an AI workflow operating layer for service businesses.

Positioning:

```text
Your team stays focused. ARKON handles the repeatable work around them.
```

ARKON handles repeatable work such as intake, missed calls, website inquiries, messages, follow-up, routing, handoffs, owner briefs, and audit trails.

## Current repos

```text
ARKON-Homepage
Main ArkonsysAI public frontend and future login/auth gateway.

ARKON-Vertical-Template
Reusable architecture source of truth for future verticals.

ARKON-AutoRepair
First real vertical product and first architecture proof.

ARKON-BotLab
Weekly bot improvement engine.

paperclip
Bot-building helper/tooling layer, closer to BotLab than vertical products.
```

## Repo ownership rules

```text
ARKON-Homepage owns the public site and future login gateway.
ARKON-AutoRepair owns the first vertical proof.
ARKON-BotLab owns bot version testing and weekly improvement.
paperclip is not a vertical; it helps with bot-building patterns.
ARKON-Vertical-Template owns reusable vertical architecture docs.
```

Do not put the main login system inside AutoRepair.

Do not put vertical product logic inside BotLab.

Do not turn AutoRepair into Paperclip.

## First vertical proof

Build one vertical first:

```text
ARKON-AutoRepair
```

First proof businesses:

```text
Mike's Auto Shop
Fleet Repair Center
```

The proof is successful only when both businesses run differently inside the same backend and frontend.

Mike's Auto Shop fields:

```text
VIN
Mileage
Preferred drop-off time
```

Fleet Repair Center fields:

```text
Fleet account number
Truck unit number
Driver name
Downtime urgency
```

Same backend. Same frontend. Different business behavior through configuration.

## AutoRepair repo status

The AutoRepair repo has a starter workspace, API skeleton, DB package, first migration, first seed, and vertical config.

Important files already added:

```text
package.json
pnpm-workspace.yaml
tsconfig.base.json
apps/api/src/server.ts
apps/api/src/app.ts
apps/api/src/routes/health.ts
apps/api/src/routes/businesses.ts
apps/api/src/routes/contacts.ts
apps/api/src/routes/repairRequests.ts
packages/db/migrations/001_initial_schema.sql
packages/db/seeds/001_first_two_businesses.sql
packages/vertical-configs/src/autoRepairConfig.ts
```

## AutoRepair next technical steps

Run locally:

```bash
git clone the ARKON-AutoRepair repo
cd ARKON-AutoRepair
pnpm install
```

Set up Postgres, preferably Railway Postgres, then create `.env` with:

```text
DATABASE_URL=postgresql connection string
PORT=3000
```

Run:

```bash
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Test:

```text
GET /api/health
GET /api/businesses
GET /api/businesses/11111111-1111-1111-1111-111111111111/custom-fields
GET /api/businesses/22222222-2222-2222-2222-222222222222/custom-fields
```

Fix install, build, typecheck, migration, seed, and runtime issues before building UI.

## Monday success target

By end of Monday:

```text
Open ARKON-AutoRepair.
Choose Mike's Auto Shop.
See Mike's fields.
Create a repair request.
Switch to Fleet Repair Center.
See Fleet's fields.
Create a fleet repair request.
Both use the same backend and frontend.
No custom code per business.
```

## Auth gateway decision

ArkonsysAI should be login-first.

Flow:

```text
arkonsysai.com
    ↓
Login
    ↓
Backend identifies user
    ↓
Backend checks RBAC
    ↓
Backend identifies company and vertical
    ↓
Frontend loads correct dashboard or workspace
```

Documented in:

```text
ARKON-Homepage/docs/arkon-auth-gateway.md
```

Main login belongs in ARKON-Homepage, not in a vertical repo.

## BotLab decision

BotLab is not a vertical.

BotLab is the weekly improvement engine.

Flow:

```text
Review production bot activity
Create 5 candidate bots
Test candidates
Score candidates
Run safety checks
Promote only if better and safe
Keep rollback
Create report
```

Do not let bots silently rewrite themselves and go live.

## Paperclip decision

Paperclip is not a vertical.

Paperclip is a bot-building helper/tooling layer.

Paperclip may help BotLab later with agent runner patterns, adapter interfaces, CLI patterns, heartbeat ideas, plugin lifecycle ideas, evaluation patterns, activity logs, and feedback patterns.

Do not turn AutoRepair into Paperclip.

## Non-negotiable voice provisioning

SignalWire and ElevenLabs are first-class ARKON platform integrations.

Documented in:

```text
ARKON-Vertical-Template/docs/required-voice-provisioning.md
```

Hard rules:

```text
Every company gets a primary SignalWire-connected company number.
Every person the company adds gets their own SignalWire-connected number.
All numbers connect back to SignalWire.
ARKON stores ownership, routing, provider IDs, and webhook URLs.
Manual setup is the exception, not the normal process.
```

Provisioning must support:

```text
company numbers
user and staff numbers
owner numbers
manager numbers
agent numbers
advisor numbers
front desk numbers
SignalWire routing
ElevenLabs voice profiles
provisioning job logs
admin status screens
```

Do not ship a company onboarding flow that leaves SignalWire or ElevenLabs as manual setup.

Do not ship a user add flow that requires manual number creation and wiring.

## What not to do next

```text
Do not create more vertical repos.
Do not build Salons, Dental, Law Firms, Gyms, or Insurance yet.
Do not build BotLab yet.
Do not integrate Paperclip into AutoRepair yet.
Do not build auth gateway before AutoRepair proof runs.
Do not overbuild the AutoRepair frontend.
```

## Immediate next actions

```text
1. Create Railway project or service for ARKON-AutoRepair.
2. Add Railway Postgres.
3. Copy DATABASE_URL.
4. Clone ARKON-AutoRepair locally.
5. Run pnpm install.
6. Add .env with DATABASE_URL.
7. Run pnpm db:migrate.
8. Run pnpm db:seed.
9. Run pnpm dev.
10. Test API endpoints.
11. Fix errors.
12. Build first frontend proof only after backend works.
```

## First frontend proof

Build only:

```text
Business selector
Repair request list
Dynamic repair request form
```

The form must render different fields based on selected business.

Mike's fields and Fleet's fields must come from backend config, not separate hardcoded forms.

## New chat starter

Paste this in a new chat:

```text
We are continuing ARKON Systems. Read the handoff file at ARKON-Homepage/docs/arkon-handoff-2026-07-04.md.

Main repos:
ARKON-Homepage = main ArkonsysAI frontend and future login/auth gateway.
ARKON-AutoRepair = first real vertical proof.
ARKON-Vertical-Template = reusable vertical architecture docs.
ARKON-BotLab = weekly bot improvement engine.
paperclip = bot-building helper/tooling, not a vertical.

Current job: get ARKON-AutoRepair running locally, migrate and seed Postgres, verify Mike's Auto Shop and Fleet Repair Center return different custom fields, then build the first simple frontend proof.

Non-negotiable: SignalWire and ElevenLabs must be auto-provisioned. Every company gets a primary SignalWire number, and every added user or staff member gets their own SignalWire-connected number. Do not design manual per-company or per-user setup as the normal process.
```
