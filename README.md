This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

local docker:
docker run -d \
--name <container name> \
-e POSTGRES_USER=<your_username> \
-e POSTGRES_PASSWORD=<your_password> \
-e POSTGRES_DB=<db_name> \
-p 5432:5432 \
postgres:16.10-bookworm
