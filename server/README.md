# Weather Dashboard Backend

Node.js + Express backend for a multi-user weather dashboard.

## Features

- Email/password registration and login
- HMAC-signed bearer tokens
- Protected user profile route
- User-specific city CRUD with strict MongoDB ownership checks
- Favorite cities persisted per user
- Live weather lookup with Open-Meteo
- Weather planning insights endpoint for the AI/custom-feature portion

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `src/.env` from `.env.example`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/weather-app?retryWrites=true&w=majority
PORT=5000
JWT_SECRET_KEY=replace-with-a-long-random-secret
CLIENT_ORIGIN=http://localhost:5173
```

3. Start the API:

```bash
npm run dev
```

## API

- `POST /api/auth/register` with `{ "name", "email", "password" }`
- `POST /api/auth/login` with `{ "email", "password" }`
- `GET /api/auth/me` with `Authorization: Bearer <token>`
- `GET /api/cities`
- `POST /api/cities` with `{ "name", "isFavorite", "note" }`
- `GET /api/cities/preview?name=Delhi`
- `GET /api/cities/:id`
- `PATCH /api/cities/:id` with `{ "isFavorite", "note" }`
- `DELETE /api/cities/:id`
- `GET /api/insights`

## Architecture

The backend keeps request routing, controllers, models, middleware, and external services separate. Every city query includes `user: req.user.id`, so users cannot read, update, or delete another user's saved cities even if they guess an id.

Weather data is fetched dynamically from Open-Meteo. City coordinates are persisted so repeated dashboard loads avoid geocoding and only refresh current weather.

## AI Agent Design

`GET /api/insights` behaves as a weather planning agent: it reads the authenticated user's saved cities, fetches live weather, and returns practical recommendations. It is deterministic right now so it works without paid API keys. For the bonus requirement, the same city/weather context can be passed into a LangChain or LangGraph agent later.

## Security Notes

- Passwords are hashed with PBKDF2 and per-user random salts.
- Tokens are signed with `JWT_SECRET_KEY`.
- `.env` files are ignored by git.
- MongoDB uniqueness is scoped by user and city.
