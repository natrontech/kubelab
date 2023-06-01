FROM golang:1.20-alpine AS backend-builder
WORKDIR /build
COPY kubelab-backend/go.mod kubelab-backend/go.sum kubelab-backend/main.go ./
COPY kubelab-backend/hooks ./hooks
RUN apk --no-cache add upx make git gcc libtool musl-dev ca-certificates dumb-init \
  && go mod tidy \
  && CGO_ENABLED=0 go build \
  && upx pocketbase

FROM node:lts-slim as ui-builder
WORKDIR /build
COPY ./kubelab-ui/package*.json ./
RUN rm -rf ./node_modules
RUN rm -rf ./build
COPY ./kubelab-ui .
RUN npm install
RUN npm run build

FROM alpine as runtime
WORKDIR /app/kubelab
COPY --from=backend-builder /build/pocketbase /app/kubelab/pocketbase
COPY ./kubelab-backend/pb_migrations ./pb_migrations
COPY --from=ui-builder /build/build /app/kubelab/pb_public
EXPOSE 8090
CMD ["/app/kubelab/pocketbase","serve", "--http", "0.0.0.0:8090"]
