FROM golang:X.Y-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /store-service ./cmd/server

FROM alpine:3.20
WORKDIR /app
COPY --from=build /store-service .
COPY migrations ./migrations
EXPOSE 3004
CMD ["./store-service"]