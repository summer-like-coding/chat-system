# 搭建 MongoDB 副本集（开发）

拉取镜像：

```bash
docker pull mongo:7.0.5
```

创建密钥：

```bash
cd tools/mongo
mkdir -p secrets
openssl rand -base64 756 > secrets/rs0.key
chmod 400 secrets/rs0.key
```

启动集群：

```bash
docker compose up -d
```

需要手动初始化集群，先进去第一个容器：

```bash
docker exec -it mongo1 mongosh
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

看到 `{ "ok" : 1 }` 就说明初始化成功，可以通过副本集地址访问。
