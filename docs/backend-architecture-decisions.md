# ARKON Backend Architecture Decisions

This document is the permanent source of truth for the ARKON backend direction.

Do not rely on chat memory. Do not rely on the founder remembering the full architecture conversation. Any AI assistant, developer, or future contributor should read this file before making backend decisions for ARKON.

## Business understanding

ARKON Systems is not positioned as a generic AI chatbot.

ARKON is an AI workflow and operating layer for service businesses. It sits around the business and supports the repeatable work that usually falls between the owner, front desk, staff, inbox, phone, website, CRM, scheduler, and follow-up process.

ARKON helps with work such as:

- Missed calls
- Website inquiries
- Client, customer, member, patient, or guest messages
- Follow-up
- Scheduling support
- Intake
- Context and relationship history
- Staff handoffs
- Owner visibility
- Daily or priority briefs
- Repeatable communication in the approved business voice

The owner and staff stay in control. ARKON does not replace the professional, technician, agent, attorney, trainer, receptionist, paralegal, service advisor, stylist, or staff member. ARKON prepares the work, captures the request, keeps context attached, and routes anything judgment-based or sensitive to the right person.

The strongest positioning is:

> Your team stays focused. ARKON handles the repeatable work around them.

ARKON sells control, memory, follow-up, and visibility. The product is not only automation. It is a business operating layer that keeps repeatable work from leaking revenue, time, and customer trust.

## Core backend decision

The backend should not be one generic backend pretending all businesses operate the same way.

The backend should also not become a fully custom backend for every single client.

The correct architecture is:

```text
One ARKON core pattern
One deployed backend environment per vertical when needed
Many businesses configured inside each vertical backend
```

In practical terms:

```text
ARKON Core Code / Pattern
│
├── Railway: arkon-auto-repair
├── Railway: arkon-salons
├── Railway: arkon-dental
├── Railway: arkon-law-firms
├── Railway: arkon-gyms
├── Railway: arkon-real-estate
├── Railway: arkon-insurance
├── Railway: arkon-home-services
├── Railway: arkon-professional-services
└── Railway: arkon-short-term-rentals
```

Each vertical can have its own Railway instance or backend service because each vertical has different objects, language, integrations, risks, and workflow expectations.

However, each individual business inside a vertical should not get a separate backend at first. Each business should be represented as a tenant/configuration inside the vertical backend.

Example:

```text
arkon-auto-repair backend
│
├── Mike's Auto Shop
├── Premier Tire & Brake
├── German Auto Specialists
└── Fleet Repair Center
```

Each shop can behave differently through business-specific configuration, not through a separate backend schema.

## Why vertical-level backend separation makes sense

Each vertical is different enough to deserve its own backend environment or module.

An auto repair shop cares about:

```text
Customer
Vehicle
Repair request
Estimate
Declined work
Service advisor
Recommended repairs
Vehicle status
Return visit
```

A salon cares about:

```text
Client
Appointment
Stylist or technician
Service type
Photo intake
Consultation details
Rebooking
No-show
Same-day openings
```

A dental office cares about:

```text
Patient
Appointment request
Cancellation
No-show
Routine reminder
Patient form handoff
Front desk follow-up
Schedule gap
```

A law firm cares about:

```text
Client
Matter
Attorney schedule
Paralegal handoff
Email triage
Document request
Consult preparation
Open item
Needs review
```

A gym or fitness studio cares about:

```text
Trial lead
Tour booking
Class question
Personal training interest
Member follow-up
Cancellation handoff
Retention signal
Owner brief
```

These are different enough that separate Railway services per vertical can make sense.

The key boundary is this:

> Separate vertical backends are acceptable. Separate custom backends for every individual business should be avoided unless there is a strong enterprise reason later.

## Shared ARKON core concepts

Even though each vertical can have a separate backend environment, ARKON should keep a shared mental model and shared core concepts.

Common ARKON concepts include:

```text
businesses
users
staff_members
contacts / customers / clients / patients / members / guests
conversations
messages
calls
emails
tasks
handoffs
notes
files
integrations
custom_fields
workflow_rules
escalation_rules
audit_logs
owner_briefs
```

The name of the contact may change by vertical:

```text
Auto repair: customer
Salon: client
Dental: patient
Law firm: client
Gym: member or lead
Short-term rental: guest
Insurance: prospect or policyholder
Real estate: buyer, seller, lead, client
```

But under the hood, ARKON should understand that these are all relationship records attached to a business.

## Important decision: same vertical backend, different business behavior

Businesses inside the same vertical often operate differently.

Example: two auto shops may both be auto repair businesses, but they can still have very different workflows.

One shop may focus on oil changes, brakes, tires, and inspections.

Another may focus on diagnostics, fleet repairs, German cars, warranty work, or high-ticket engine and transmission jobs.

Therefore, the backend cannot assume every business in a vertical works the exact same way.

But the solution is not to create new database columns for every individual business.

The solution is:

```text
Same vertical backend
Same main schema
Different business configuration
Different custom fields
Different required fields
Different workflow rules
Different escalation rules
Different staff routing
Different approved voice and response rules
```

## Database rule: do not create business-specific columns

Do not build a table like this:

```text
repair_requests
- id
- business_id
- customer_id
- vehicle_id
- business_a_special_column
- business_b_special_column
- business_c_special_column
```

That will become messy and hard to maintain.

Instead, use core columns for fields that most businesses in the vertical need, and use custom field storage for fields that only some businesses need.

The guiding rule:

> If about 70% or more of businesses in that vertical need the field, make it a real core column.
> If only some businesses need it, make it a custom field.

## Core fields plus custom_data

Each vertical should have core tables with common fields plus a flexible `custom_data` field for business-specific fields.

Example for auto repair:

```text
repair_requests
- id
- business_id
- customer_id
- vehicle_id
- request_type
- status
- urgency
- assigned_to
- estimate_amount
- appointment_time
- notes
- custom_data
- created_at
- updated_at
```

The `custom_data` field can store business-specific values.

Example for a fleet-heavy auto shop:

```json
{
  "fleet_account_number": "FL-8821",
  "driver_name": "Jose",
  "truck_unit_number": "Unit 42"
}
```

Example for a European car shop:

```json
{
  "diagnostic_authorization": "approved",
  "warranty_vendor": "Endurance",
  "requires_oem_parts": true
}
```

Example for a tire shop:

```json
{
  "tire_size": "225/65R17",
  "dot_number": "DOT 3823",
  "alignment_requested": true
}
```

Same backend. Same table. Different fields per business.

## Custom field definitions

Do not only store random data in `custom_data`. ARKON also needs a table that defines what custom fields exist for each business, what they mean, and how they should be used.

Recommended table:

```text
custom_field_definitions
- id
- business_id
- vertical
- object_type
- field_key
- field_label
- field_type
- required
- show_on_intake
- show_on_owner_brief
- show_on_staff_handoff
- ai_can_ask
- ai_can_summarize
- created_at
- updated_at
```

Example:

```text
business_id: Mike's Auto
vertical: auto_repair
object_type: repair_request
field_key: fleet_account_number
field_label: Fleet Account Number
field_type: text
required: false
show_on_intake: true
show_on_owner_brief: true
show_on_staff_handoff: true
ai_can_ask: true
ai_can_summarize: true
```

This lets ARKON know:

- What to ask
- What to save
- What to show staff
- What to include in summaries
- What is required for that business
- What can be ignored for another business

## Workflow rules

Each business should also have workflow rules. These rules control how ARKON behaves for that specific business.

Recommended table:

```text
workflow_rules
- id
- business_id
- vertical
- trigger_event
- condition
- action
- escalation_target
- priority
- active
- created_at
- updated_at
```

Example rules:

```text
Shop A: Escalate estimates over $1,000 to Mike.
Shop B: Send fleet customers to Sarah.
Shop C: Never book appointments automatically. Only collect information and have the advisor call.
Shop D: Always ask for VIN and mileage.
Shop E: If the customer mentions brakes, mark urgency as high.
```

These should be configuration records, not hardcoded one-off logic unless absolutely necessary.

## Escalation rules

ARKON should know when not to answer and when to bring in a person.

Recommended table:

```text
escalation_rules
- id
- business_id
- vertical
- object_type
- trigger_phrase
- condition
- escalation_reason
- escalation_target_user_id
- escalation_target_role
- channel
- active
- created_at
- updated_at
```

Examples:

```text
Dental: Escalate anything clinical, insurance coverage-related, payment-dispute-related, or treatment-plan-related.
Law firm: Escalate anything requiring legal advice, legal judgment, deadline calculation, filing interpretation, or attorney review.
Auto repair: Escalate safety concerns, high-dollar estimates, angry customers, warranty disputes, and anything requiring diagnosis.
Gym: Escalate cancellation threats, injury issues, payment disputes, personal training complaints, and membership contract issues.
Salon: Escalate refund requests, service complaints, allergic reactions, disputed deposits, and stylist-specific conflicts.
```

## Business profile configuration

Each business should have a configuration profile.

Recommended table:

```text
business_profiles
- id
- business_id
- vertical
- business_name
- timezone
- primary_contact_name
- primary_contact_email
- primary_contact_phone
- default_voice
- approved_tone
- business_hours
- after_hours_behavior
- booking_policy
- escalation_policy
- owner_brief_frequency
- owner_brief_recipients
- created_at
- updated_at
```

This controls business-specific behavior without requiring code changes.

## Staff routing

Each business needs staff and routing configuration.

Recommended tables:

```text
staff_members
- id
- business_id
- name
- role
- email
- phone
- active
- created_at
- updated_at
```

```text
routing_rules
- id
- business_id
- vertical
- object_type
- condition
- route_to_staff_member_id
- route_to_role
- notification_channel
- active
- created_at
- updated_at
```

Examples:

```text
Auto repair: Route fleet accounts to Sarah.
Auto repair: Route estimates over $1,000 to Mike.
Salon: Route color correction requests to senior stylist.
Dental: Route appointment rescheduling to front desk.
Law firm: Route consult prep to assigned paralegal.
Gym: Route personal training interest to training manager.
```

## Vertical object examples

### Auto repair core objects

```text
customers
vehicles
repair_requests
estimates
declined_work
recommended_repairs
appointments
service_updates
follow_ups
advisor_handoffs
owner_briefs
```

### Salon core objects

```text
clients
appointments
service_requests
photo_intake
stylist_handoffs
consultation_requests
rebooking_follow_ups
no_show_follow_ups
same_day_openings
owner_briefs
```

### Dental core objects

```text
patients
appointment_requests
cancellations
no_shows
routine_reminders
patient_form_handoffs
front_desk_handoffs
schedule_gaps
owner_briefs
```

### Law firm core objects

```text
clients
matters
consult_requests
attorney_schedules
email_triage_items
document_requests
paralegal_handoffs
open_items
needs_review_items
daily_attorney_briefs
owner_briefs
```

### Gym and fitness studio core objects

```text
trial_leads
tour_requests
class_questions
personal_training_interest
member_follow_ups
cancellation_handoffs
retention_signals
staff_handoffs
owner_briefs
```

### Short-term rental core objects

```text
guests
reservations
stay_messages
cleaner_handoffs
vendor_handoffs
urgent_issues
check_in_support
check_out_support
host_escalations
owner_briefs
```

### Insurance core objects

```text
prospects
policyholders
quote_requests
renewal_follow_ups
document_requests
producer_handoffs
client_questions
carrier_updates
crm_updates
owner_briefs
```

### Real estate core objects

```text
leads
buyers
sellers
properties
showing_requests
listing_questions
buyer_follow_ups
seller_follow_ups
agent_handoffs
owner_briefs
```

### Home services core objects

```text
customers
job_requests
estimate_requests
photo_intake
addresses
crew_handoffs
job_updates
scheduling_changes
review_requests
owner_briefs
```

### Professional services core objects

```text
clients
intake_requests
appointments
document_requests
proposal_follow_ups
client_questions
team_handoffs
open_items
owner_briefs
```

## First build order

Do not try to build every vertical at once.

The recommended build order is:

```text
Step 1: Keep this backend architecture decision doc in the repo.
Step 2: Choose the first vertical backend, likely auto repair or salons.
Step 3: Define that vertical's core objects.
Step 4: Define the business configuration tables.
Step 5: Define custom fields.
Step 6: Define workflow rules.
Step 7: Build one working business inside that vertical.
Step 8: Add a second business in the same vertical to prove configuration works.
Step 9: Only then duplicate the pattern to another vertical.
```

The purpose of Step 8 is critical. The system is not proven until two businesses in the same vertical can operate differently without requiring a custom schema or separate backend for each business.

## AI assistant instructions

Any AI assistant working on ARKON backend should follow these instructions:

1. Read this document before proposing backend changes.
2. Do not assume ARKON is a generic chatbot.
3. Treat ARKON as a workflow operating layer for service businesses.
4. Keep the owner and staff in control.
5. Do not design business-specific database columns unless the field belongs to most of the vertical.
6. Use shared core fields plus `custom_data` for business-specific needs.
7. Use `custom_field_definitions` so custom data is understandable, validated, and useful.
8. Use `workflow_rules`, `escalation_rules`, and `routing_rules` so each business can behave differently.
9. Keep verticals separate enough to respect their unique workflows.
10. Keep businesses inside the same vertical configurable so ARKON can scale.
11. Build the first vertical deeply before copying the pattern to another vertical.
12. Always prove the design with at least two businesses in the same vertical.
13. Do not hardcode rules for one client unless there is a clear reason and the decision is documented.
14. Use audit logs for important AI actions, handoffs, escalations, and owner-visible summaries.
15. When uncertain, prefer configuration over branching code.

## Do not do this

Do not build this:

```text
One giant generic backend that ignores vertical differences.
```

Do not build this:

```text
A separate custom backend and custom schema for every client.
```

Do not build this:

```text
Tables full of client-specific columns.
```

Do not build this:

```text
Hardcoded one-off workflow logic that cannot be reused by another business in the same vertical.
```

## Build this instead

Build this:

```text
ARKON Core Pattern
│
├── Vertical backend services where needed
│
├── Shared core concepts
│
├── Vertical-specific objects
│
├── Business-level configuration
│
├── Custom field definitions
│
├── Workflow rules
│
├── Escalation rules
│
├── Staff routing rules
│
├── Audit logs
└── Owner briefs
```

The architecture should let ARKON say:

```text
This business is an auto shop.
This auto shop handles fleet customers differently.
This specific customer has a vehicle and repair request.
This request has core fields and custom fields.
This business requires VIN and mileage.
This estimate is over the escalation threshold.
This should be routed to Mike.
The owner should see this in the daily brief.
```

That is the backend reality ARKON needs.

## Final principle

The backend should be:

```text
Vertical-aware.
Business-configurable.
Owner-controlled.
Staff-friendly.
Audit-ready.
Scalable without becoming generic.
```

That is the architecture direction unless a future documented decision changes it.
