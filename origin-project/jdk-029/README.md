# 夜航练习室

## 本地启动

```sh
npm ci
npm run dev
```

在浏览器打开 Vite 输出的本机地址。麦克风需要本机地址或 HTTPS。

## Docker 启动

```sh
docker compose up --build
```

打开 <http://localhost:8029>。可以通过 `NIGHT_SESSION_PORT` 指定其他端口。
