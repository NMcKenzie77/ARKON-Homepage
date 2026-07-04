# ARKON Auth Gateway Build Plan

This document defines the future login and routing system for ArkonsysAI.

The goal is simple:

```text
One public ARKON website.
One login entry point.
Backend identifies the user.
Backend checks RBAC.
Frontend sends the user to the correct company and vertical experience.
```

## Product decision

ArkonsysAI should not require users to remember separate URLs for each company or vertical.

The user should start at the main ARKON site:

```text
arkonsysai.com
```

Then they click:

```text
Login
```

After login, ARKON decides where they belong.

## Correct architecture

```text
arkonsysai.com
│
├── Public marketing website
│
└── Login
    │
    ├── email and password
    ├── optional magic link
    └── authenticated app
        │
        ├── backend identifies user
        ├── backend checks business memberships
        ├── backend checks role and permissions
        ├── backend identifies company
        ├── backend identifies vertical
        └── frontend loads correct company dashboard or workspace
```

## What this is not

This is not public company search.

This is not one URL per company.

This is not one login system inside every vertical repo.

This is not AutoRepair-specific.

This is the main ARKON authentication gateway.

## Repo placement

This belongs in the ArkonsysAI frontend repo.

Current repo:

```text
NMcKenzie77/ARKON-Homepage
```

Vertical repos should not own the main login entry.

Examples:

```text
ARKON-AutoRepair should not own the main login.
ARKON-Salons should not own the main login.
ARKON-BotLab should not own the main login.
Paperclip should not own the main login.
```

## Recommended routes

Marketing routes:

```text
/                  Public homepage
/salons            Public vertical page
/garages           Public vertical page
/real-estate       Public vertical page
/insurance         Public vertical page
```

Authentication routes:

```text
/login             Main ARKON login page
/login/magic       Magic link request page or modal
/auth/callback     Magic link callback handler
/logout            Logout route
```

Authenticated app routes:

```text
/app                         Authenticated app entry
/app/select-business          Shown only when user has multiple business memberships
/app/dashboard                Default role-aware dashboard
/app/:businessId/dashboard    Optional explicit business dashboard route
/app/:businessId/settings     Business settings if permission allows
```

Do not make users start with a company slug unless we later add optional direct invite links.

## Login flow

### Standard login

```text
1. User visits arkonsysai.com.
2. User clicks Login.
3. User enters email and password.
4. Frontend sends credentials to backend.
5. Backend validates credentials.
6. Backend creates session.
7. Frontend calls GET /api/me.
8. Backend returns user, memberships, roles, and permissions.
9. If user has one business, send user directly to that workspace.
10. If user has multiple businesses, show business selector.
```

### Magic link login

```text
1. User clicks Login.
2. User enters email.
3. User clicks Send magic link.
4. Backend checks whether email belongs to an active user.
5. Backend sends secure magic link if user exists.
6. User clicks link.
7. Backend validates token.
8. Backend creates session.
9. Frontend calls GET /api/me.
10. Frontend routes user based on memberships and RBAC.
```

Important rule:

```text
Do not reveal whether an email exists.
```

The user-facing response should be:

```text
If that email is authorized, we sent a login link.
```

## Backend-owned RBAC

RBAC must be enforced by the backend.

The frontend can hide buttons and pages for convenience, but the backend must be the source of truth.

Required backend concepts:

```text
users
businesses
business_memberships
roles
permissions
role_permissions
sessions
magic_links
login_events
invitations
```

## Core tables

### users

```text
id
email
password_hash
name
status
last_login_at
created_at
updated_at
```

### businesses

```text
id
business_name
vertical_slug
status
created_at
updated_at
```

### business_memberships

```text
id
user_id
business_id
role_key
status
created_at
updated_at
```

### roles

```text
id
role_key
role_label
scope
created_at
updated_at
```

### permissions

```text
id
permission_key
description
created_at
updated_at
```

### role_permissions

```text
id
role_key
permission_key
created_at
updated_at
```

### sessions

```text
id
user_id
session_token_hash
expires_at
created_at
revoked_at
```

### magic_links

```text
id
user_id
email
token_hash
expires_at
used_at
created_at
```

### login_events

```text
id
user_id
email
success
method
ip_address
user_agent
created_at
```

### invitations

```text
id
business_id
email
role_key
invited_by_user_id
status
expires_at
created_at
accepted_at
```

## Role examples

Platform-level roles:

```text
platform_admin
platform_support
vertical_admin
```

Business-level roles:

```text
business_owner
manager
staff
front_desk
viewer
```

AutoRepair display labels can map to the same RBAC engine:

```text
owner
manager
service_advisor
technician
front_desk
```

Real estate display labels can map to the same RBAC engine:

```text
broker
agent
admin
assistant
viewer
```

The backend should enforce permission keys. The frontend can display vertical-specific role labels.

## Permission examples

```text
view_dashboard
view_customers
manage_customers
view_staff
manage_staff
view_owner_briefs
manage_business_settings
view_handoffs
manage_handoffs
view_audit_logs
manage_integrations
view_billing
manage_billing
```

Vertical-specific permissions can be added later.

AutoRepair examples:

```text
view_repair_requests
manage_repair_requests
view_vehicles
manage_vehicles
view_estimates
manage_estimates
```

## Backend API contract

Minimum endpoints:

```text
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/magic-link/request
GET  /api/auth/magic-link/callback
GET  /api/me
GET  /api/my-businesses
POST /api/session/select-business
GET  /api/current-workspace
```

Optional later endpoints:

```text
POST /api/invitations
GET  /api/invitations/:token
POST /api/invitations/:token/accept
POST /api/users/:userId/disable
POST /api/businesses/:businessId/members
PATCH /api/businesses/:businessId/members/:membershipId
```

## GET /api/me response

Example:

```json
{
  "user": {
    "id": "user_123",
    "email": "owner@mikesauto.com",
    "name": "Mike",
    "status": "active"
  },
  "memberships": [
    {
      "businessId": "11111111-1111-1111-1111-111111111111",
      "businessName": "Mike's Auto Shop",
      "vertical": "auto_repair",
      "role": "business_owner",
      "roleLabel": "Owner",
      "permissions": [
        "view_dashboard",
        "view_repair_requests",
        "manage_repair_requests",
        "view_owner_briefs",
        "manage_staff"
      ]
    }
  ]
}
```

## Frontend routing behavior after login

After login, frontend should call:

```text
GET /api/me
```

Then apply these rules:

```text
If user has zero active memberships:
    show unauthorized or pending access screen

If user has one active membership:
    select that business automatically
    load correct vertical experience

If user has more than one active membership:
    show business selector
    user chooses workspace
    backend stores selected business in session
    load correct vertical experience
```

## Business selector screen

Only show this if the user belongs to multiple businesses.

The selector should show:

```text
business name
vertical label
role label
status
```

Example:

```text
Mike's Auto Shop
Auto Repair
Owner

Fleet Repair Center
Auto Repair
Fleet Advisor

Jenn's STR Portfolio
Short-Term Rentals
Owner
```

## Current workspace resolver

After business selection, frontend calls:

```text
GET /api/current-workspace
```

Backend returns:

```json
{
  "business": {
    "id": "11111111-1111-1111-1111-111111111111",
    "name": "Mike's Auto Shop",
    "vertical": "auto_repair"
  },
  "role": "business_owner",
  "permissions": [],
  "verticalConfig": {},
  "branding": {},
  "featureFlags": {}
}
```

## Vertical resolver

The authenticated portal should use the business vertical to load the correct experience.

```text
auto_repair        → AutoRepair dashboard
salon              → Salon dashboard
dental             → Dental dashboard
law_firm           → Law Firm dashboard
gym                → Gym dashboard
real_estate        → Real Estate dashboard
insurance          → Insurance dashboard
short_term_rental  → Short-Term Rental dashboard
```

Early version can use placeholders for verticals that are not built yet.

## Magic link rules

Magic links should:

```text
expire quickly
be single-use
store only token hash
not expose raw token after creation
create login event
create session only after validation
redirect to /app after success
```

Recommended expiration:

```text
15 minutes
```

## Security rules

```text
Use email, not username, as the login identifier.
Hash passwords.
Hash session tokens.
Hash magic link tokens.
Never log raw passwords.
Never log raw magic link tokens.
Do not reveal whether an email exists.
Rate-limit login attempts.
Rate-limit magic link requests.
Store login events.
Backend must enforce RBAC on every protected endpoint.
Frontend visibility is not security.
```

## Build phases

### Phase 1: Document and design

```text
Create this build document.
Confirm login-first model.
Confirm backend-owned RBAC.
Confirm frontend routes.
```

### Phase 2: Backend auth foundation

```text
Create users table.
Create sessions table.
Create login_events table.
Create password login endpoint.
Create logout endpoint.
Create GET /api/me.
```

### Phase 3: Business membership and RBAC

```text
Create businesses table.
Create business_memberships table.
Create roles table.
Create permissions table.
Create role_permissions table.
Return memberships and permissions from GET /api/me.
```

### Phase 4: Frontend login page

```text
Add Login button to public header.
Create /login page.
Create email and password form.
Handle login success.
Call GET /api/me.
Route based on memberships.
```

### Phase 5: Workspace selector

```text
Create /app/select-business.
Show selector only for users with more than one business.
Create POST /api/session/select-business.
Redirect to /app/dashboard after selection.
```

### Phase 6: Vertical dashboard resolver

```text
Create /app/dashboard.
Call GET /api/current-workspace.
Read vertical_slug.
Load correct dashboard shell or placeholder.
```

### Phase 7: Magic link

```text
Create magic_links table.
Create POST /api/auth/magic-link/request.
Create callback validation.
Send email with login link.
Redirect to /app after success.
```

### Phase 8: Invitations

```text
Create invitations table.
Allow business owner or admin to invite users.
Invite user to business with role.
User accepts invite and creates account or links existing account.
```

## Definition of done for v1

```text
1. Main site has Login button.
2. User can log in with email and password.
3. Backend returns user memberships and permissions.
4. User with one business goes directly to dashboard.
5. User with multiple businesses sees selector.
6. Backend stores selected business in session.
7. Dashboard loads based on selected business vertical.
8. Backend blocks unauthorized access.
9. Login events are stored.
10. Magic link plan is ready, even if built after password login.
```

## Do not build first

Do not build these first:

```text
custom domains
public company search
customer-facing unauthenticated portals
full billing system
all vertical dashboards
complex SSO
multi-factor authentication
```

Those can come later.

## Final decision

The ARKON portal is login-first.

Users should go to the main site, click Login, authenticate, and let the backend decide which company, role, permissions, and vertical experience they should see.
