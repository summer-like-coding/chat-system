# IM 加密聊天系统

## 1. 简介

## 2. 开始

项目依赖：

- Node.js >= 20.x
- pnpm >= 8.x

安装 `pnpm`：

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

安装依赖：

```bash
pnpm i
```

先准备配置开发环境：

```bash
cp .env.example .env
```

启动项目：

```bash
pnpm dev
```

格式化代码：

```bash
pnpm lint
```

构建项目：

```bash
pnpm build
```

运行构建后的项目：

```bash
pnpm start
```

## 3. 部署

Docker 构建并运行：

```bash
docker build -t im-chat-system .

docker run -d \
  -p 3000:3000 \
  --restart=always \
  --name im-chat-system \
  im-chat-system
```

Docker Compose 启动：

```bash
docker compose up -d
```

关闭 Docker Compose：

```bash
docker compose down
```
