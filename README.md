# 加密聊天

## 1. 简介

一个支持端到端加密的 IM 系统，支持单聊、群聊。

- [x] 🚀 React 18 + Next.js 14 + TypeScript
- [x] ✨ UI 使用 [Ant Design](https://ant.design/) + [Tailwind CSS](https://tailwindcss.com/)
- [x] 💡 使用 [Socket.IO](https://socket.io/) 通信，支持端到端加密
- [x] 🥭 [Prisma ORM](https://www.prisma.io/) + [MongoDB](https://www.mongodb.com/) 数据库
- [x] 💾 [Zustand](https://github.com/pmndrs/zustand) 存储
- [x] 🪝 随处可用的 [ahooks](https://ahooks.js.org/) 钩子
- [x] 🎇 [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new) + 自动修复
- [x] 📐 超简单的 [Git 钩子](https://github.com/toplenboren/simple-git-hooks)，规范提交代码

## 2. 开始

> [!TIP]
> 推荐阅读如何使用 [Docker Compose 部署开发环境](./docs/develop/README.md)，而无需安装 MongoDB、Redis、RabbitMQ。

项目依赖：

- Node.js >= 20.x
- pnpm >= 9.x

建议使用 NVM 管理 Node.js 版本：

```bash
nvm install 20
nvm use 20
```

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

为了显示即时通讯效果，开发时请启动 [chat-websocket](https://github.com/summer-like-coding/chat-websocket) 项目，详情参见项目文档。

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

Docker 部署参见 [Docker 部署](./docs/deploy/README.md)。
