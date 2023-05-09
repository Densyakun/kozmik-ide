# Kozmik IDE
Kozmik IDE is the No-code development platform (NCDP).

## Quick Start

1. Clone or fork `kozmik-ide`:

```sh
git clone https://github.com/Densyakun/kozmik-ide.git
```

2. Install all dependencies:

```sh
cd kozmik-ide
npm install
```

3. Copy or rename `.env.local.example` to `.env.local`.

```sh
cp .env.local.example .env.local
```

4. (Optional) Fill the environment variables in your .env.local file in the app root:

- `LOGIN_PASSWORD`: Password required to sign in. If empty, no password is required to sign in.

Example:

```
LOGIN_PASSWORD=1234567890
```

5. Run your App:

```sh
npm run dev
```

## ⚠️ Always create your own `SECRET_COOKIE_PASSWORD`

This example hardcode the `SECRET_COOKIE_PASSWORD` environment variable used as a `password` to [`withIronSession`](https://github.com/vvo/next-iron-session#withironsessionhandler--password-ttl-cookiename-cookieoptions-) call. But in the real world you should:

1. Generate your own 32 characters minimum `SECRET_COOKIE_PASSWORD` via https://1password.com/password-generator/ for example
2. Store this key in a secrets management system like https://zeit.co/docs/v2/serverless-functions/env-and-secrets
