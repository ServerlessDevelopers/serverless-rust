# Build arg for controlling the Rust version
ARG RUST_VERSION=1.77

# Base image that is the builder that originates from Alpine
FROM rust:${RUST_VERSION}-alpine as builder

# adding in SSL and libc-dev as required to compile with Tokio
# and other crates included
RUN apk add pkgconfig openssl-dev libc-dev

WORKDIR /usr/src/app

# Trick Docker and Rust to cache dependencies so taht future runs of Docker build
# will happen much quicker as long as crates in the Cargo.tom and lock file don't change.
# When they change, it'll force a refresh
COPY Cargo.toml Cargo.lock ./
RUN mkdir ./src && echo 'fn main() {}' > ./src/main.rs
RUN cargo build --release

# Replace with the real src of the project
RUN rm -rf ./src
COPY ./src ./src

# break the Cargo cache
RUN touch ./src/main.rs

# Build the project
# Note that in the Cargo.toml file there is a release profile that optimizes
# this build
RUN cargo build --release

# Build final layer from the base alpine image
FROM alpine:latest

# Build arguments to allow overrides
#   APP_USER: user that runs the binary
#   APP_GROUP: the group for the new user
#   EXPOSED_PORT: the port that the container is exposing
ARG APP_USER=rust_user
ARG APP_GROUP=rust_group
ARG EXPOSED_PORT=8080
ARG APP=/usr/app

# Add the uer, group and make directory for the build artifiacts
#   Performing as one continuous statement to condense layers
RUN apk update \
    &&  apk add openssl ca-certificates \
    &&  addgroup -S ${APP_GROUP} \
    &&  adduser -S ${APP_USER} -G ${APP_GROUP} \
    &&  mkdir -p ${APP}

EXPOSE $EXPOSED_PORT
COPY --from=builder /usr/src/app/target/release/web_app ${APP}/web_app
RUN chown -R $APP_USER:$APP_GROUP ${APP}
USER $APP_USER
WORKDIR ${APP}

CMD ["./web_app"]