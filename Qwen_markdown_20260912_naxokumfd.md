**DOCUMENT CONTROL**
**Date:** September 12, 2026
**Prepared By:** Principal Technical Consultant & B2B Solutions Architect
**Prepared For:** Executive Leadership, Miho Inspection Systems Ltd Nigeria
**Subject:** Business and Technical Proposal for the Miho B2B Procurement & Service Management Portal

---

# 1. EXECUTIVE SUMMARY

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

# 2. OPERATIONAL PAIN POINTS VS. DIGITAL SOLUTIONS

To illustrate the transformation, the following table maps our current operational friction points to their corresponding digital solutions within the new portal.

| Current Operational Pain Point | The Digital Solution (Miho B2B Portal) |
| :--- | :--- |
| **Sporadic, un-protocolled emergency calls:** Breweries call randomly; issues are reported verbally without standard details, causing delays in diagnosis. | **Structured Service Ticketing & SLA Tracking:** Standardized digital forms capture machine ID, error codes, and urgency. Automated SLA timers ensure rapid response and escalation. |
| **Manual part lookups & phone hold times:** Miho staff put customers on hold to flip through manuals or check Excel sheets to confirm part numbers. | **Digital Spare Parts Catalog:** A centralized, searchable database featuring OEM part numbers, exploded diagrams, live pricing, and real-time stock status. |
| **Bypassed protocols & verbal agreements:** Orders are placed via phone/WhatsApp, bypassing formal procurement workflows, leading to unrecorded liabilities. | **"Create Order on Behalf" Feature:** Miho admins can instantly digitize a phone/WhatsApp call into an official system order, maintaining data integrity without frustrating the client. |
| **Poor tracking & financial misalignment:** Unrecorded orders and scattered emails lead to revenue leakage and mismatched financial records at month-end. | **Centralized Order History & ERP Integration:** Automated quote-to-PO generation, centralized audit trails, and API-ready financial logging ensure every Naira is tracked and reconciled. |

---

# 3. CORE SYSTEM MODULES & FUNCTIONALITIES

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

# 4. USER ROLES & PERMISSIONS (ACCESS CONTROL)

Strict Role-Based Access Control (RBAC) ensures security, operational efficiency, and financial compliance.

| User Role | Primary Responsibilities & System Access |
| :--- | :--- |
| **Miho Admin / Back-Office** | **God-mode access.** Manage user accounts, update parts catalog/pricing, approve RFQs, generate invoices, "Order on Behalf" of clients, view all financial and operational dashboards. |
| **Miho Field Engineers** | **Mobile-optimized access.** View assigned service tickets, update ticket status (En Route, On-Site, Completed), request emergency parts from the field, upload site reports and photos. |
| **Brewery Procurement Managers** | **Financial & Approval access.** View automated quotes, approve Purchase Orders (POs), track order fulfillment status, view billing history, and manage their internal brewery users. |
| **Brewery Plant Maint. Engineers**| **Operational access.** Raise emergency service tickets, browse the parts catalog, add items to the RFQ cart, view machine maintenance history, and download technical manuals. |

---

# 5. CONCEPTUAL TEXT-BASED WIREFRAMES & UX FLOWS

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

# 6. FINANCIAL & OPERATIONAL BENEFITS (ROI)

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

# 7. IMPLEMENTATION ROADMAP & NEXT STEPS

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