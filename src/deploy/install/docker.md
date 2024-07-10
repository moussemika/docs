# Docker 部署

## 前置

首先你需要安装 docker 服务，包括 `docker` 与 `docker-compose`。参考[官方文档](https://www.docker.com/get-started/)

在此种部署方式中，你无需自行启动 `redis` 服务，docker 将会附带启动一个 `redis` 容器。

## 拉取项目

与[手动部署](./manual)相同的步骤

```bash
git clone https://mirror.ghproxy.com/https://github.com/SilveryStar/Adachi-BOT.git
cd Adachi-BOT
```

## 初次启动项目

通过 `docker-compose` 直接以 `docker` 方式启动项目

```bash
docker-compose up -d
```

## 修改配置文件

与手动部署一样，初次运行将在根目录 `config` 文件夹下生成配置文件模板，需要自行对修改配置文件内容。

不同的是，当使用本地自建的 `OneBot` 实现时，`config/base.yml => wsServer` 中的 ip 部分不能使用 `localhost` 或 `127.0.0.1`。

首先检查 Docker 版本：

```bash
docker -v
```

若为 `18.03` 以上，可以使用 `host.docker.internal` 来替代 ip 部分，例如: `host.docker.internal:8080`。

反之需要根据不同环境按照以下方式手动获取主机地址

### linux

查看网关信息

```bash
ifconfig eth0
```

结果中 `inet` 后即为主机地址

![eth0](/install/ifconfig.png)

### windows

查看网关信息

```bash
ipconfig
```

在结果中查找 `以太网适配器 vEthernet (WSL):` 开头的一项，使用 `IPv4 地址` 作为主机地址

![WSL](/install/ipconfig.png)

## 再次启动项目

修改配置文件完毕后，执行命令重启项目。

```bash
docker-compose restart
```

若未正常启动，可执行下方命令来查看错误信息

```bash
docker-compose logs -tf --tail 100
```
