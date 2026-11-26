# Deploying ScriptVault: a beginner's guide

This guide takes you from "I have the code" to "customers can pay me" in about 45 minutes. You won't need a terminal except for one optional step. Do the steps in order.

You will create four free accounts:

| Service | What it does for you | Sign up |
|---|---|---|
| **GitHub** | Stores your code | https://github.com |
| **Supabase** | Database, customer logins, private file storage | https://supabase.com |
| **Razorpay** | Takes payments (UPI, cards, netbanking) | https://razorpay.com |
| **Vercel** | Puts your website on the internet | https://vercel.com (sign up **with GitHub**) |

---

## Step 1: Put the code on GitHub

**Easiest way (no terminal):**

1. Log in to GitHub → click **+** (top right) → **New repository**.
2. Name it `scriptvault`, choose **Private**, and click **Create repository**.
3. On the next page, click **uploading an existing file**.
4. Open the `scriptvault` folder on your computer and drag **everything inside it** onto the page. Skip `node_modules`, `.next` and any `.env.local` file if you have them.
5. Click **Commit changes**.

**With a terminal** (if you have Git installed), run these inside the project folder:

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "ScriptVault"
```

Then follow the "push an existing repository" commands GitHub shows you.

> ⚠️ Never upload a `.env.local` file. It contains your secret keys. The included `.gitignore` already excludes it.

---

## Step 2: Create the Supabase database

1. Go to https://supabase.com/dashboard → **New project**.
   * Name: `scriptvault`
   * Database password: click **Generate** and save it in a password manager
   * Region: **Mumbai (ap-south-1)** if most customers are in India
2. Wait about 2 minutes while it sets up.
3. In the left sidebar, open **SQL Editor** → **New query**.
4. Open `supabase/schema.sql` from the project, copy **all** of it, paste it in, and click **Run**. You should see "Success. No rows returned".
5. Click **New query** again, paste all of `supabase/seed.sql`, and click **Run**. This adds the 18 sample scripts and 4 bundles.
6. Check it worked: open **Table Editor** → `scripts`. You should see 18 rows.

### Copy your Supabase keys

Go to **Project Settings** (gear icon) → **API** (it may be labelled **API Keys** / **Data API**). Keep this tab open; you'll need:

* **Project URL** → becomes `NEXT_PUBLIC_SUPABASE_URL`
* **anon / public** key → becomes `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* **service_role** key (click "Reveal") → becomes `SUPABASE_SERVICE_ROLE_KEY`. **This one is secret.**

> Newer Supabase projects call these the **Publishable key** (`sb_publishable_…`, use it as the anon key) and the **Secret key** (`sb_secret_…`, use it as the service-role key). Either style works.

---

## Step 3: Get Razorpay test keys

Start in **Test Mode**. No real money moves, and you don't need business verification yet.

1. Log in to https://dashboard.razorpay.com.
2. Make sure the toggle at the top says **Test Mode**.
3. Go to **Account & Settings** → **API Keys** → **Generate Test Key**.
4. Copy both values now (the secret is only shown once):
   * **Key Id** (starts `rzp_test_`) → `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   * **Key Secret** → `RAZORPAY_KEY_SECRET` (**secret**)

You'll set up the webhook in Step 6, once the site has an address.

---

## Step 4: Deploy on Vercel

1. Go to https://vercel.com/new and click **Import** next to your `scriptvault` repository.
2. Framework preset: **Next.js** (it's detected automatically). Leave the build settings alone.
3. Open **Environment Variables** and add these one by one (name on the left, value on the right):

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://scriptvault.vercel.app` (a placeholder; you'll fix it in a moment) |
   | `NEXT_PUBLIC_SUPABASE_URL` | from Step 2 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from Step 2 |
   | `SUPABASE_SERVICE_ROLE_KEY` | from Step 2 |
   | `NEXT_PUBLIC_RAZORPAY_KEY_ID` | from Step 3 |
   | `RAZORPAY_KEY_SECRET` | from Step 3 |
   | `RAZORPAY_WEBHOOK_SECRET` | type any long random phrase for now, e.g. `sv-webhook-7f3k29xq`, and **write it down** |

4. Click **Deploy** and wait 2–3 minutes.
5. When it finishes, Vercel shows your real address (something like `https://scriptvault-abc123.vercel.app`). Copy it.
6. Go to your project → **Settings** → **Environment Variables**, edit `NEXT_PUBLIC_SITE_URL` to that exact address (no trailing slash), and save.
7. Go to **Deployments** → click **⋯** on the latest one → **Redeploy**.

> 💡 `NEXT_PUBLIC_*` values are baked in at build time. **Whenever you change an environment variable, redeploy.**

The purple banner should now say **"Test payments"**. If it still says "Demo mode", the Supabase variables are missing or misspelled.

---

## Step 5: Tell Supabase your site's address

Without this, sign-up confirmation and password-reset emails will link to `localhost`.

1. Supabase → **Authentication** → **URL Configuration**.
2. **Site URL:** your Vercel address, e.g. `https://scriptvault-abc123.vercel.app`
3. **Redirect URLs** → **Add URL:** `https://scriptvault-abc123.vercel.app/auth/callback`
4. Save.

Recommended: in **Authentication** → **Providers** → **Email**, keep **Confirm email** turned on.

---

## Step 6: Set up the Razorpay webhook

The webhook is a safety net. If a customer pays and then closes the tab before returning to your site, Razorpay tells your server directly, and they still get their scripts.

1. Razorpay Dashboard (still **Test Mode**) → **Account & Settings** → **Webhooks** → **Add New Webhook**.
2. **Webhook URL:** `https://YOUR-SITE.vercel.app/api/webhooks/razorpay`
3. **Secret:** the exact phrase you used for `RAZORPAY_WEBHOOK_SECRET` in Step 4.
4. **Active events:** tick `payment.captured` and `payment.failed`.
5. Save.

Also check **Account & Settings** → **Payment Capture** is set to **Automatic** (the default).

---

## Step 7: Make yourself the admin

1. On your live site, click **Login** → **Create account**, sign up, and confirm your email.
2. Supabase → **SQL Editor** → **New query**, and run this (with your email):

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

3. Refresh your site. You'll see **Admin** in the header. From there you can add scripts, upload PDF/DOCX files and thumbnails, change prices, and publish or unpublish.

---

## Step 8: Do a test purchase

1. Open any script → **Buy Now** → tick the terms box → **Pay**.
2. In the Razorpay window, pay with **UPI ID `success@razorpay`**, or a test card from https://razorpay.com/docs/payments/payments/test-card-details/
3. You should land on "You're all set." Go to **My scripts** and download the PDF and DOCX.
4. In Admin → **Orders**, the order shows as **paid**.

🎉 Your store works end to end.

---

## Step 9: Go live with real payments

1. In Razorpay, complete **account activation** (KYC: PAN, bank account, business details, and your website's policy pages, which already exist at `/terms`, `/privacy`, `/refund-policy` and `/contact`).
2. Before submitting, replace every `[bracketed placeholder]` in those pages and the contact emails in `src/app/contact/page.tsx` with your real details, and have them reviewed.
3. After approval, switch the dashboard toggle to **Live Mode** → **API Keys** → generate live keys.
4. In Vercel, replace `NEXT_PUBLIC_RAZORPAY_KEY_ID` (now `rzp_live_…`) and `RAZORPAY_KEY_SECRET`.
5. In **Live Mode**, create the webhook again (Step 6). Live and test webhooks are separate.
6. **Redeploy.** The "Test payments" banner disappears automatically.
7. Replace the sample scripts with your own: edit them in Admin, or unpublish them and add new ones.

---

## Optional: your own domain

Vercel → Project → **Settings** → **Domains** → add `yourdomain.com` and follow the DNS instructions. Then update `NEXT_PUBLIC_SITE_URL`, the Supabase URL Configuration (Step 5), and the Razorpay webhook URL to the new domain, and redeploy.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Banner still says **Demo mode** | `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing or misspelled. Fix it, then **redeploy**. |
| Build fails with `relation "public.scripts" does not exist` | You haven't run `schema.sql` yet (Step 2). |
| Store is empty | Run `seed.sql`, or publish scripts in Admin. |
| "Payments offline" banner | `NEXT_PUBLIC_RAZORPAY_KEY_ID` is missing. Add it and redeploy. |
| "Could not start checkout" | Check `RAZORPAY_KEY_SECRET` matches the Key Id (test with test, live with live). Look at Vercel → **Logs**. |
| Confirmation email links go to localhost | Do Step 5. |
| "Admins only" page | Run the SQL in Step 7 with the **exact** email you signed up with, then sign out and back in. |
| Paid but scripts didn't appear | Check the webhook (Step 6) and Vercel Logs. The order shows in Admin → Orders; if it's stuck, the webhook will retry. |
| Order shows **review** | Two people bought the same exclusive licence at once. Refund the second buyer from the Razorpay dashboard (Payments → the payment → Refund). |
| Downloads return 403 | The signed-in account didn't buy that script. Admins can download anything. |

## Running locally with real keys

```bash
cp .env.example .env.local
```

Fill in `.env.local`, then run:

```bash
npm run dev
```

Add `http://localhost:3000/auth/callback` to Supabase's Redirect URLs as well. Razorpay webhooks can't reach `localhost`, but the browser verification flow still fulfils orders.
