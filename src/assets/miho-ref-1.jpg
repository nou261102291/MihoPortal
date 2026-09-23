# MIHO B2B PROCUREMENT & SERVICE MANAGEMENT PORTAL
## FINAL CONSOLIDATED PROPOSAL & TECHNICAL MASTER PLAN

---

# PART 1: BUSINESS AND TECHNICAL PROPOSAL

**DOCUMENT CONTROL**
**Date:** September 12, 2026
**Prepared By:** Principal Technical Consultant & B2B Solutions Architect
**Prepared For:** Executive Leadership, Miho Inspection Systems Ltd Nigeria
**Subject:** Business and Technical Proposal for the Miho B2B Procurement & Service Management Portal

---

## 1. EXECUTIVE SUMMARY

### The Challenge in Nigerian Brewery Automation Support
In the high-speed, high-volume environment of Nigeria’s premier breweries—specifically Nigerian Bottling Company (NBC), AB InBev (International Breweries), and Champions Brewery—production downtime is measured in thousands of Naira per minute. Miho Inspection Systems Ltd provides the critical, high-end inspection machinery that keeps these lines running. However, the post-installation support ecosystem is currently bottlenecked by a reactive, manual back-office. 

Sporadic emergency calls, unstructured communication channels (like informal WhatsApp messages), and manual part-number lookups lead to delayed interventions, unrecorded orders, and severe financial misalignment. When a brewery’s line goes down, the last thing their maintenance team needs is to be placed on hold while Miho staff manually cross-reference physical catalogs.

### The Vision: Miho B2B Portal
We propose the development of a dedicated **B2B E-Commerce and Service Procurement Portal**. This platform will serve as the single source of truth for Miho and its brewery clients, transforming Miho from a reactive hardware vendor into a proactive, digitized strategic partner. 

### Strategic Value to Our Clients
For NBC, AB InBev, and Champions Brewery, this portal delivers:
*   **Zero-Ambiguity Procurement:** Instant access to OEM part numbers, live pricing, and automated quoting.
*   **Predictable Maintenance:** Transparent scheduling for overhauls and routine servicing.
*   **Reduced MTTR (Mean Time To Repair):** Streamlined emergency ticketing ensures the right technician and parts are dispatched immediately.
*   **Audit-Ready Compliance:** Every service and part ordered is digitally logged, aligning perfectly with the strict procurement and audit standards of multinational breweries.

---

## 2. OPERATIONAL PAIN POINTS VS. DIGITAL SOLUTIONS

To illustrate the transformation, the following table maps our current operational friction points to their corresponding digital solutions within the new portal.

| Current Operational Pain Point | The Digital Solution (Miho B2B Portal) |
| :--- | :--- |
| **Sporadic, un-protocolled emergency calls:** Breweries call randomly; issues are reported verbally without standard details, causing delays in diagnosis. | **Structured Service Ticketing & SLA Tracking:** Standardized digital forms capture machine ID, error codes, and urgency. Automated SLA timers ensure rapid response and escalation. |
| **Manual part lookups & phone hold times:** Miho staff put customers on hold to flip through manuals or check Excel sheets to confirm part numbers. | **Digital Spare Parts Catalog:** A centralized, searchable database featuring OEM part numbers, exploded diagrams, live pricing, and real-time stock status. |
| **Bypassed protocols & verbal agreements:** Orders are placed via phone/WhatsApp, bypassing formal procurement workflows, leading to unrecorded liabilities. | **"Create Order on Behalf" Feature:** Miho admins can instantly digitize a phone/WhatsApp call into an official system order, maintaining data integrity without frustrating the client. |
| **Poor tracking & financial misalignment:** Unrecorded orders and scattered emails lead to revenue leakage and mismatched financial records at month-end. | **Centralized Order History & ERP Integration:** Automated quote-to-PO generation, centralized audit trails, and API-ready financial logging ensure every Naira is tracked and reconciled. |

---

## 3. CORE SYSTEM MODULES & FUNCTIONALITIES

The portal is built on three foundational pillars designed to handle both the physical maintenance of assets and the digital procurement of parts.

### A. Service & Maintenance Scheduler
This module digitizes the entire lifecycle of machine servicing.
*   **Routine & Overhaul Scheduling:** Automated calendar views for scheduled preventive maintenance. The system sends automated email/SMS reminders to brewery plant managers 14, 7, and 1 day before a scheduled overhaul.
*   **Emergency Intervention Requests:** A "Red Button" SOS feature for line-down situations. Captures critical data (Machine ID, Fault Code, Line Status) to dispatch the right technician with the right tools immediately.
*   **Technician Tracking & Dispatch:** Real-time assignment of field engineers. Breweries can see the assigned technician's profile, ETA, and digital check-in/check-out logs.

### B. B2B E-Commerce & Spare Parts Catalog
A secure, Amazon-like purchasing experience tailored strictly for industrial MRO (Maintenance, Repair, and Operations).
*   **Secure Brewery Logins:** NBC, AB InBev, and Champions each have their own tenant space, seeing only their specific machine configurations and negotiated pricing.
*   **Comprehensive Inventory:** Full parts inventory including OEM part numbers, technical descriptions, compatibility matrices, and high-resolution images.
*   **Automated RFQ & Checkout:** Users can add parts to a cart and generate an automated Request for Quote (RFQ). Once Miho approves, it converts to a formal Proforma Invoice, which the brewery can approve to generate a Purchase Order (PO).

### C. Miho Admin "Super-Powers" (Change Management Engine)
We recognize that changing human behavior takes time. Breweries are used to calling or sending WhatsApp messages. 
*   **Order on Behalf of Client:** If a brewery engineer calls Miho to order a part, the Miho admin can log into the portal, select the client, and place the order *on their behalf*. 
*   **Data Integrity:** The system logs the order officially, attaches the digital paper trail, and sends an automated confirmation to the brewery's procurement team, seamlessly bridging the gap between old habits and new digital protocols.

---

## 4. USER ROLES & PERMISSIONS (ACCESS CONTROL)

Strict Role-Based Access Control (RBAC) ensures security, operational efficiency, and financial compliance.

| User Role | Primary Responsibilities & System Access |
| :--- | :--- |
| **Miho Admin / Back-Office** | **God-mode access.** Manage user accounts, update parts catalog/pricing, approve RFQs, generate invoices, "Order on Behalf" of clients, view all financial and operational dashboards. |
| **Miho Field Engineers** | **Mobile-optimized access.** View assigned service tickets, update ticket status (En Route, On-Site, Completed), request emergency parts from the field, upload site reports and photos. |
| **Brewery Procurement Managers** | **Financial & Approval access.** View automated quotes, approve Purchase Orders (POs), track order fulfillment status, view billing history, and manage their internal brewery users. |
| **Brewery Plant Maint. Engineers**| **Operational access.** Raise emergency service tickets, browse the parts catalog, add items to the RFQ cart, view machine maintenance history, and download technical manuals. |

---

## 5. CONCEPTUAL TEXT-BASED WIREFRAMES & UX FLOWS

Below are structural wireframes to visualize the user experience for key stakeholders.

### Wireframe 1: Brewery Customer Dashboard
*The central hub for Brewery Plant Engineers and Procurement Managers.*

```text
+-----------------------------------------------------------------------------------+
|  [Miho Logo]   NBC - Nigerian Bottling Co.    [User: J. Adebayo]  [Logout]       |
+-----------------------------------------------------------------------------------+
|  DASHBOARD  |  SERVICE TICKETS  |  PARTS CATALOG  |  MY ORDERS  |  DOCUMENTS     |
+-----------------------------------------------------------------------------------+
| WELCOME BACK, J. ADEBAYO                                                        |
|                                                                                   |
| [ ACTIVE EQUIPMENT STATUS ]           [ UPCOMING SCHEDULED OVERHAULS ]            |
|  Line 1: Filler Inspector   [ OK ]    - Oct 12: Labeler Overhaul (Line 2)         |
|  Line 2: Labeler Inspector  [ OK ]    - Nov 05: Packer Inspection (Line 1)        |
|  Line 3: Packer Inspector   [WARN]    [ View Full Maintenance Calendar > ]        |
|                                                                                   |
| [ QUICK ACTIONS ]                     [ OPEN SERVICE TICKETS ]                    |
|  (+) Raise Emergency Ticket           - TK-1042: Filler Sensor Fault [In Progress]|
|  (+) Request Spare Parts              - TK-1039: Routine Calibration [Completed]  |
|  (!) Report Line Down Issue           [ View All Tickets > ]                      |
+-----------------------------------------------------------------------------------+
```

### Wireframe 2: Spare Parts Catalog Interface
*Optimized for Brewery Engineers to quickly find OEM parts.*

```text
+-----------------------------------------------------------------------------------+
|  PARTS CATALOG > FILLER INSPECTION MACHINES > LINE 1                              |
+-----------------------------------------------------------------------------------+
| SEARCH: [ OEM Part No. or Keyword...                 ] [ Search ]                 |
|                                                                                   |
| FILTERS:                  | RESULTS (Showing 1-3 of 42)                           |
| [x] In Stock Only         | ----------------------------------------------------- |
| [ ] Machine Type:         | [IMG] | PN: MIH-FIL-992A | Qty: [ 1 ] | Price: ₦45k  |
|     - Filler              |       | Desc: Proximity Sensor, M12  | [Add to Quote]|
|     - Labeler             | ----------------------------------------------------- |
|     - Packer              | [IMG] | PN: MIH-FIL-881B | Qty: [ 2 ] | Price: ₦120k |
| [x] Stock Status:         |       | Desc: Pneumatic Cylinder Kit | [Add to Quote]|
|     - In Stock (12)       | ----------------------------------------------------- |
|     - Backordered (2)     | [IMG] | PN: MIH-FIL-770C | Qty: [ 1 ] | Price: ₦85k  |
|                           |       | Desc: Vision Camera Lens     | [Add to Quote]|
|                           | ----------------------------------------------------- |
|                           | [ Generate RFQ for Selected Items (3) > ]             |
+-----------------------------------------------------------------------------------+
```

### Wireframe 3: Miho Admin "Order on Behalf Of" Screen
*The bridge for informal phone/WhatsApp orders.*

```text
+-----------------------------------------------------------------------------------+
|  MIHO ADMIN PANEL > QUICK ORDER > CREATE ON BEHALF OF CLIENT                      |
+-----------------------------------------------------------------------------------+
| 1. SELECT CLIENT:  [ NBC - Nigerian Bottling Co. (Lagos Plant)       v ]          |
|                                                                                   |
| 2. CONTACT INFO:   [ Name: J. Adebayo (Plant Eng) ] [ Phone: 08012345678 ]       |
|                    *Auto-pulled from client directory. WhatsApp/SMS receipt sent.*|
|                                                                                   |
| 3. ORDER DETAILS:                                                                 |
|    (+) Add Part:  [ MIH-FIL-992A - Proximity Sensor      ] Qty: [ 2 ]            |
|    (+) Add Part:  [ MIH-LBL-202C - Conveyor Belt Roller  ] Qty: [ 1 ]            |
|    (+) Add Service: [ Emergency Call-out (Standard Rate) ] Hours: [ 4 ]           |
|                                                                                   |
| 4. INTERNAL NOTES: [ Customer called via WhatsApp. Urgent line stop. Dispatching  |
|                      Eng. Tunde immediately. Approve expedited shipping. ]        |
|                                                                                   |
| [ CANCEL ]                                              [ SUBMIT & GENERATE PO ]  |
+-----------------------------------------------------------------------------------+
```

---

## 6. FINANCIAL & OPERATIONAL BENEFITS (ROI)

Implementing this portal is not just an IT upgrade; it is a strategic business transformation that yields measurable ROI.

### 1. Financial Alignment & Revenue Assurance
Currently, verbal agreements and WhatsApp orders lead to "shadow operations"—work done but not properly invoiced. The portal ensures **100% revenue capture**. Every part, service hour, and call-out is logged, quoted, and tracked. Automated invoicing integrates directly with Miho’s accounting systems, eliminating month-end reconciliation headaches and accelerating cash flow.

### 2. Inventory Optimization & Predictive Stocking
By linking the Service Scheduler with the Parts Catalog, Miho gains predictive intelligence. If the system shows that NBC and AB InBev both have scheduled overhauls for their Labelers in Q4, Miho’s supply chain team can proactively procure and stock the required OEM parts. This reduces emergency air-freight costs, prevents stockouts, and optimizes working capital.

### 3. Drastic Reduction in Machine Downtime
For breweries, MTTR (Mean Time To Repair) is the ultimate metric. By replacing phone-tag with structured digital ticketing and instant parts identification, Miho reduces the diagnostic and procurement time by an estimated 40-60%. For our clients, this translates to millions of Naira saved in recovered production time.

### 4. Enhanced Client Stickiness & Brand Value
Providing NBC, AB InBev, and Champions with a world-class, transparent digital portal elevates Miho’s brand. It shifts the perception of Miho from a "local machine seller" to a "Tier-1 Digital Industrial Partner," making it highly unlikely that these breweries will switch to a competitor.

---

## 7. IMPLEMENTATION ROADMAP & NEXT STEPS

To mitigate risk and ensure high user adoption, we propose a phased, agile implementation approach.

### Phase 1: Discovery & Database Clean-up (Weeks 1-4)
*   **Action:** Audit all existing OEM part numbers, machine configurations, and pricing structures for NBC, AB InBev, and Champions.
*   **Deliverable:** A clean, normalized relational database of parts, machines, and client-specific pricing.

### Phase 2: MVP Development (Weeks 5-12)
*   **Action:** Build the core modules: User Authentication, B2B Parts Catalog, Shopping Cart/RFQ engine, and the Admin "Order on Behalf" feature.
*   **Deliverable:** A functional Minimum Viable Product (MVP) ready for internal Miho testing.

### Phase 3: Pilot Testing (Weeks 13-16)
*   **Action:** Deploy the MVP to **one** friendly client (e.g., Champions Brewery) and a select group of Miho field engineers. 
*   **Deliverable:** Gather UX feedback, fix bugs, refine the "Order on Behalf" workflow, and validate the SLA ticketing logic.

### Phase 4: Full Rollout & Training (Weeks 17-20)
*   **Action:** Onboard NBC and AB InBev. Conduct comprehensive training sessions for Brewery Procurement, Plant Engineers, and Miho back-office staff.
*   **Deliverable:** Full go-live, handover of administrative manuals, and transition to the support phase.

### Next Steps
1.  **Review & Alignment:** Miho Executive Team to review this proposal and provide feedback.
2.  **Commercials:** Finalize project scope, timeline, and commercial terms.
3.  **Project Kickoff:** Sign Statement of Work (SOW) and initiate Phase 1 Discovery.

---
*Prepared by the Office of the Principal Technical Consultant. We look forward to partnering with Miho Inspection Systems Ltd to digitize and dominate the Nigerian brewery automation support sector.*

<br><br>

---

# PART 2: PROTOTYPE DEVELOPMENT MASTER PLAN

*Authored by the Elite Cross-Functional Engineering & Product Leadership Team*

---

## Phase 1: Product Management & Requirements Definition (Product Manager)

### 1. Scope & Personas
The Miho Portal serves as the single source of truth for Miho Inspection Systems Ltd Nigeria and its key brewery clients (NBC, AB InBev, Champions Brewery). 
*   **Brewery Plant Maintenance Engineer:** Needs rapid fault diagnosis, access to technical manuals, and the ability to raise emergency tickets or request specific spare parts (e.g., replacement sensors for a *miho TOP-Cam*).
*   **Brewery Procurement Manager:** Requires transparent pricing, automated RFQ generation, PO approval workflows, and audit-ready financial logs.
*   **Miho Field Engineer:** Needs mobile-optimized access to assigned service tickets, machine history, and the ability to request emergency parts from the field.
*   **Miho Back-Office Admin:** Requires "God-mode" access to manage the catalog, approve RFQs, and utilize the "Order on Behalf of Client" feature to digitize informal WhatsApp/phone requests.

### 2. Core Features & Service Distinctions
*   **Authentication & RBAC:** Secure, role-based access tailored to each brewery tenant.
*   **Real-Time Telemetry Dashboard:** Integration with **miho AWeS** (Production data acquisition, Weihenstephan Standard) and **miho Remote-Service** for exact fault analysis and quick fault resets.
*   **Service Management Module (Strictly Categorized):**
    *   *Emergency Intervention:* Line-down scenarios requiring immediate dispatch (e.g., *miho Leonardo SFM* actuator failure).
    *   *Routine Maintenance:* Scheduled preventive checks (e.g., lens cleaning and UV LED calibration for *miho TOP-Cam Detection of label and glue residue*).
    *   *Annual Overhaul:* Comprehensive teardown and wear-part replacement (e.g., full conveyor belt and sensor replacement for *miho Gauss 2U*).
    *   *Validations:* Compliance and calibration certifications (e.g., X-ray safety and output validation for *miho Newton X2P*).
*   **B2B Spare Parts Catalog:** Searchable inventory with OEM part numbers, live pricing, and stock status.

### 3. Data Integration Mapping (Real miho.de Data)
No placeholders are used. The database schema will be populated with exact machinery models:
```json
{
  "machine_id": "MIHO-DB2-001",
  "model": "miho David 2",
  "category": "Empty bottle inspection",
  "specifications": {
    "capacity": "Up to 72,000 bottles/hour",
    "design": "Hygienic design",
    "deployment": "In use over 1,000 times worldwide"
  },
  "compatible_services": ["Routine Maintenance", "Annual Overhaul", "Validations"],
  "critical_spares": [
    {"part_no": "MIHO-DB2-SNS-01", "name": "Proximity Sensor M12", "price_ngn": 45000},
    {"part_no": "MIHO-DB2-BLT-04", "name": "Conveyor Belt Section", "price_ngn": 120000}
  ]
}
```
*Additional Catalog Entries:* **miho Gauss 2U** (Bottle sorting, 3D measurement), **miho Multicon 4** (Embossing detection, 8-channel sorting), **miho Newton HF2** (Fill level control, high-frequency technology), **miho EC-Cam** (End-of-line label inspection, EAN/expiry detection).

### 4. Acceptance Criteria (User Stories)
*   **US-01:** *As a Brewery Maintenance Engineer, I want to search the catalog by "miho Newton X2P" so that I can view its pulsed X-ray technology specifications and add compatible spares to my RFQ cart.*  
    *AC:* Search returns exact match; "Add to Quote" button updates cart total; stock status shows "In Stock" or "Backordered".
*   **US-02:** *As a Miho Admin, I want to create an "Emergency Intervention" ticket on behalf of a client who called via WhatsApp, so that the order is formally logged.*  
    *AC:* Admin selects client, chooses "Emergency Intervention", adds parts, and system auto-generates a PDF quote sent to the client's registered email.

---

## Phase 2: System Architecture & Technology Stack (Senior Software Solutions Architect)

### 1. Architecture Pattern
A **Containerized Modular Monolith** is selected. It provides the simplicity of a single deployable unit for on-premise client servers while maintaining strict internal module boundaries (Auth, Catalog, Ticketing, Billing) for future microservices extraction.

### 2. Technology Stack
*   **Frontend:** React.js 18 + TypeScript + Tailwind CSS (High-performance, responsive, type-safe UI).
*   **Backend:** NestJS (Node.js) + TypeScript (Robust, modular API handling with built-in dependency injection).
*   **Database:** PostgreSQL 15 (Relational data: users, orders, machine specs, service logs).
*   **Cache/Session:** Redis 7 (Real-time caching of catalog queries and session management).
*   **Telemetry Ingestion:** MQTT Broker (Mosquitto) for ingesting **miho AWeS** Weihenstephan standard data streams.

### 3. Security & Compliance
*   **Authentication:** JWT (JSON Web Tokens) with 15-minute expiry and HttpOnly refresh cookies.
*   **Authorization:** Strict RBAC middleware enforcing tenant isolation (NBC data is invisible to AB InBev users).
*   **Encryption:** AES-256 for data at rest (PostgreSQL TDE); TLS 1.3 for all data in transit.
*   **API Gateway:** Rate limiting and payload validation (Zod) to prevent injection attacks.

### 4. System Diagram & Data Flow
```text
[Brewery Plant Network]
       │
       ├── (HTTPS/WSS) ──> [Nginx Reverse Proxy + TLS Termination]
       │                          │
       │                          ├──> [React.js Frontend Container]
       │                          │
       │                          └──> [NestJS Backend API Container]
       │                                      │
       │                                      ├──> [PostgreSQL Container] (Persistent Data)
       │                                      ├──> [Redis Container] (Cache/Sessions)
       │                                      └──> [Mosquitto MQTT] (miho AWeS Telemetry)
       │
[Miho Field Engineer Mobile] ──(HTTPS)──> [Nginx Reverse Proxy]
```

---

## Phase 3: UI/UX Design System & User Journey (Lead UI/UX Specialist)

### 1. Design System (Industrial Clarity)
*   **Color Palette:** 
    *   Primary: `#003366` (Miho Corporate Deep Blue - Trust, Stability)
    *   Secondary: `#0055A4` (Interactive Elements)
    *   Alert/Action: `#FF6600` (Safety Orange - Emergency Tickets, Line Down)
    *   Background: `#F4F6F8` (Reduced eye strain for control rooms)
*   **Typography:** Inter or Roboto (High legibility at small sizes for dense data tables).
*   **Accessibility:** WCAG 2.1 AA compliant contrast ratios (e.g., 4.5:1 for normal text).

### 2. High-Fidelity Wireframes (Conceptual)

**Wireframe A: Mission Control Dashboard**
```text
+-----------------------------------------------------------------------------------+
| MIHO PORTAL | NBC Lagos Plant | User: J. Adebayo (Maint. Eng) | [ Emergency SOS ] |
+-----------------------------------------------------------------------------------+
| DASHBOARD  |  CATALOG  |  SERVICE  |  ORDERS  |  TELEMETRY                        |
+-----------------------------------------------------------------------------------+
| ACTIVE MACHINE STATUS (Live via miho AWeS)                                        |
| [OK] Line 1: miho David 2 (Empty Bottle) | Uptime: 98.2% | Next Validation: 14d  |
| [WARN] Line 2: miho EC-Cam (Label Insp.) | Fault: EAN Read Error | Ticket Open   |
| [OK] Line 3: miho Newton HF2 (Fill Level)| Uptime: 99.1%                         |
+-----------------------------------------------------------------------------------+
| UPCOMING SERVICES                                                                 |
| [Annual Overhaul] miho Gauss 2U | Scheduled: Oct 12 | Status: Parts Ordered     |
| [Routine Maint.] miho TOP-Cam Finish | Scheduled: Oct 15 | Status: Pending       |
+-----------------------------------------------------------------------------------+
```

**Wireframe B: Detailed Machine Spec Page (Real Data)**
```text
+-----------------------------------------------------------------------------------+
| < Back to Catalog | miho Newton X2P (Fill Level Control)                          |
+-----------------------------------------------------------------------------------+
| [ High-Res Image of miho Newton X2P ]                                             |
|                                                                                   |
| SPECIFICATIONS:                                                                   |
| • Technology: Pulsed X-ray technology                                             |
| • Safety: Low radiation, any container type, any product                          |
| • Integration: Compatible with miho HSPM multi-reject systems                     |
|                                                                                   |
| AVAILABLE SERVICES FOR THIS MACHINE:                                              |
| [ ] Request Emergency Intervention                                                |
| [ ] Schedule Routine Maintenance (Sensor Calibration)                             |
| [ ] Book Annual Overhaul                                                          |
| [ ] Request X-Ray Safety Validation                                               |
|                                                                                   |
| COMPATIBLE SPARE PARTS:                                                           |
| [IMG] PN: MIHO-NX2P-DET-01 | X-Ray Line Detector | ₦450,000 | [Add to RFQ]        |
+-----------------------------------------------------------------------------------+
```

### 3. Component Library
*   **Data Grids:** Sortable, filterable tables with virtualized scrolling for 10,000+ part records.
*   **Status Badges:** Color-coded pills (`bg-green-100 text-green-800` for OK, `bg-red-100 text-red-800` for Line Down).
*   **Modal Forms:** Multi-step wizards for "Order on Behalf of Client" to ensure no data is missed during phone conversions.

---

## Phase 4: Project Planning, Milestones & Execution (Technical Project Manager)

### 1. Work Breakdown Structure (10-Week Agile Lifecycle)
*   **Sprint 1-2 (Weeks 1-4):** UX/UI high-fidelity wireframes, architecture setup, Docker environment initialization, database schema finalization with real *miho.de* data models (David 2, Gauss 2U, etc.).
*   **Sprint 3-5 (Weeks 5-7):** Core backend API development (NestJS), JWT/RBAC implementation, foundational frontend integration, and "Order on Behalf" workflow.
*   **Sprint 6-8 (Weeks 8-10):** Advanced dashboards, machine catalog population (100% real data), service scheduling module (Intervention, Routine, Overhaul, Validation), and end-to-end integration.
*   **Sprint 9-10 (Weeks 11-12):** QA hardening, security audits, performance tuning, and client server packaging (Docker Compose).

### 2. Risk Management
*   **Risk:** Client on-premise server has limited RAM/CPU.  
    *Mitigation:* Optimize Docker images (Alpine Linux bases), implement Redis caching to reduce DB load, and provide minimum hardware specs (e.g., 4 vCPU, 8GB RAM).
*   **Risk:** Brewery IT policies block external API calls.  
    *Mitigation:* Design the system to operate entirely offline/on-premise after initial deployment, with manual CSV import options for catalog updates if internet is restricted.

---

## Phase 5: DevOps, Quality Assurance & On-Premise Deployment (DevOps/QA Specialist)

### 1. Containerization & Orchestration
A single `docker-compose.yml` file will orchestrate the entire stack for seamless on-premise deployment.

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always

  backend:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://miho_user:secure_password@db:5432/miho_portal
      - REDIS_URL=redis://cache:6379
      - JWT_SECRET=${JWT_SECRET}
    ports:
      - "3000:3000"
    depends_on:
      - db
      - cache
    restart: always

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=miho_user
      - POSTGRES_PASSWORD=secure_password
      - POSTGRES_DB=miho_portal
    volumes:
      - miho_db_data:/var/lib/postgresql/data
    restart: always

  cache:
    image: redis:7-alpine
    restart: always

volumes:
  miho_db_data:
```

### 2. CI/CD Pipeline (GitHub Actions Example)
Automated linting, testing, and Docker image building on every push to `main`.
```yaml
name: Miho Portal CI/CD
on: [push]
jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with: { node-version: '18' }
      - name: Install Dependencies & Lint
        run: |
          cd backend && npm ci && npm run lint
          cd ../frontend && npm ci && npm run lint
      - name: Run Unit Tests
        run: |
          cd backend && npm run test
      - name: Build Docker Images
        run: docker-compose build
```

### 3. QA Strategy
*   **Functional Testing:** Jest (Backend) and React Testing Library (Frontend) to validate user stories (e.g., "Order on Behalf" creates a valid DB record).
*   **Performance Testing:** k6 scripts to simulate 50 concurrent brewery users querying the *miho Newton X2P* catalog simultaneously, ensuring <200ms response times.
*   **Security Testing:** OWASP ZAP automated scan for XSS, SQL injection, and broken access control (ensuring NBC cannot see AB InBev data).
*   **Cross-Browser:** Cypress E2E tests on Chrome, Firefox, and Edge.

### 4. Deployment Runbook (On-Premise Administrator Manual)
1.  **Prerequisites:** Ensure target server runs Ubuntu 22.04 LTS with Docker Engine 24.x and Docker Compose v2 installed.
2.  **Transfer:** Securely copy the `miho-portal-release-v1.0.tar.gz` to the server via SFTP.
3.  **Extract:** `tar -xvzf miho-portal-release-v1.0.tar.gz -C /opt/miho-portal`
4.  **Configure:** Navigate to `/opt/miho-portal` and edit `.env` to set secure `JWT_SECRET` and `POSTGRES_PASSWORD`.
5.  **Deploy:** Execute `sudo docker-compose up -d --build`.
6.  **Seed Data:** Run `sudo docker-compose exec backend npm run seed:real-miho-data` to populate the database with the exact *miho.de* machinery catalog.
7.  **Verify:** Access `http://<server-ip>` in a browser. Confirm login page loads.
8.  **Backup Strategy:** Configure a daily cron job: `0 2 * * * docker exec miho-portal-db-1 pg_dump -U miho_user miho_portal > /backup/miho_$(date +\%F).sql`.