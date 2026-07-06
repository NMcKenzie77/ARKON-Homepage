# ARKON COGS Model

Last updated: July 6, 2026

This document estimates ARKON's monthly cost of goods sold per customer using the current pricing tiers, the current vendor stack, and conservative usage assumptions.

This is not customer-facing homepage copy. This is an internal margin-control document.

---

## 1. ARKON vendor stack

ARKON should separate cost by layer:

| Layer | Vendor | What it does | COGS driver |
|---|---|---|---|
| Phone and SMS transport | SignalWire | Phone numbers, inbound/outbound call transport, SMS/MMS, 10DLC, carrier fees | Minutes, numbers, message segments |
| Voice agent runtime | ElevenLabs / ElevenAgents | Vera's live voice experience, call minutes, concurrency, voice behavior | Call minutes and concurrency tier |
| LLM reasoning | Anthropic / Claude | Routing, extraction, summaries, tool-use decisions, owner briefs, customer context | Input/output tokens |
| ARKON application | ARKON | Workflow rules, memory, dashboards, handoffs, integrations, support | Support labor, QA, monitoring, custom work |

The important point: SignalWire is not the AI voice agent. ElevenLabs is the live voice-agent layer. Anthropic is the LLM reasoning layer.

---

## 2. Current ARKON pricing tiers

| ARKON tier | Pilot price | Target monthly | Setup fee | Positioning |
|---|---:|---:|---:|---|
| Follow-Up Starter | $799/mo | $999-$1,250/mo | $1,000 | Smaller shops, mobile mechanics, price-sensitive general repair |
| Follow-Up Plus | $999/mo | $1,500/mo | $1,250 | Diagnostic/general shops with moderate volume |
| Shop Operator | $1,250/mo | $1,750/mo | $1,500 | Busy independent shops, tire/brake/alignment shops |
| Shop Command | $1,750/mo | $2,500/mo | $2,500-$3,500 | Premium independent, European/import/performance shops |
| Enterprise | Discovery first | $5,000+/mo | $7,500+ | Multi-location, fleet-heavy, dealership, or larger service operations |

---

## 3. Vendor cost evidence

### ElevenLabs / ElevenAgents

ElevenAgents is priced around call minutes and concurrency. Current published plans include:

| ElevenLabs plan | Monthly price | Included call minutes | Concurrent calls |
|---|---:|---:|---:|
| Starter | $6 | 75 | 6 |
| Creator | $22 | 275 | 10 |
| Pro | $99 | 1,238 | 20 |
| Scale | $299 | 3,738 | 30 |
| Business | $990 | 12,375 | 40 |

ElevenLabs also lists additional call minutes at $0.08/min, burst minutes at $0.16/min, and text messages at $0.003/message. ElevenLabs states that LLM and telephony are billed separately.

Internal planning rate used in this model: **$0.08 per ElevenLabs call minute**.

Source: https://elevenlabs.io/pricing/agents

### SignalWire voice

SignalWire published U.S. local 10DLC voice pricing:

| Voice item | Rate |
|---|---:|
| Local inbound voice | $0.00660/min |
| Local outbound voice | $0.00800/min |
| Local 10DLC number | $0.50/month |

Internal planning rate used in this model: **$0.00730 per voice transport minute**, using a simple inbound/outbound blended average.

Source: https://signalwire.com/pricing/voice

### SignalWire SMS

SignalWire published U.S. local 10DLC SMS pricing:

| SMS item | Rate |
|---|---:|
| Local inbound SMS | $0.00415/segment |
| Local outbound SMS | $0.00415/segment |

SignalWire notes messages are charged per segment and carrier fees may apply. To avoid underestimating, this model uses a conservative SMS planning rate of **$0.00830 per segment**.

Source: https://signalwire.com/pricing/messaging

### Anthropic / Claude

Anthropic published Claude API pricing includes:

| Model | Input | Output |
|---|---:|---:|
| Claude Haiku 4.5 | $1 / MTok | $5 / MTok |
| Claude Sonnet 4.6 | $3 / MTok | $15 / MTok |
| Claude Opus 4.8 | $5 / MTok | $25 / MTok |

This model uses Sonnet as the conservative default for customer-facing workflow reasoning and assumes roughly **$0.015 per business interaction** and **$0.015 per live voice minute** for LLM reasoning.

That $0.015 estimate assumes a representative Sonnet request around 2,000 input tokens and 600 output tokens:

- 2,000 input tokens at $3 / 1,000,000 = $0.006
- 600 output tokens at $15 / 1,000,000 = $0.009
- Estimated total = $0.015

Source: https://platform.claude.com/docs/en/about-claude/pricing

---

## 4. Internal usage assumptions by ARKON tier

These are internal COGS planning caps, not public website promises.

| ARKON tier | Business interactions/mo | ElevenLabs call minutes/mo | SMS segments/mo | SignalWire numbers |
|---|---:|---:|---:|---:|
| Follow-Up Starter | 300 | 75 | 600 | 1 |
| Follow-Up Plus | 750 | 275 | 1,500 | 1 |
| Shop Operator | 1,500 | 1,238 | 3,000 | 2 |
| Shop Command | 3,000 | 3,738 | 6,000 | 3 |
| Enterprise example | 10,000 | 12,375 | 20,000 | 10 |

Usage philosophy:

- Starter and Plus are Naya/Marcus-first. They should not be sold as full live AI receptionist plans.
- Operator is the first real Vera-capable plan.
- Command is the premium Vera + owner-brief + shop-memory plan.
- Enterprise is custom and should never be flat-rated without discovery.

---

## 5. Estimated hard vendor COGS per customer per month

This includes ElevenLabs, SignalWire, and Anthropic only. It excludes payroll, support, monitoring, QA, engineering, and customer success.

| ARKON tier | ElevenLabs | SignalWire voice | SMS | Anthropic | Numbers | Estimated vendor COGS |
|---|---:|---:|---:|---:|---:|---:|
| Follow-Up Starter | $6.00 | $0.55 | $4.98 | $5.63 | $0.50 | **$17.66/mo** |
| Follow-Up Plus | $22.00 | $2.01 | $12.45 | $15.38 | $0.50 | **$52.34/mo** |
| Shop Operator | $99.00 | $9.04 | $24.90 | $41.07 | $1.00 | **$175.01/mo** |
| Shop Command | $299.00 | $27.29 | $49.80 | $101.07 | $1.50 | **$478.66/mo** |
| Enterprise example | $990.00 | $90.34 | $166.00 | $335.63 | $5.00 | **$1,586.97/mo** |

### Formula used

Vendor COGS =

- ElevenLabs call minutes x $0.08
- plus SignalWire voice minutes x $0.00730
- plus SMS segments x $0.00830
- plus Anthropic estimate
- plus SignalWire phone numbers x $0.50

Anthropic estimate =

- business interactions x $0.015
- plus ElevenLabs call minutes x $0.015

---

## 6. Gross margin before support/labor

| ARKON tier | Price used | Vendor COGS | Gross margin before labor/support |
|---|---:|---:|---:|
| Starter pilot | $799 | $17.66 | 97.8% |
| Starter target low | $999 | $17.66 | 98.2% |
| Plus pilot | $999 | $52.34 | 94.8% |
| Plus target | $1,500 | $52.34 | 96.5% |
| Operator pilot | $1,250 | $175.01 | 86.0% |
| Operator target | $1,750 | $175.01 | 90.0% |
| Command pilot | $1,750 | $478.66 | 72.6% |
| Command target | $2,500 | $478.66 | 80.9% |
| Enterprise example | $5,000 | $1,586.97 | 68.3% |

The hard vendor COGS are healthy. The real margin risk is support labor, over-customization, failed handoffs, and unlimited live-call expectations.

---

## 7. True COGS planning reserve

Vendor COGS alone is not enough. ARKON should reserve for monitoring, customer success, QA, tuning, support, and workflow changes.

| ARKON tier | Vendor COGS | Suggested support/QA reserve | True COGS planning target |
|---|---:|---:|---:|
| Follow-Up Starter | ~$18 | $100-$150 | **$120-$170/mo** |
| Follow-Up Plus | ~$52 | $150-$250 | **$200-$300/mo** |
| Shop Operator | ~$175 | $250-$400 | **$425-$575/mo** |
| Shop Command | ~$479 | $400-$750 | **$900-$1,250/mo** |
| Enterprise | ~$1,587+ | $1,500+ | **$3,000+/mo** |

The support reserve is the real discipline. If every customer requires weekly custom prompt changes, custom dashboard work, manual QA, and owner handholding, the software margin disappears even if vendor cost stays low.

---

## 8. Margin guardrails

### Starter

Starter should remain a follow-up and memory plan. It should include Naya follow-up, Marcus customer memory, voice memo notes, review requests, missed-call capture, and owner weekly brief.

Do not sell Starter as a full live AI receptionist.

### Plus

Plus can include limited Vera usage, but it should still be mostly structured notes, inspection/diagnostic follow-up, and better owner visibility.

Do not allow Plus to become unlimited front desk coverage.

### Operator

Operator is the first true Vera-capable tier. This is where ARKON can handle calls, texts, declined-work recovery, tech voice notes, scheduling handoffs, reviews, and owner visibility.

This is likely the best core offer.

### Command

Command should be reserved for premium/high-ticket shops where live voice, follow-up, owner briefs, and tech/advisor notes have clear ROI.

This tier can absorb heavier ElevenLabs usage because the customer value is higher.

### Enterprise

Enterprise must be discovery-first. Do not quote Enterprise off a menu without knowing:

- number of locations
- number of phone numbers
- estimated monthly call minutes
- estimated monthly SMS segments
- number of managers/users
- integration requirements
- reporting requirements
- fleet/unit/customer memory requirements
- support expectations

---

## 9. Recommended public pricing language

Do not publish token limits or exact AI minute limits on the homepage yet.

Use this instead:

> Pricing is scoped by message volume, live voice coverage, number of locations, workflow depth, and integration needs.

For proposals or SOWs, use internal caps:

| Tier | Internal cap language |
|---|---|
| Starter | Light follow-up usage; no full live Vera |
| Plus | Moderate follow-up usage; limited Vera |
| Operator | Full shop workflow usage; Vera-capable |
| Command | Premium workflow usage; heavier Vera and owner reporting |
| Enterprise | Custom usage, routing, reporting, and integrations |

---

## 10. Bottom line

Vendor COGS are not the main threat.

The threat is selling too much custom work too early.

The pricing is workable if the tiers are protected:

- Starter and Plus = follow-up and memory
- Operator and Command = Vera-capable operating plans
- Enterprise = custom system design, routing, reporting, and integrations

The practical rule:

> Protect live voice, protect custom integrations, and never let Starter become Enterprise in disguise.
