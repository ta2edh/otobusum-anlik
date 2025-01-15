ARG PORT

FROM node:lts-alpine as node-builder

WORKDIR /usr/src/otobusum-anlik
COPY . .

RUN npm install
RUN npx expo export -p web

FROM rust:latest

COPY --from=node-builder /usr/src/otobusum-anlik /usr/src/otobusum-anlik
WORKDIR /usr/src/otobusum-anlik/server

RUN cargo build --release

EXPOSE ${PORT}
ENTRYPOINT [ "./target/release/server" ]
