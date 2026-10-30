# CTRL+GIRL AI relay

A small authenticated Cloudflare Worker runs the Creative Coach through Workers AI. It expects the `AI` binding, a `COACH_LIMIT` rate-limit binding (6 requests / 60 seconds, approximate per Cloudflare location), and a secret text binding `COACH_SECRET`. The Sites runtime sends requests from its server route using `CTRL_GIRL_COACH_URL` and `CTRL_GIRL_COACH_SECRET`. Never put the secret in client code or commit it.

The application is owner-private at initial deployment. The limiter is approximate and is not a strict spending cap; add a durable per-user/global quota and a cost budget before making it public. Workers AI may share account allowances with other projects. Keep fictional projects and simulated results labeled.
