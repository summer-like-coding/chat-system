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
> 请参考如何 [创建开发/测试使用的 MongoDB](./tools/mongo/README.md)。

## 3. 部署

复制并配置环境变量：

```bash
cp .env.example .env.production
```

确保已经配置了

### 3.1 本地构建

构建项目：

```bash
pnpm build
```

运行构建后的项目：

```bash
pnpm start
```

### 3.2 Docker 构建

Docker 构建并运行：

```bash
docker build -t chat-system .

docker run -d \
  -p 3000:3000 \
  --restart=always \
  --name chat-system \
  chat-system
```

### 3.3 Docker Compose

创建密钥：

```bash
mkdir -p secrets
openssl rand -base64 756 > secrets/rs0.key
chmod 400 secrets/rs0.key
```

Docker Compose 部署：

```bash
docker compose up -d --env-file .env.production
```

需要手动初始化集群，进入任意容器：

```bash
docker exec -it $mongo_container mongosh
```

初始化集群：

```js
use admin
db.auth('root', 'password')
config = {
  _id: "rs0",
  members: [
    {_id: 0, host: "host.docker.internal:27017"},
    {_id: 1, host: "host.docker.internal:27018"},
    {_id: 2, host: "host.docker.internal:27019"},
  ]
}
rs.initiate(config)
```

关闭 Docker Compose：

```bash
docker compose down
```
