# Kubelab Collections Structure

This document describes the PocketBase collections used in Kubelab.

## Collections Overview

All collections are created programmatically in `pkg/collections/collections.go` on application bootstrap. No manual migration files are needed.

### 1. **users** (Auth Collection)
The main user authentication collection.

**Custom Fields:**
- `role` (text, required) - User role: "user" or "admin"
- `plan` (text) - Associated plan ID
- `company` (text) - Company name
- `workshop` (boolean) - Workshop participant flag

**Access Rules:**
- List/View: Authenticated users only
- Update/Delete: Own record or admin

---

### 2. **labs**
Lab courses that contain multiple exercises.

**Fields:**
- `name` (text, required) - Lab name
- `description` (editor) - Lab description
- `icon` (text) - Icon identifier
- `order` (number) - Display order
- `active` (boolean) - Active status
- `difficulty` (text) - Difficulty level

**Access Rules:**
- List/View: Authenticated users
- Create/Update/Delete: Admins only

---

### 3. **exercises**
Individual exercises within labs.

**Fields:**
- `name` (text, required) - Exercise name
- `description` (editor) - Exercise description
- `lab` (relation, required) - Parent lab
- `bootstrap` (URL) - Bootstrap script URL
- `check` (URL) - Validation script URL
- `order` (number) - Display order
- `maxScore` (number) - Maximum achievable score
- `active` (boolean) - Active status

**Access Rules:**
- List/View: Authenticated users
- Create/Update/Delete: Admins only

---

### 4. **lab_sessions**
User progress for labs (manages vcluster lifecycle).

**Fields:**
- `user` (relation, required) - User ID
- `lab` (relation, required) - Lab ID
- `clusterRunning` (boolean) - vcluster status
- `lastClusterStart` (date) - Last start timestamp
- `lastClusterStop` (date) - Last stop timestamp

**Access Rules:**
- List/View: Own records or admin
- Create: Authenticated users
- Update/Delete: Own records or admin

---

### 5. **exercise_sessions**
User progress for individual exercises.

**Fields:**
- `user` (relation, required) - User ID
- `exercise` (relation, required) - Exercise ID
- `agentRunning` (boolean) - Agent deployment status
- `score` (number) - Current score
- `lastAgentStart` (date) - Last start timestamp
- `lastAgentStop` (date) - Last stop timestamp
- `solved` (boolean) - Completion status
- `solvedAt` (date) - Completion timestamp

**Access Rules:**
- List/View: Own records or admin
- Create: Authenticated users
- Update/Delete: Own records or admin

---

### 6. **exercise_session_logs**
Logs for exercise session events.

**Fields:**
- `user` (relation, required) - User ID
- `exercise_session` (relation, required) - Exercise session ID
- `message` (text, required) - Log message
- `type` (text, required) - Log type/severity

**Access Rules:**
- List/View: Own records or admin
- Create: Authenticated users
- Delete: Admins only (no updates)

---

### 7. **hooks**
Configurable event hooks for automation.

**Fields:**
- `table` (text, required) - Target collection
- `event` (text, required) - Event type (insert/update/delete)
- `actionType` (text, required) - Action to perform
- `actionMeta` (text) - Additional action metadata
- `disabled` (boolean) - Enable/disable hook

**Access Rules:**
- All operations: Admins only

---

### 8. **plans**
Subscription/pricing plans.

**Fields:**
- `name` (text, required) - Plan name
- `description` (text) - Plan description
- `price` (number) - Plan price
- `active` (boolean) - Active status

**Access Rules:**
- List/View: Authenticated users
- Create/Update/Delete: Admins only

---

### 9. **features**
Features associated with plans.

**Fields:**
- `name` (text, required) - Feature name
- `plan` (relation) - Associated plan

**Access Rules:**
- List/View: Authenticated users
- Create/Update/Delete: Admins only

---

### 10. **faqs**
Frequently asked questions.

**Fields:**
- `question` (text, required) - Question text
- `answer` (text, required) - Answer text
- `order` (number) - Display order

**Access Rules:**
- List/View: Public (no auth required)
- Create/Update/Delete: Admins only

---

### 11. **companies**
Company logos for landing page.

**Fields:**
- `name` (text, required) - Company name
- `logo` (file, max 5MB) - Company logo image
- `order` (number) - Display order

**Access Rules:**
- List/View: Public (no auth required)
- Create/Update/Delete: Admins only

---

### 12. **notifications**
User notifications.

**Fields:**
- `user` (relation, required) - User ID
- `message` (text, required) - Notification message
- `type` (text, required) - Notification type
- `read` (boolean) - Read status

**Access Rules:**
- List/View: Own records or admin
- Create: Authenticated users
- Update/Delete: Own records or admin

---

## Initialization

Collections are automatically created on application bootstrap via `collections.InitializeCollections()` in `main.go`. If a collection already exists, it's skipped - no data is lost.

## First Run Setup

1. Start the backend: `npm run dev:backend` (from kubelab-ui directory)
2. Open the admin dashboard: http://localhost:8090/_/
3. Create your first admin account
4. Collections will be automatically created on first bootstrap

## Notes

- Old JS migrations in `pb_migrations_old/` are kept for reference but not used
- All schema changes should now be done in `pkg/collections/collections.go`
- For production, you may want to add collection schema versioning

