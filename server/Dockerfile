ARG PORT
ARG EXPO_PUBLIC_MAP_API
ARG EXPO_PUBLIC_BASE_URL

FROM node:lts-alpine as node-builder

WORKDIR /usr/src/otobusum-anlik
COPY . .

RUN npm install
RUN npx expo export -p web

FROM rust:latest

COPY --from=node-builder /usr/src/otobusum-anlik /usr/src/otobusum-anlik
WORKDIR /usr/src/otobusum-anlik/server

RUN cargo build --release

ENV PORT=${PORT}
ENV EXPO_PUBLIC_MAP_API=${EXPO_PUBLIC_MAP_API}
ENV EXPO_PUBLIC_BASE_URL=${EXPO_PUBLIC_BASE_URL}

EXPOSE ${PORT}
ENTRYPOINT [ "./target/release/server" ]
