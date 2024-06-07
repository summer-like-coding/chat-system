# Docker 部署示例

## Docker 构建

确保配置好 `.env.production` 文件，然后安装 Docker。

> 配置示例如下，请首先将 `xxxxxx` 部分替换为实际内容：
>
> ```properties
> DATABASE_URL="mongodb://root:password@mongo1:27017,mongo2:27017,mongo3:27017/chat_system?replicaSet=rs0&authSource=admin"
> NEXTAUTH_SECRET="xxxxxx"
> NEXTAUTH_URL="https://im.xxxxxx.com"
> OPENAI_API_KEY="sk-xxxxxx"
> OPENAI_BASE_URL="https://api.openai.com/v1"
> OSS_ACCESS_KEY_ID="xxxxxx"
> OSS_ACCESS_KEY_SECRET="xxxxxx"
> OSS_BUCKET="xxxxxx"
> OSS_REGION="oss-cn-shanghai-internal"
> RABBITMQ_URL="amqp://admin:password@rabbitmq:5672"
> NEXT_PUBLIC_SOCKETIO_SERVER_URL="https://im.xxxxxx.com"
> NEXT_PUBLIC_SOCKETIO_PATH="/socketio/"
> REDIS_URL="redis://redis:6379"
>
> # 以下为数据库和消息队列的默认密码，修改之后不要忘记上面的 URL 也需要修改
> MONGO_ROOT_PASSWORD="password"
> RABBITMQ_DEFAULT_PASS="password"
> ```

拉取镜像：

```bash
docker pull node:22.2.0-bookworm
docker pull node:22.2.0-bookworm-slim
docker pull nginx:1.27.0-alpine3.19-slim
docker pull mongo:7.0.5
docker pull rabbitmq:3.13.0-management-alpine
docker pull redis:7.2.4-alpine3.19
```

先构建 [chat-websocket](https://github.com/summer-like-coding/chat-websocket) 项目，详情参见项目 README 文档。本项目将 Docker Compose 的构建和生产分开，为了方便调试并流程化部署。

Docker 构建：

```bash
docker build -t chat-system-web . -f docker/Dockerfile
```

创建 MongoDB 副本集密钥：

```bash
mkdir secrets
openssl rand -base64 756 > secrets/rs0.key
chmod 400 secrets/rs0.key
```

使用 Docker Compose 部署：

```bash
docker compose --env-file .env.production up -d
```

需要手动初始化 MongoDB 副本集，进入任意容器（此操作需要等待 MongoDB 容器全部初始化完成）：

```bash
docker exec -it chat-system-mongo1-1 mongosh
```

初始化集群：

```js
use admin
db.auth('root', 'password')
config = {
  _id: "rs0",
  members: [
    {_id: 0, host: "mongo1:27017"},
    {_id: 1, host: "mongo2:27017"},
    {_id: 2, host: "mongo3:27017"},
  ]
}
rs.initiate(config)
exit
```

> [!WARNING]
> MongoDB 副本集使用的地址解析为 Docker Compose 内部地址，如 `mongo1`、`mongo2`，此副本集地址不能被外部访问，即使端口被暴露。如果需要外部访问，请在 `docker-compose.yml` 文件中暴露 MongoDB 端口，然后将上述地址替换为外部访问地址，如 `mongo.xxxxxx.com:27017`。

🧨🧨🧨 停止并卸载全部服务：

```bash
docker compose down
```

## Nginx 代理并配置 SSL

Certbot 是一个免费的开源工具，用于为 Nginx、Apache 和其他 Web 服务器自动设置 SSL 证书。如果没有 Certbot，可以先安装：

```bash
sudo apt install certbot python3-certbot-nginx
```

先在域名注册商处进行域名解析，只有解析成功才能使用 Certbot，以 `im.xxxxxx.com"` 为例。

Nginx 服务器配置下列内容（可以在 `/etc/nginx/sites-available/` 中新建文件，或编辑 `/etc/nginx/nginx.conf`）：

```nginx
server {
    listen 80;
    server_name im.xxxxxx.com;
    client_max_body_size 128m;

    location / {
        proxy_pass http://127.0.0.1:5201/;
        proxy_set_header Host $host;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header REMOTE-HOST $remote_addr;
    }

    location ^~ /socketio/ {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://127.0.0.1:5202;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

使用 Certbot 申请证书：

```bash
sudo certbot --nginx
```

申请成功后，Nginx 会自动配置 SSL 证书。
