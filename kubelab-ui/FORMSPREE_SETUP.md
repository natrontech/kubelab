# Formspree Setup Instructions

## Overview
The signup page now uses Formspree to collect signup requests instead of directly creating accounts. This allows you to manually review and approve signups before providing access.

## Setup Steps

### 1. Create a Formspree Account
1. Go to [https://formspree.io/](https://formspree.io/)
2. Sign up for a free or paid account
3. Create a new form project

### 2. Get Your Form Endpoint
1. In your Formspree dashboard, find your form endpoint
2. It will look like: `https://formspree.io/f/YOUR_FORM_ID`
3. Copy this URL

### 3. Update the Application
Open `kubelab-ui/src/routes/signup/+page.svelte` and find this line (around line 63):

```typescript
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";
```

Replace `YOUR_FORM_ID` with your actual Formspree form ID.

### 4. Configure Formspree Settings (Optional)
In your Formspree dashboard, you can:
- Set up email notifications when someone submits the form
- Configure custom confirmation emails to send to users
- Add spam protection (reCAPTCHA)
- Set up webhooks to trigger actions on submission

## Form Data Submitted

When a user submits the signup form, the following data is sent to Formspree:

- `name`: Full name of the user
- `email`: Email address
- `company`: Company name (optional)
- `message`: Additional details from the user
- `plan`: Selected plan name (Individual or Enterprise)
- `billing`: Billing cycle (Monthly or Yearly)
- `price`: Price information (e.g., "$49/month" or "Contact Sales")

## Workflow

### User Submits Form:
1. User visits `/signup`
2. User selects a plan and billing cycle
3. User fills in their information
4. Form is submitted to Formspree

### You Receive Notification:
1. Formspree sends you an email notification
2. You can view the submission in your Formspree dashboard

### Follow Up:
1. Review the submission details
2. Contact the user to complete the signup process
3. Manually create their account in PocketBase
4. Provide them with login credentials

## Alternative: Self-Hosted
If you prefer not to use Formspree, you can:
- Create a custom API endpoint in the backend to handle form submissions
- Store submissions directly in PocketBase
- Use another form service like Netlify Forms, Basin, or your own solution

To implement this, update the `handleSubmit` function in `kubelab-ui/src/routes/signup/+page.svelte` to POST to your custom endpoint instead of Formspree.

