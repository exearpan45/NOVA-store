# NOVA STORE v1.0

A lightweight customer + admin e-commerce starter built with HTML/CSS/JS and Supabase.

## Files
- index.html — storefront
- signup.html / login.html — customer auth
- cart.html — local shopping cart
- checkout.html — creates orders in Supabase
- orders.html — customer order history
- profile.html — customer profile
- admin-login.html — admin login
- admin.html — admin dashboard
- config.js — your Supabase URL + publishable key
- supabase.sql — database tables, RLS policies, profile trigger and starter products

## Setup
1. Put all files in the same folder.
2. Open config.js and paste your Supabase Project URL and Publishable Key.
3. In Supabase SQL Editor, run supabase.sql.
4. Create a customer account from signup.html.
5. In Supabase Authentication > Users, copy that user's UUID.
6. In SQL Editor run:
   update public.profiles set role = 'admin' where id = 'YOUR_AUTH_USER_ID';
7. Use admin-login.html with the same account to enter the admin dashboard.

## Important
This v1 uses Cash on Delivery as a demo checkout. It does not process real online payments.
For production, deploy over HTTPS and add a proper payment gateway/server-side order validation.
Never put a Supabase Secret Key in config.js.
