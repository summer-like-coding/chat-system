# 部署示例

先进行域名解析，以 `im.darling-summer.top` 为例。

Nginx 服务器配置下列内容。

```nginx
server {
    listen 80;
    server_name im.darling-summer.top;
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
}
```

使用 Certbot 申请证书：

```bash
sudo certbot --nginx
```
