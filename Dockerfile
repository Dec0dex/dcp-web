FROM node:alpine As builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN pnpm install

COPY . .

RUN pnpm build --prod

FROM nginx:alpine

COPY --from=builder /usr/src/app/dist/angular-starter/ /usr/share/nginx/html