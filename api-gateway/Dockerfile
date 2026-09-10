FROM node:18-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY src ./src

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app /app
ENV PORT=4000
EXPOSE 4000
CMD ["node", "src/index.js"]
