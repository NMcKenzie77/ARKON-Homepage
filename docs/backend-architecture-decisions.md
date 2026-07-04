# ARKON Backend and Frontend Architecture Decisions

This document is the permanent source of truth for the ARKON backend and frontend direction.

Do not rely on chat memory. Do not rely on the founder remembering the full architecture conversation. Do not rely on any one vertical repo, including the real estate repo, being available forever. Any AI assistant, developer, or future contributor should read this file before making backend or frontend decisions for ARKON.

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

---

# Backend architecture decision

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

## Shared ARKON core backend concepts

Even though each vertical can have a separate backend environment, ARKON should keep a shared mental model and shared core concepts.

Common ARKON backend concepts include:

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
routing_rules
audit_logs
owner_briefs
```

The name of the relationship record may change by vertical:

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
- display_order
- created_at
- updated_at
```

This lets ARKON know:

- What to ask
- What to save
- What to show staff
- What to include in summaries
- What is required for that business
- What can be ignored for another business
- What order fields should appear in the frontend

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

---

# Frontend architecture decision

## Core frontend decision

All ARKON vertical frontends should look and feel like the ARKON real estate frontend.

The real estate frontend is the reference UI standard for ARKON. It should be treated as the visual and interaction model, not as a one-off design locked only inside the real estate repo.

If the real estate repo disappears, breaks, gets renamed, or becomes unavailable, this document should still tell any AI assistant or developer what the frontend direction is.

The frontend decision is:

```text
Same ARKON product look and feel
Same shell and layout pattern
Same interaction style
Same visual language
Different fields per vertical
Different labels per vertical
Different object names per vertical
Different workflow screens per vertical
```

The frontend should not be redesigned from scratch for each vertical.

The frontend should use one shared ARKON interface system that renders different verticals based on configuration.

## What must stay consistent across verticals

Every ARKON vertical should feel like the same product.

Keep consistent:

- Left sidebar
- Top header
- Main workspace
- Search and filter area
- Record cards or tables
- Detail panel
- Action buttons
- Status badges
- Notes area
- Activity timeline
- AI summary panel
- Owner brief panel
- Handoff panel
- Modal style
- Button style
- Badge style
- Card style
- Form spacing
- Typography
- Color system
- Empty states
- Loading states
- Error states

The frontend should make a salon owner, auto shop owner, law firm, dental office, gym owner, or real estate agent feel like they are using ARKON, not a different product each time.

## What can change by vertical

The fields, objects, labels, workflows, and dashboards can change by vertical.

For real estate, the frontend may show:

```text
Lead
Buyer / seller
Property
Showing request
Price range
Bedrooms
Bathrooms
Timeline
Agent handoff
```

For auto repair, the frontend may show:

```text
Customer
Vehicle
Year / make / model
VIN
Mileage
Repair issue
Estimate status
Declined work
Advisor handoff
```

For salons, the frontend may show:

```text
Client
Service type
Stylist
Appointment request
Photo intake
Rebooking
No-show
Consultation needed
```

For dental, the frontend may show:

```text
Patient
Appointment request
Cancellation
No-show
Routine reminder
Form needed
Front desk handoff
```

For gyms, the frontend may show:

```text
Lead / member
Trial interest
Tour request
Personal training interest
Cancellation risk
Class question
Staff handoff
```

The product shell stays the same. The data and language change.

## Frontend structure

The correct frontend structure is:

```text
ARKON Frontend Shell
│
├── Shared layout
├── Shared navigation
├── Shared cards
├── Shared tables
├── Shared forms
├── Shared badges
├── Shared detail panels
├── Shared AI summary panel
├── Shared owner brief panel
├── Shared handoff panel
├── Shared activity timeline
└── Vertical-specific field configuration
```

The wrong structure is:

```text
A completely separate custom frontend design for every vertical.
```

The right structure is:

```text
One ARKON interface system
Many vertical configurations
Many business configurations
```

## Configuration-driven frontend rendering

The frontend should eventually render vertical-specific screens using configuration instead of hardcoding every vertical screen from scratch.

Example vertical config:

```json
{
  "vertical": "auto_repair",
  "display_name": "Auto Repair",
  "primary_record": "repair_request",
  "relationship_label": "Customer",
  "fields": [
    { "key": "customer_name", "label": "Customer name", "type": "text", "required": true },
    { "key": "phone", "label": "Phone", "type": "phone", "required": true },
    { "key": "vehicle_year", "label": "Vehicle year", "type": "number" },
    { "key": "vehicle_make", "label": "Make", "type": "text" },
    { "key": "vehicle_model", "label": "Model", "type": "text" },
    { "key": "mileage", "label": "Mileage", "type": "number" },
    { "key": "issue_description", "label": "Issue description", "type": "textarea" },
    { "key": "urgency", "label": "Urgency", "type": "select" },
    { "key": "estimate_status", "label": "Estimate status", "type": "select" },
    { "key": "assigned_advisor", "label": "Assigned advisor", "type": "staff_select" }
  ]
}
```

The frontend should use this kind of configuration to know:

- What fields to render
- What labels to display
- Which fields are required
- Which fields are visible in intake
- Which fields appear in cards
- Which fields appear in detail panels
- Which fields appear in owner briefs
- Which actions should be available
- Which statuses and badges matter for that vertical

## Frontend relationship to custom fields

The frontend must respect the backend custom field model.

If a business has custom fields defined in `custom_field_definitions`, the frontend should be able to render those fields without a new custom page.

Example:

```text
Business A in auto repair requires VIN and mileage.
Business B in auto repair requires fleet account number and truck unit number.
Business C in auto repair requires tire size and alignment requested.
```

The frontend should not need three separate custom forms.

It should render the core auto repair fields plus each business's custom fields.

This means the frontend depends on:

```text
vertical_config
business_profile
custom_field_definitions
workflow_rules
routing_rules
escalation_rules
```

## Real estate frontend as the visual reference

The real estate frontend should be treated as the visual model for:

```text
Left navigation
Dashboard layout
Record list
Record cards
Record detail panel
Action buttons
Status badges
Forms
Modals
Search/filter controls
AI summary area
Owner/admin feel
Spacing
Typography
Color system
```

Future verticals should not invent a new visual identity unless the founder explicitly changes this decision in this document.

The rule is:

> Make every vertical look like ARKON. Do not make every vertical look like a separate startup.

## Frontend build order

Do not build every frontend from scratch.

Recommended frontend build order:

```text
Step 1: Treat the real estate frontend as the reference UI.
Step 2: Document or extract the shared shell and shared components.
Step 3: Define the shared ARKON design system.
Step 4: Define vertical field configs.
Step 5: Build one second vertical using the same shell.
Step 6: Prove that different fields can render without redesign.
Step 7: Add a second business inside that same vertical with custom fields.
Step 8: Prove the frontend can show different business fields without a custom frontend.
Step 9: Only then duplicate the pattern to other verticals.
```

The frontend is not proven until two businesses inside the same vertical can show different fields while still using the same interface.

## Frontend AI assistant instructions

Any AI assistant working on ARKON frontend should follow these instructions:

1. Read this document before proposing frontend changes.
2. Do not assume each vertical needs a new design.
3. Use the real estate frontend as the ARKON reference UI.
4. Keep the same visual language across verticals.
5. Change fields, labels, objects, and workflow language by vertical.
6. Do not redesign the shell for every vertical.
7. Prefer configuration-driven forms and tables.
8. Respect backend `custom_field_definitions`.
9. Support business-specific custom fields without creating business-specific frontend code whenever possible.
10. Keep owner/staff control visible.
11. Keep handoffs, notes, activity, and AI summaries consistent.
12. Do not let vertical-specific wording turn into a separate visual product.
13. When uncertain, preserve the ARKON look and change the data configuration.

## Do not do this on the frontend

Do not build this:

```text
A totally different frontend design for every vertical.
```

Do not build this:

```text
A totally different frontend design for every business.
```

Do not build this:

```text
Hardcoded one-off forms that cannot render custom fields from configuration.
```

Do not build this:

```text
A generic blank UI that loses the real estate frontend's polished ARKON feel.
```

## Build this on the frontend instead

Build this:

```text
ARKON Frontend System
│
├── Real-estate-inspired reference shell
├── Shared layout
├── Shared components
├── Shared design tokens
├── Vertical field configs
├── Business custom field rendering
├── Shared AI summary panels
├── Shared handoff panels
├── Shared owner brief panels
├── Shared activity timelines
└── Vertical-specific labels and objects
```

The frontend architecture should let ARKON say:

```text
This user is looking at an auto repair business.
Use the ARKON shell.
Use the auto repair labels.
Render customers, vehicles, repair requests, estimates, declined work, and advisor handoffs.
This specific shop also requires VIN and mileage.
Render those custom fields.
Keep the UI looking like ARKON.
```

---

# Combined product principle

The full ARKON architecture should be:

```text
Backend: Vertical-aware and business-configurable.
Frontend: Visually consistent and configuration-driven.
Product: Owner-controlled, staff-friendly, audit-ready, and scalable without becoming generic.
```

That is the architecture direction unless a future documented decision changes it.
