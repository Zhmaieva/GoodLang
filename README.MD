## Environment configuration

Backend credentials belong in `backend/.env`. The existing OpenAI key has been
moved there locally. For a fresh checkout, copy `backend/.env.example` to
`backend/.env` and fill in the credentials needed by your deployment.
The backend loads this file from any working directory, preserves system
environment variables, and also supports a working-directory `.env` as a fallback.

Frontend configuration belongs in `frontend/web/.env`; use
`frontend/web/.env.example` for a fresh checkout. Every `VITE_*` value is public
and gets embedded in the browser and native bundles.

API key inventory (values omitted):

| Key | Configuration | Where it is used |
| --- | --- | --- |
| OpenAI secret key | `backend/.env`: `OPENAI_API_KEY` | `backend/core/сore.js`; previously hardcoded |
| Stripe test publishable key | `frontend/web/.env`: `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe checkout components and generated web/native bundles; already environment configured |

The Stripe secret key and webhook signing secret already use
`STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` from the backend environment;
no literal values for these were found in the source.

Local `.env` files and their variants are ignored by Git; commit only the empty
`.env.example` templates. Rotate the exposed OpenAI key and update
`backend/.env`: moving it does not remove it from existing Git history.

## Server commands

sudo -i -u postgres psql

mongosh "mongodb://localhost:27017"

sudo systemctl restart mongod

cd ~/workspace/goodlang/backend

pm2 ls

htop

sudo vi /etc/nginx/nginx.conf

sudo systemctl restart nginx


Start pm2 process
`pm2 flush goodlang-server;pm2 delete goodlang-server;pm2 start ./server.js -i max --name 'goodlang-server' -- -p 3009`

`pm2 flush goodlang-app;pm2 delete goodlang-app;pm2 start npm -i max --name 'goodlang-app' -- run dev -- --host`

Start pm2 process in debug mode
`pm2 flush goodlang-server;pm2 delete goodlang-server;pm2 start ./server.js -i max --name 'goodlang-server' -- --debug -p 3009`
