#
# Build image
#
FROM rust:1.58.1 AS builder

# Create appuser
ENV USER=npuser
ENV UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    "${USER}"

WORKDIR /usr/src/app
# Create a new empty shell project
RUN USER=npuser cargo init --bin .
# Copy our manifests
COPY ./Cargo.toml ./Cargo.lock ./

# Build only the dependencies to cache them
RUN cargo build --release
RUN rm src/*.rs ./target/release/deps/nordpoolrust*

# Copy the source code
COPY ./src ./src

# Build for release.
RUN cargo build --release

#
# Final image
#
FROM debian:buster-20220125-slim

# Install ca-certificates to get rid of errors regarding missing libssl.so.1.1
RUN apt update && apt install -y ca-certificates

COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/target/release/nordpoolrust ./

# Use an unprivileged user.
USER npuser:npuser

EXPOSE 3014

CMD ["/usr/src/app/nordpoolrust"]

