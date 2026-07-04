# ARKON Implementation Build Plan

This is the practical build playbook for turning the ARKON architecture into working software.

Read this after reading:

```text
docs/backend-architecture-decisions.md
```

That file explains the product and architecture decisions. This file explains how to actually start building the system.

## The most important build rule

Do not start by building every vertical.

Start with one vertical and prove the pattern with two businesses inside that same vertical.

The system is not proven until ARKON can support two businesses in the same vertical that operate differently without creating a custom backend or custom frontend for each one.

Recommended first verticals:

```text
Option 1: Auto repair
Option 2: Salons
Option 3: Gyms and fitness studios
```

Auto repair is a strong first vertical because the workflow differences are easy to see:

```text
Shop A may be a general repair shop.
Shop B may be a fleet-heavy shop.
Shop C may be a tire shop.
Shop D may be a European diagnostics shop.
```

That makes it a good test of core fields, custom fields, routing rules, escalation rules, and frontend rendering.

## Phase 0: Repo setup

Create a backend workspace that can eventually support vertical-specific deployments.

Recommended structure:

```text
/apps
  /web
    marketing site or shared frontend shell
  /api-auto-repair
    auto repair backend service
  /api-salons
    salons backend service later
  /api-gyms
    gyms backend service later

/packages
  /core
    shared ARKON domain types, utilities, auth helpers, validation helpers
  /ui
    shared ARKON frontend components and design system
  /vertical-configs
    vertical field configs and object configs
  /db
    migrations, schema helpers, seeds

docs
  backend-architecture-decisions.md
  arkon-implementation-plan.md
```

If the project stays simpler at first, the same idea can be started with fewer folders:

```text
/server
  app.js
  routes
  services
  db
  verticals

/frontend
  src
    components
    layouts
    verticals
    configs
```

The key is not the exact folder structure. The key is keeping these concerns separate:

```text
Shared ARKON core
Vertical-specific objects
Business-specific configuration
Shared frontend shell
Vertical field configs
```

## Phase 1: Choose the first vertical

Pick one vertical for the first real backend and frontend proof.

Recommended choice:

```text
auto_repair
```

Reason:

Auto repair gives ARKON a clear proof case for:

- Customer intake
- Vehicle details
- Repair requests
- Estimate follow-up
- Declined work
- Advisor handoffs
- Owner briefs
- Shop-specific custom fields
- Shop-specific routing rules
- Shop-specific escalation rules

## Phase 2: Build the first vertical backend service

Create one Railway service for the first vertical.

Recommended Railway service name:

```text
arkon-auto-repair-api
```

Recommended environment variables:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=...
APP_BASE_URL=https://...
OPENAI_API_KEY=...
RESEND_API_KEY=...
POSTMARK_SERVER_TOKEN=...
```

Do not put client-specific logic in environment variables unless it is truly secret, such as API keys. Business behavior belongs in database configuration.

## Phase 3: Create core database tables

Use PostgreSQL if possible.

Minimum tables for the first vertical proof:

```text
businesses
business_profiles
users
staff_members
contacts
conversations
messages
tasks
handoffs
audit_logs
owner_briefs
custom_field_definitions
workflow_rules
escalation_rules
routing_rules
```

Auto repair-specific tables:

```text
vehicles
repair_requests
estimates
declined_work
recommended_repairs
appointments
service_updates
follow_ups
```

## Phase 4: Minimum SQL schema for proof of concept

This is not final enterprise schema. This is the first practical schema to prove the architecture.

```sql
create table businesses (
  id uuid primary key default gen_random_uuid(),
  vertical text not null,
  name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table business_profiles (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  timezone text not null default 'America/New_York',
  primary_contact_name text,
  primary_contact_email text,
  primary_contact_phone text,
  default_voice text,
  approved_tone text,
  business_hours jsonb not null default '{}'::jsonb,
  after_hours_behavior text,
  booking_policy text,
  escalation_policy text,
  owner_brief_frequency text not null default 'daily',
  owner_brief_recipients jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table users (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  email text not null,
  name text,
  role text not null default 'staff',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table staff_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  role text not null,
  email text,
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table contacts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  display_name text not null,
  phone text,
  email text,
  relationship_type text not null default 'customer',
  status text not null default 'active',
  custom_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table vehicles (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  contact_id uuid references contacts(id) on delete set null,
  year text,
  make text,
  model text,
  vin text,
  mileage integer,
  license_plate text,
  custom_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table repair_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  contact_id uuid references contacts(id) on delete set null,
  vehicle_id uuid references vehicles(id) on delete set null,
  request_type text,
  status text not null default 'new',
  urgency text not null default 'normal',
  assigned_staff_id uuid references staff_members(id) on delete set null,
  issue_description text,
  estimate_amount numeric(12,2),
  appointment_time timestamptz,
  notes text,
  custom_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table custom_field_definitions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  vertical text not null,
  object_type text not null,
  field_key text not null,
  field_label text not null,
  field_type text not null default 'text',
  required boolean not null default false,
  show_on_intake boolean not null default true,
  show_on_owner_brief boolean not null default false,
  show_on_staff_handoff boolean not null default true,
  ai_can_ask boolean not null default true,
  ai_can_summarize boolean not null default true,
  display_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, object_type, field_key)
);

create table workflow_rules (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  vertical text not null,
  trigger_event text not null,
  condition jsonb not null default '{}'::jsonb,
  action jsonb not null default '{}'::jsonb,
  escalation_target text,
  priority integer not null default 100,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table escalation_rules (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  vertical text not null,
  object_type text,
  trigger_phrase text,
  condition jsonb not null default '{}'::jsonb,
  escalation_reason text not null,
  escalation_target_user_id uuid references users(id) on delete set null,
  escalation_target_role text,
  channel text not null default 'email',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table routing_rules (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  vertical text not null,
  object_type text not null,
  condition jsonb not null default '{}'::jsonb,
  route_to_staff_member_id uuid references staff_members(id) on delete set null,
  route_to_role text,
  notification_channel text not null default 'email',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table conversations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  contact_id uuid references contacts(id) on delete set null,
  channel text not null,
  subject text,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  conversation_id uuid references conversations(id) on delete cascade,
  direction text not null,
  sender_name text,
  sender_contact text,
  body text not null,
  ai_generated boolean not null default false,
  created_at timestamptz not null default now()
);

create table handoffs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  contact_id uuid references contacts(id) on delete set null,
  object_type text not null,
  object_id uuid,
  assigned_staff_id uuid references staff_members(id) on delete set null,
  status text not null default 'open',
  reason text,
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  actor_type text not null,
  actor_id text,
  action text not null,
  object_type text,
  object_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table owner_briefs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  brief_type text not null default 'daily',
  title text not null,
  body text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
```

## Phase 5: Seed two businesses in the same vertical

The first proof should include two auto shops that operate differently.

### Business A: General Auto Shop

```text
Name: Mike's Auto Shop
Type: general auto repair
Rules:
- Ask for vehicle year, make, model, mileage, issue description, and preferred appointment time.
- Escalate estimates over $1,000 to Mike.
- Escalate angry customers or safety-related issues.
- Do not promise diagnosis.
```

Custom fields:

```text
vin
mileage
preferred_dropoff_time
```

### Business B: Fleet Repair Center

```text
Name: Fleet Repair Center
Type: fleet-heavy repair shop
Rules:
- Always ask for fleet account number.
- Always ask for unit number.
- Route fleet accounts to Sarah.
- Ask for driver name and vehicle downtime urgency.
- Escalate same-day downtime requests.
```

Custom fields:

```text
fleet_account_number
truck_unit_number
driver_name
downtime_urgency
```

This proves that one vertical backend can support different businesses through configuration.

## Phase 6: Backend API endpoints

Build these endpoints first.

### Business and config endpoints

```text
GET /api/me
GET /api/businesses/:businessId
GET /api/businesses/:businessId/profile
GET /api/businesses/:businessId/vertical-config
GET /api/businesses/:businessId/custom-fields
GET /api/businesses/:businessId/workflow-rules
GET /api/businesses/:businessId/escalation-rules
GET /api/businesses/:businessId/routing-rules
```

### Auto repair endpoints

```text
GET /api/businesses/:businessId/contacts
POST /api/businesses/:businessId/contacts
GET /api/businesses/:businessId/vehicles
POST /api/businesses/:businessId/vehicles
GET /api/businesses/:businessId/repair-requests
POST /api/businesses/:businessId/repair-requests
GET /api/businesses/:businessId/repair-requests/:requestId
PATCH /api/businesses/:businessId/repair-requests/:requestId
```

### Operational endpoints

```text
GET /api/businesses/:businessId/conversations
GET /api/businesses/:businessId/handoffs
PATCH /api/businesses/:businessId/handoffs/:handoffId
GET /api/businesses/:businessId/owner-briefs
POST /api/businesses/:businessId/owner-briefs/generate
GET /api/businesses/:businessId/audit-logs
```

### AI workflow endpoint

```text
POST /api/businesses/:businessId/ai/intake
```

This endpoint should:

```text
1. Load business profile.
2. Load vertical config.
3. Load custom field definitions.
4. Load workflow rules.
5. Load escalation rules.
6. Read the incoming message or intake payload.
7. Extract core fields.
8. Extract custom fields.
9. Decide whether to answer, ask follow-up, create handoff, or escalate.
10. Save conversation/message records.
11. Save or update the relevant object, such as repair_request.
12. Write audit log.
13. Return the response and next action.
```

## Phase 7: Frontend shell

The frontend should look like the ARKON real estate frontend.

Build a shared shell first:

```text
AppShell
Sidebar
TopHeader
DashboardCards
RecordList
RecordDetailPanel
DynamicForm
StatusBadge
ActivityTimeline
AISummaryPanel
OwnerBriefPanel
HandoffPanel
Modal
```

Recommended frontend folder structure:

```text
/src
  /components
    AppShell.jsx
    Sidebar.jsx
    TopHeader.jsx
    RecordList.jsx
    RecordDetailPanel.jsx
    DynamicForm.jsx
    StatusBadge.jsx
    ActivityTimeline.jsx
    AISummaryPanel.jsx
    OwnerBriefPanel.jsx
    HandoffPanel.jsx
  /verticals
    autoRepairConfig.js
    salonConfig.js
    gymConfig.js
  /pages
    Dashboard.jsx
    Records.jsx
    RecordDetail.jsx
    Settings.jsx
  /api
    client.js
  /styles
    theme.css
```

## Phase 8: Vertical config for auto repair frontend

Start with this config shape:

```js
export const autoRepairConfig = {
  vertical: 'auto_repair',
  displayName: 'Auto Repair',
  relationshipLabel: 'Customer',
  primaryRecord: 'repair_request',
  sidebar: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Repair Requests', path: '/repair-requests' },
    { label: 'Customers', path: '/customers' },
    { label: 'Vehicles', path: '/vehicles' },
    { label: 'Handoffs', path: '/handoffs' },
    { label: 'Owner Briefs', path: '/owner-briefs' },
    { label: 'Settings', path: '/settings' }
  ],
  fields: {
    repair_request: [
      { key: 'customer_name', label: 'Customer name', type: 'text', required: true, showOnCard: true },
      { key: 'phone', label: 'Phone', type: 'phone', required: true, showOnCard: true },
      { key: 'vehicle_year', label: 'Vehicle year', type: 'number', showOnCard: false },
      { key: 'vehicle_make', label: 'Make', type: 'text', showOnCard: true },
      { key: 'vehicle_model', label: 'Model', type: 'text', showOnCard: true },
      { key: 'mileage', label: 'Mileage', type: 'number', showOnCard: false },
      { key: 'issue_description', label: 'Issue description', type: 'textarea', required: true, showOnCard: true },
      { key: 'urgency', label: 'Urgency', type: 'select', options: ['low', 'normal', 'high', 'urgent'], showOnCard: true },
      { key: 'estimate_status', label: 'Estimate status', type: 'select', options: ['not_started', 'requested', 'sent', 'approved', 'declined'], showOnCard: true },
      { key: 'assigned_advisor', label: 'Assigned advisor', type: 'staff_select', showOnCard: true }
    ]
  },
  statuses: {
    repair_request: ['new', 'waiting_on_customer', 'needs_staff', 'scheduled', 'closed']
  }
};
```

The frontend should then merge this vertical config with `custom_field_definitions` from the backend.

Example:

```text
renderedFields = verticalCoreFields + businessCustomFields
```

## Phase 9: Dynamic form behavior

The `DynamicForm` component should accept field definitions and render the right inputs.

Minimum supported field types:

```text
text
textarea
number
phone
email
date
datetime
select
multi_select
checkbox
currency
staff_select
```

DynamicForm should:

```text
1. Render core vertical fields.
2. Render business custom fields.
3. Validate required fields.
4. Save core fields to normal columns.
5. Save custom fields into custom_data.
6. Preserve field order using display_order.
```

## Phase 10: First working user flow

The first complete working flow should be:

```text
1. User opens ARKON auto repair dashboard.
2. User selects Mike's Auto Shop.
3. Dashboard loads repair requests, handoffs, and owner brief items.
4. User creates a repair request.
5. Form shows core auto repair fields plus Mike's custom fields.
6. User switches to Fleet Repair Center.
7. Same frontend shell loads.
8. Form now shows fleet custom fields.
9. A fleet request routes to Sarah based on routing rules.
10. An estimate over $1,000 escalates based on workflow rules.
11. Both actions appear in audit logs and owner briefs.
```

This is the first proof that the architecture works.

## Phase 11: AI behavior for first proof

Do not start with a complicated autonomous agent.

Start with controlled intake support.

The AI should be able to:

```text
1. Read the business profile.
2. Read custom field definitions.
3. Ask for missing required fields.
4. Extract repair request details.
5. Identify escalation conditions.
6. Create or update a repair request.
7. Create a handoff when needed.
8. Summarize the request for staff.
9. Write an audit log.
```

The AI should not:

```text
Diagnose vehicles.
Promise pricing.
Approve repairs.
Make legal, medical, insurance, or financial decisions in other verticals.
Ignore escalation rules.
Act without an audit trail.
```

## Phase 12: Owner brief

Build a simple owner brief generator.

The owner brief should include:

```text
New requests
Urgent requests
Requests waiting on staff
Requests waiting on customer
Escalations
Follow-up gaps
Revenue-related items, such as high estimates or declined work
```

For auto repair, example owner brief:

```text
Owner Brief: Mike's Auto Shop

Needs attention:
- Maria Lopez asked about brake noise and needs a callback.
- James Smith has an estimate over $1,000 and needs Mike review.
- Fleet account FL-8821 has downtime urgency and was routed to Sarah.

Follow-up gaps:
- Two estimate requests have had no update in 24 hours.
- One declined repair should be followed up this week.
```

## Phase 13: Audit logs

Every important AI or workflow action must create an audit log.

Audit log examples:

```text
AI extracted repair request details.
AI asked customer for missing mileage.
AI created handoff for advisor review.
AI escalated estimate over threshold.
Routing rule sent fleet account to Sarah.
Owner brief generated.
Staff changed request status.
```

Do not skip audit logs. ARKON is owner-controlled and audit-ready.

## Phase 14: What not to build first

Do not build these first:

```text
Every vertical at once
A fully autonomous agent
A custom backend per client
A custom frontend per client
Complex integrations before the core flow works
A giant CRM before repair request flow works
Billing/subscriptions before product proof
```

## Phase 15: Definition of done for the first proof

The first proof is done when all of this works:

```text
1. One vertical backend exists.
2. Two businesses exist inside that vertical.
3. The businesses have different custom fields.
4. The businesses have different routing rules.
5. The businesses have different escalation rules.
6. The same frontend shell renders both businesses.
7. The same form component renders different fields per business.
8. A repair request can be created.
9. A handoff can be created.
10. An escalation can be triggered.
11. An owner brief can be generated.
12. Audit logs record the important actions.
```

After that, build the second vertical by copying the pattern, not by starting over.

## Phase 16: Second vertical pattern

Once auto repair works, the second vertical should use the same structure:

```text
New vertical backend service
Same shared core concepts
New vertical objects
New vertical config
Same frontend shell
New labels and fields
Business-specific custom fields
Business-specific rules
```

For example, salons:

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

The same proof rule applies:

```text
Build two salon businesses that operate differently before calling the salon vertical proven.
```

## Final instruction for future AI assistants

When the founder says:

```text
continue building ARKON
```

Do this:

```text
1. Read docs/backend-architecture-decisions.md.
2. Read docs/arkon-implementation-plan.md.
3. Identify the current first vertical.
4. Check whether the first proof has two businesses.
5. Continue the build from the first incomplete phase.
6. Do not redesign the architecture without documenting the decision.
```

The practical first build is:

```text
Auto repair vertical backend
Two auto repair businesses
Configuration-driven backend behavior
Real-estate-style shared frontend shell
Dynamic fields from vertical config plus business custom fields
Owner briefs
Audit logs
```
