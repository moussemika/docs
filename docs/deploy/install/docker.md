# Docker 部署

## 前置

首先你需要安装 docker 服务，包括 `docker` 与 `docker-compose`。参考[官方文档](https://www.docker.com/get-started/)

在此种部署方式中，你无需自行启动 `redis` 服务，docker 将会附带启动一个 `redis` 容器。

## 拉取项目

与[手动部署](./manual.md)相同的步骤

```bash
git clone https://ghproxy.com/https://github.com/SilveryStar/Adachi-BOT.git
cd Adachi-BOT
```

## 启动项目

通过 docker-compose 直接以 docker 方式启动项目

```bash
docker-compose up -d
```

初次运行将在根目录 `config` 文件夹下生成配置文件模板，自行对修改配置文件内容。

修改配置文件完毕后，执行命令重启项目。

```bash
docker-compose restart
```

若未正常启动，可执行下方命令来查看错误信息

```bash
docker-compose logs -tf --tail 100
```