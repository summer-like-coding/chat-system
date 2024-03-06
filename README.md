# 加密聊天

## 1. 简介

一个支持端到端加密的 IM 系统，支持单聊、群聊。

- [x] 🚀 React 18 + Next.js 14 + TypeScript
- [x] ✨ UI 使用 [Ant Design](https://ant.design/) + [Tailwind CSS](https://tailwindcss.com/)
- [x] 💡 使用 [Protobuf](https://github.com/protobufjs/protobuf.js/) 通信，并支持端到端加密
- [x] 🥭 [Prisma](https://www.prisma.io/) + [MongoDB](https://www.mongodb.com/) 数据库
- [x] 💾 [Zustand](https://github.com/pmndrs/zustand) 存储
- [x] 🪝 随处可用的 [ahooks](https://ahooks.js.org/) 钩子
- [x] 🎇 [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new) + 自动修复
- [x] 📐 超简单的 [Git 钩子](https://github.com/toplenboren/simple-git-hooks)，规范提交代码

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

> [!TIP]
> 创建开发/测试使用的 MongoDB：
>
> ```bash
> docker run -d \
>     --name mongo \
>     -p 27017:27017 \
>     -e MONGO_INITDB_ROOT_USERNAME=admin \
>     -e MONGO_INITDB_ROOT_PASSWORD=password \
>     mongo:7.0.5
> ```

## 3. 部署

复制并配置环境变量：

```bash
cp .env.example .env.production
```

构建项目：

```bash
pnpm build
```

运行构建后的项目：

```bash
pnpm start
```

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
