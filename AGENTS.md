# Repository Instructions

Before working in this repository, read the canonical owner instructions in `NMcKenzie77/NMcKenzie77-ARKON-Control-Room/OWNER_OPERATING_MANUAL.md`.

## Mandatory client deployment-model gate

Before onboarding or provisioning any client, ask:

> **Should this client use the shared multi-company environment, or a dedicated solo environment?**

Do not infer the answer. Do not create tenants, owners, invitations, databases, Railway resources, domains, messaging numbers, billing, live communications, or customer data migrations until the owner confirms the deployment model or a documented exception already exists.

### Shared multi-company environment

- Use the shared application and infrastructure.
- Create a separate tenant or organization record.
- Enforce tenant isolation on every customer-owned record and request.
- Resolve customer context from authenticated database records and trusted service contracts, not customer-specific environment variables.

### Dedicated solo environment

- Use the same maintained product codebase unless a code fork is explicitly approved.
- Provision separate approved runtime resources, database, secrets, domains, backups, and monitoring.
- Keep the dedicated client's identity and configuration out of the shared production environment.
- Document the authoritative repository, branch, Railway project, environment, service, database, and domain.

### Exceptions

- Invicta is excluded from this mandatory question unless the owner later changes that instruction.
- Any additional repository or client explicitly designated by the owner as excluded or pre-decided follows that recorded exception.
- Record every confirmed deployment choice in repository deployment documentation and, when applicable, the ARKON Platform company record.