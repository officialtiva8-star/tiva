# TIVA API

TIVA is a global social media platform.

## Technology

- Node.js
- Express
- Supabase PostgreSQL
- Supabase Authentication
- Supabase Storage
- Render hosting

## Installation

Install Node.js 20 or later.

Install dependencies:

npm install

Create a local environment file from .env.example.

Configure the Supabase environment variables.

Start the development server:

npm run dev

Start the production server:

npm start

## Health check

GET /health

## API endpoints

GET /api/me

GET /api/profile/:username

GET /api/wallet

GET /api/wallet/packages

GET /api/wallet/transactions

POST /api/wallet/purchase-intent

GET /api/posts

Protected endpoints require a valid Supabase access token.

Send the token using:

Authorization: Bearer YOUR_ACCESS_TOKEN

## Wallet rules

- Wallets start at zero coins.
- Wallets are created automatically when users register.
- Purchased coins are separate from creator earnings.
- Real-money balances must never be controlled by the browser.
- Payments must be verified before coins are credited.

## Security

Never commit .env files or private API keys.

Never expose the Supabase service-role key in frontend code.

Private posts must be protected by server-side privacy rules.

Real-money features must remain disabled until provider
integrations, verification, and security checks are complete.