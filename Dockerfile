FROM node:lts-alpine AS base

ARG PLAUSIBLE_URL
ARG PLAUSIBLE_DOMAIN

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
COPY . .
RUN npm i -g corepack@latest 
RUN corepack enable

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ENV PUBLIC_PLAUSIBLE_URL=$PLAUSIBLE_URL
ENV PUBLIC_PLAUSIBLE_DOMAIN=$PLAUSIBLE_DOMAIN
RUN pnpm run build

FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]