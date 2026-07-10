# --- Stage 1: build ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
# package-lock.json이 package.json과 어긋나 있어 npm ci(엄격 동기화 요구)가 실패함.
# 이건 이번 작업과 무관한 기존 드리프트라 npm install로 우회.
RUN npm install

COPY . .

# CRA는 REACT_APP_* 값을 빌드 시점에 번들 안에 굽는다 (런타임에 못 바꿈)
ARG REACT_APP_KAKAO_MAPS_API_KEY
ENV REACT_APP_KAKAO_MAPS_API_KEY=$REACT_APP_KAKAO_MAPS_API_KEY

RUN npm run build

# --- Stage 2: serve ---
FROM nginx:1.27-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
