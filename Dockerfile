FROM golang:1.21-alpine AS backend-builder
WORKDIR /build
COPY kubelab-backend/go.mod kubelab-backend/go.sum kubelab-backend/main.go ./
COPY kubelab-backend/hooks ./hooks
COPY kubelab-backend/pkg ./pkg
COPY kubelab-backend/vcluster-values.yaml ./vcluster-values.yaml
RUN apk --no-cache add upx make git gcc libtool musl-dev ca-certificates dumb-init \
  && go mod tidy \
  && CGO_ENABLED=0 go build \
  && upx kubelab

FROM node:lts-slim as ui-builder
WORKDIR /build
COPY ./kubelab-ui/package*.json ./
RUN rm -rf ./node_modules
RUN rm -rf ./build
COPY ./kubelab-ui .
RUN npm install --legacy-peer-deps
RUN npm run build

FROM alpine as runtime
WORKDIR /app/kubelab
COPY --from=backend-builder /build/kubelab /app/kubelab/kubelab
COPY --from=backend-builder /build/vcluster-values.yaml /app/kubelab/vcluster-values.yaml
COPY ./kubelab-backend/pb_migrations ./pb_migrations
COPY --from=ui-builder /build/build /app/kubelab/pb_public
EXPOSE 8090
CMD ["/app/kubelab/kubelab","serve", "--http", "0.0.0.0:8090"]
