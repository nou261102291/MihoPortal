# Miho Portal Implementation Plan

## Purpose
This document defines the phased implementation plan to turn the Miho Portal prototype into a production-ready application.

## Current Assessment
The product direction is strong, but the implementation is still prototype-grade. The main issues are:
- Several user journeys are present visually but not fully completed end to end.
- Some screens and types are declared but not actually rendered or wired.
- Authentication is demo-only and not production-safe.
- State is mostly local to individual components instead of managed centrally.
- The repository has a TypeScript/configuration issue that must be fixed before production hardening.

## Phase 0: Stabilize the Codebase
### Goal
Make the project build cleanly and remove the most immediate release blockers.

### Scope
- Fix TypeScript and project configuration issues.
- Confirm the app builds without errors.
- Remove or reconcile dead route states and unused screen types.
- Establish a canonical source of truth for product requirements.

### Deliverables
- Clean build output.
- No unresolved config-level TypeScript errors.
- A single implementation reference document for app behavior.

### Exit Criteria
- App starts and builds reliably.
- Navigation states match actual rendered screens.
- No orphaned feature definitions remain in types without UI support.

## Phase 1: Core Architecture and State Model
### Goal
Replace scattered demo state with a predictable application structure.

### Scope
- Define shared state for user session, tickets, catalog items, RFQ/cart items, orders, and admin settings.
- Decide whether state is local, context-based, or API-backed.
- Establish common data contracts for machines, tickets, orders, and users.

### Deliverables
- Central data model for the application.
- Shared state layer or store.
- Consistent screen-to-data flow.

### Exit Criteria
- Actions on one screen persist and are reflected elsewhere.
- Screen updates are driven by shared state, not disconnected local component state.

## Phase 2: Authentication and RBAC
### Goal
Make access control real and role-driven.

### Scope
- Replace demo login behavior with production-safe auth flow.
- Ensure roles come from authenticated identity, not from a selectable dropdown.
- Lock navigation and screen access by role.
- Implement plant or tenant scoping where applicable.

### Deliverables
- Authentication flow with validation.
- Role-based menu rendering.
- Role-based screen access control.
- Logout and session reset behavior.

### Exit Criteria
- Users can only see and access screens allowed for their role.
- Demo shortcuts and fake role switching are removed from production flow.

## Phase 3: Core User Journeys
### Goal
Complete the highest-value workflows end to end.

### Scope
- Emergency ticket creation
- Spare parts catalog search and RFQ flow
- Ticket detail review and status update
- Admin order-on-behalf workflow
- Orders screen view and document actions
- Calendar and machine detail navigation if retained in scope

### Deliverables
- Ticket creation updates the ticket list.
- Ticket details persist changes back to shared state.
- RFQ/cart supports real item accumulation and checkout flow.
- Admin wizard produces a complete order summary and submission result.

### Exit Criteria
- Each main user journey begins and ends without dead ends.
- Success actions create visible state changes in the app.
- Empty, error, and success states are implemented for each flow.

## Phase 4: Admin and Operational Tooling
### Goal
Make the admin side functional enough for real operational use.

### Scope
- User management
- Machine registry
- Pricing and catalog management
- SLA configuration
- System settings
- Order generation and editing flows

### Deliverables
- Working admin subsections with data edits and saves.
- Usable forms, validation, and confirmation states.
- Bulk actions where required.
- Structured settings for support and maintenance operations.

### Exit Criteria
- Admin actions are not just visual placeholders.
- Changes can be reviewed, saved, and reflected in the app state.

## Phase 5: UX, Accessibility, and Reliability
### Goal
Turn the working product into something usable in real conditions.

### Scope
- Keyboard accessibility
- Focus states and modal behavior
- Escape-to-close and click-outside handling
- Responsive layouts
- Clear empty states and loading states
- Toast and error handling
- Visual consistency and spacing cleanup

### Deliverables
- Accessible interactive components.
- Responsive behavior across key screen sizes.
- Consistent UI states for modals, dropdowns, forms, and tables.

### Exit Criteria
- The app is usable with keyboard and mouse.
- No major layout breakage on smaller viewports.
- Users get clear feedback for success, failure, and empty results.

## Phase 6: Testing and Hardening
### Goal
Protect the implementation before release.

### Scope
- Add tests for the most important flows:
  - login
  - create emergency ticket
  - add RFQ items
  - submit admin order
  - update ticket status
- Add validation for forms and business rules.
- Verify role restrictions.
- Run build and type checks as release gates.

### Deliverables
- Automated coverage for critical flows.
- Release checklist.
- QA test matrix for manual verification.

### Exit Criteria
- Main journeys are protected by tests.
- Release blockers are visible before deployment.
- No untested, high-risk flow remains in the critical path.

## Recommended Priority Order
1. Stabilize the codebase.
2. Centralize app state.
3. Fix auth and RBAC.
4. Complete ticket, RFQ, and admin flows.
5. Harden accessibility and responsive behavior.
6. Add tests and release gates.

## Definition of Done
The portal is production-ready when:
- It builds cleanly.
- All major screens are wired to actual behavior.
- Role-based access is enforced.
- Shared data persists across related screens.
- Empty, error, and loading states exist.
- Critical journeys are tested.
- The UI is usable and consistent across target devices.

## Notes
This implementation should be treated as an MVP hardening effort, not a full rewrite. The fastest path is to preserve the current UI direction, fix the structural gaps, and then layer in production behavior behind it.