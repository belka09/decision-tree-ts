# Interview Questions and Answers

This document contains a list of common interview questions related to turning a single consumer web-based platform into a SaaS.

## Table of Contents

- [How can we design the system in a way that every company will be able to serve games on their gaming site from their domain?](#1-how-can-we-design-the-system-in-a-way-that-every-company-will-be-able-to-serve-games-on-their-gaming-site-from-their-domain)
- [What modification should be done to the users table at gPlatform to support this change?](#2-what-modification-should-be-done-to-the-users-table-at-gplatform-to-support-this-change)
- [How can we validate a user login on one gaming domain in such a way that it does not give access to a different gaming domain?](#3-how-can-we-validate-a-user-login-on-one-gaming-domain-in-such-a-way-that-it-does-not-give-access-to-a-different-gaming-domain)

### 1. How can we design the system in a way that every company will be able to serve games on their gaming site from their domain?

**Answer:**
To allow each company to serve games from their domain using Node.js, implement a multi-tenant architecture with domain-based routing. Here's how you can design this in a Node.js environment:

**Domain Configuration in Node.js:**

Use a reverse proxy (e.g., Nginx) to route traffic based on the domain to the Node.js application. This proxy can pass the domain information in the headers to the Node.js backend.

In the Node.js app, use middleware (e.g., express) to capture the Host header from the request, which contains the domain name (e.g., cool-games.com). The app can then use this domain to identify the respective company.

**Identification:**

In the middleware, map the domain to a `company_id` that represents the customer's company in the database. Store this `company_id` in the request object to be used throughout the request lifecycle.

### 2. What modification should be done to the users table at gPlatform to support this change?

**Answer:**
In a Node.js environment, if you're using a database like MongoDB, MySQL, or PostgreSQL, modify the schema to support multi-tenancy:

**Add a `company_id` Column:**

For relational databases (e.g., MySQL, PostgreSQL), add a `company_id` column to the `users` table that references the `companies` table.

If using MongoDB, embed the `company_id` within each user document.

**Composite Unique Key:**

Ensure a unique constraint on `(email, company_id)` in the database to allow the same email to be used by different companies.

### 3. How can we validate a user login on one gaming domain in such a way that it does not give access to a different gaming domain?

**Answer:**
To ensure user login is restricted to a specific domain in a Node.js environment, use the following approach:

**Domain-Specific Authentication Tokens:**

During the login process, generate a JSON Web Token (JWT) that includes the `company_id` of the current domain.

Sign the JWT with a secret key and store the token in a cookie with `SameSite` and `Domain` attributes set to the company's domain.

**Validation Middleware:**

In your Node.js application, create a middleware to validate incoming requests by:
- Extracting the JWT from the cookies.
- Decoding the JWT to get the `company_id`.
- Comparing the `company_id` in the token with the company identified from the request's domain (retrieved earlier in the middleware).

**Domain-Scoped Sessions:**

Set the session cookies to be scoped to the domain using the `Domain` attribute. This ensures that the session cookies are sent only with requests from the specific domain they were set on.

By using JWTs with the `company_id` encoded within them and validating that against the domain in the middleware, you ensure that authentication is restricted to the correct gaming site.
