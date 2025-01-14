FROM node:lts-alpine

WORKDIR /usr/src/otobusum-anlik
COPY . .

RUN npm install
RUN npx expo export -p web

FROM rust:latest

WORKDIR /usr/src/otobusum-anlik/server
COPY --from=node:lts-alpine /usr/src/otobusum-anlik/dist /usr/src/otobusum-anlik/server

RUN cargo build --release

EXPOSE 3000
ENTRYPOINT [ "./target/release/server" ]
