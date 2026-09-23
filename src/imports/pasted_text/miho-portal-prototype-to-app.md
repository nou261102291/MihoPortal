Transform this Miho Portal prototype into a fully interactive, production-ready application with complete end-to-end user flows. Make ALL elements clickable and functional with proper navigation, state management, and interactions.

### 1. ADD INTERACTIVE NAVIGATION & WIREFLOW
Wire up the left sidebar navigation across all screens:
- Dashboard → Navigate to Dashboard screen (create if missing)
- Spare Parts Catalog → Navigate to Catalog screen (already exists)
- Service Tickets → Navigate to Tickets screen (already exists)
- Orders → Navigate to Orders screen (already exists)
- Admin → Navigate to Admin screen (already exists)

Add hover states to all navigation items (background: #0055A4, white text).
Add active state highlighting for current page (already applied to "Admin").

### 2. CREATE MISSING SCREENS & FLOWS

**A. Login Screen (Create New Frame)**
- Clean, centered layout with Miho logo (top left)
- Email/Username field
- Password field
- "Sign In" button (Primary: #003366)
- "Forgot Password?" link
- Role selector dropdown: [Brewery Engineer, Procurement Manager, Miho Admin, Field Engineer]
- Footer: "© 2026 Miho Inspection Systems Ltd Nigeria"

**B. User Profile & Settings Screen**
- Tab navigation: [Profile, Security, Notifications, Preferences]
- Profile tab: Avatar upload, Name, Email, Phone, Plant Assignment, Role (read-only)
- Security tab: Change Password, 2FA toggle, Session management
- Notifications tab: Email alerts toggle, SMS alerts toggle, Ticket updates, Order updates
- Preferences tab: Language (English), Date Format, Currency ( NGN), Timezone (WAT)

**C. Admin Configuration Panel (Enhance Existing Admin Screen)**
Add these sub-sections accessible from the Admin navigation:

**C1. User Management**
- Table: User ID, Name, Email, Role, Plant Access, Status (Active/Inactive), Last Login, Actions (Edit, Deactivate)
- "+ Add New User" button → Opens modal with form
- Bulk actions: Select all, Export to CSV

**C2. Machine Registry**
- Table: Machine ID, Model (miho David 2, miho Gauss 2U, etc.), Plant Location, Line Number, Installation Date, Warranty Status, Actions
- Filter by: Plant, Machine Type, Status
- Search by: Machine ID, Serial Number

**C3. Pricing & Catalog Management**
- Editable price list for all spare parts
- Bulk price update tool (percentage or fixed amount)
- Stock level thresholds configuration
- Category management (Filler, Labeler, Inspector, etc.)

**C4. Service Level Agreements (SLA) Configuration**
- Emergency Intervention: Response time (default: 2 hours), Resolution time (default: 8 hours)
- Routine Maintenance: Scheduling window (default: 5 business days)
- Annual Overhaul: Lead time (default: 30 days)
- Validations: Turnaround time (default: 3 business days)

**C5. System Settings**
- General: Company name, Logo upload, Support email, Support phone
- Email Templates: Edit RFQ confirmation, Order confirmation, Ticket updates
- Backup & Export: Database backup schedule, Export all data to CSV/PDF

### 3. MAKE ALL BUTTONS & ACTIONS FUNCTIONAL

**Spare Parts Catalog Screen:**
- Search bar: Make it functional with real-time filtering (filter the 6 visible parts)
- Filter chips (Filler, Labeler, Inspector, In Stock, Backordered): Toggle active/inactive states, filter the grid
- "Add to RFQ" buttons: On click → Show toast notification "Added to RFQ cart", increment cart counter in header
- Stock status badges: Green "In Stock", Orange "Backordered" (already correct)

**Service Tickets Screen:**
- "+ Raise Emergency Ticket" button → Opens modal form with:
  * Machine dropdown (pre-populated with miho machines)
  * Fault description textarea
  * Priority selector (Critical/High/Normal)
  * Attach photos button
  * Submit button → Creates new ticket with ID T-0092, status "Open", priority "Critical"
- Ticket ID links: Clickable → Opens ticket detail view (create detail screen)
- Status badges: Color-coded (Open: Red, In Progress: Orange, Closed: Green)

**Orders Screen:**
- "View" button → Opens order detail modal with line items, shipping address, tracking info
- "PDF" button → Shows "Downloading PDF..." toast notification
- Status badges: Shipped (Blue), Processing (Orange), Delivered (Green)
- Add filter dropdown: [All Orders, Shipped, Processing, Delivered]

**Admin - Order on Behalf Of Screen:**
- Multi-step wizard: Make steps 1-4 clickable for navigation
- Step 1 (Client): Dropdown selection → Auto-fills Step 2 contact info
- Step 2 (Contact): Read-only fields (auto-filled)
- Step 3 (Order Builder): 
  * "Add Item" button → Adds new row to table
  * Type dropdown: [Part, Service]
  * Item dropdown: Pre-populate with real parts/services
  * Qty input: Numeric, updates total price
  * Delete icon (trash): Removes row
- Step 4 (Review): Shows complete quote summary
- "Submit & Generate PDF Quote" button → Success screen with "Quote sent to client email" confirmation

**Dashboard Screen (from earlier):**
- "Emergency SOS" button → Opens emergency ticket modal (red alert styling)
- Machine status cards: Clickable → Navigate to machine detail screen
- "View Calendar" link → Opens maintenance calendar view (create simple calendar screen)
- Quick Actions buttons: Navigate to respective screens

### 4. ADD INTERACTIVE COMPONENTS & STATES

**Modal/Dialog Components:**
- Create reusable modal component with:
  * Overlay (darken background 50%)
  * Close button (X) in top-right
  * Click outside to close
  * Escape key to close

**Toast Notifications:**
- Success toast (green): "Added to RFQ", "Ticket created successfully", "Order submitted"
- Error toast (red): "Failed to submit", "Invalid credentials"
- Auto-dismiss after 3 seconds

**Form Validation:**
- Required field indicators (red asterisk)
- Error messages below fields
- Disabled submit button until all required fields filled

**Dropdown Menus:**
- Click to expand
- Select option → Close dropdown, update value
- Click outside to close without selection

### 5. CREATE END-TO-END USER JOURNEYS

**Journey 1: Brewery Engineer Raises Emergency Ticket**
Login → Dashboard → Click "Emergency SOS" → Fill ticket form → Select machine (miho EC-Cam) → Describe fault → Submit → Success screen → Redirect to Service Tickets → See new ticket T-0092 with "Open" status

**Journey 2: Procurement Manager Orders Spare Parts**
Login → Spare Parts Catalog → Search "miho Newton" → Filter "In Stock" → Click "Add to RFQ" on 2 items → Cart counter shows "2" → Click cart icon → Review RFQ → Add delivery notes → Submit RFQ → Success screen → Redirect to Orders → See new RFQ with status "Pending Approval"

**Journey 3: Miho Admin Creates Order on Behalf of Client**
Login → Admin → Select "Order on Behalf Of" → Step 1: Select "NBC - Nigerian Bottling Co." → Step 2: Auto-filled contact (Emeka Okonkwo) → Step 3: Add Part (miho David 2 Proximity Sensor, Qty: 4) → Add Service (Emergency Intervention, Qty: 1) → Step 4: Review quote summary (₦18,500 + service) → Click "Submit & Generate PDF Quote" → Success confirmation → Quote sent to client email

**Journey 4: Admin Configures System Settings**
Login → Admin → Click "System Settings" in submenu → Update support email to support@miho-nigeria.com → Upload new logo → Click "Save Changes" → Success toast → Settings updated

### 6. ADD RESPONSIVE BEHAVIOR & ANIMATIONS

- Page transitions: Fade-in animation (300ms ease-in-out)
- Modal open: Scale from 0.95 to 1.0, fade-in overlay
- Button hover: Slight scale (1.02), shadow elevation
- Dropdown open: Slide-down animation (200ms)
- Toast notification: Slide-in from top-right (300ms), auto-dismiss

### 7. CREATE ADDITIONAL SUPPORTING SCREENS

**Ticket Detail View:**
- Ticket ID, Machine, Type, Status, Priority, Date, Description
- Timeline of updates (created, assigned, in progress, resolved)
- Attachments section
- Comments/Notes section
- "Assign to Engineer" dropdown
- "Update Status" button

**Machine Detail View:**
- Machine model, serial number, installation date
- Technical specifications (from miho.de data)
- Service history table
- Compatible spare parts list
- "Schedule Service" button
- "Order Parts" button

**Maintenance Calendar View:**
- Monthly calendar grid
- Color-coded events: Emergency (Red), Routine (Blue), Overhaul (Orange), Validation (Purple)
- Click date → Show scheduled services for that day
- "Add Event" button for admins

**RFQ Cart/Checkout:**
- List of selected items with qty, unit price, total
- Delivery address selector
- Delivery date picker
- Special instructions textarea
- "Submit RFQ" button
- Order summary sidebar

### 8. ADD DATA STATES & EMPTY STATES

- Empty cart: "Your RFQ cart is empty. Browse the catalog to add items."
- No tickets: "No service tickets found. Click 'Raise Emergency Ticket' to create one."
- No orders: "No orders yet. Start by requesting spare parts."
- Search no results: "No parts found matching '[search term]'. Try different keywords."
- Loading states: Skeleton screens for tables and cards (gray shimmer animation)

### 9. IMPLEMENT ROLE-BASED ACCESS CONTROL (RBAC) VIEWS

Create variant screens showing different navigation options based on user role:

**Brewery Engineer View:**
- Can see: Dashboard, Spare Parts Catalog, Service Tickets, Orders (own plant only)
- Cannot see: Admin panel

**Procurement Manager View:**
- Can see: Dashboard, Spare Parts Catalog, Orders (all plants), Admin (limited to pricing)
- Cannot see: Full Admin configuration

**Miho Admin View:**
- Can see: All screens, full Admin panel with all configuration options
- "Order on Behalf Of" feature enabled

**Field Engineer View:**
- Can see: Dashboard, Service Tickets (assigned only), Mobile-optimized parts catalog
- Simplified navigation, larger touch targets

### 10. FINAL POLISH & PRODUCTION READINESS

- Ensure all text is legible (minimum 14px for body, 16px for inputs)
- Consistent spacing (8px grid system)
- Color contrast meets WCAG 2.1 AA standards
- All icons are consistent (use Lucide or Heroicons style)
- Export assets at 1x, 2x, 3x for development handoff
- Add component variants for buttons (default, hover, active, disabled)
- Create style guide frame showing colors, typography, spacing

Make this prototype fully clickable with no dead ends. Every button, link, and interactive element should navigate to a screen, open a modal, or show a state change. Use Figma's prototype connections with "On Click" triggers and "Navigate To" or "Open Overlay" actions. [[1]] [[2]]