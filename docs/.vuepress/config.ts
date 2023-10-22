import { defineConfig } from "vuepress/config";

export default defineConfig( {
    title: "Adachi-Docs",
    description: "Adachi-BOT 文档",
    head: [
        [ "link", { rel: "icon", href: "/favicon.ico" } ]
    ],
    themeConfig: {
        lastUpdated: "最后编辑于",
        smoothScroll: true,
        sidebar: {
            "/deploy/": [ {
                title: "安装",
                collapsable: false,
                children: [ {
                    title: "环境准备",
                    path: "/deploy/install/"
                }, {
                    title: "手动部署",
                    path: "install/manual"
                } , {
                    title: "Docker 部署",
                    path: "install/docker"
                } ],
            }, {
                title: "使用",
                collapsable: false,
                children: [ {
                    title: "使用指令",
                    path: "/deploy/use/"
                }, {
                    title: "内置指令",
                    path: "use/built-in"
                }, {
                    title: "配置文件",
                    path: "use/config"
                }, {
                    title: "更新 bot",
                    path: "use/update"
                }, {
                    title: "使用插件",
                    path: "use/plugin"
                } ],
            }, {
                title: "其他",
                collapsable: false,
                children: [ {
                    title: "网页控制台",
                    path: "/deploy/other/"
                } ],
            } ] ,
            "/plugin/genshin/": [
                "",
                "picture",
                "statement"
            ],
            "/guide/": [ {
                title: "开始",
                collapsable: false,
                children: [ {
                    title: "起步",
                    path: "/guide/quick-start/"
                }, {
                    title: "网页控制台",
                    path: "quick-start/web-console"
                }, {
                    title: "创建一个插件",
                    path: "quick-start/new-plugin"
                } ]
            }, {
                title: "插件",
                collapsable: false,
                children: [ {
                    title: "插件声明",
                    path: "/guide/plugin/"
                }, {
                    title: "公共 express-server",
                    path: "plugin/public-server"
                }, {
                    title: "适配热更新插件指令",
                    path: "plugin/hot-update"
                }, {
                    title: "下载插件静态资源",
                    path: "plugin/static-resource"
                }, {
                    title: "订阅服务支持",
                    path: "plugin/subscribe"
                }, {
                    title: "生命周期钩子",
                    path: "plugin/lifecycle"
                }, {
                    title: "图片渲染器",
                    path: "plugin/pic-render"
                }, {
                    title: "注册插件配置文件",
                    path: "plugin/config-file"
                } ]
            }, {
                title: "指令",
                collapsable: false,
                children: [ {
                    title: "介绍",
                    path: "/guide/directive/"
                }, {
                    title: "Order 指令",
                    path: "directive/order"
                }, {
                    title: "Switch 指令",
                    path: "directive/switch"
                }, {
                    title: "Enquire 指令",
                    path: "directive/enquire"
                } ]
            }, {
                title: "全局工具类",
                collapsable: false,
                children: [ {
                    title: "总览",
                    path: "/guide/global/"
                }, {
                    title: "redis",
                    path: "global/redis"
                }, {
                    title: "config",
                    path: "global/config"
                }, {
                    title: "client",
                    path: "global/client"
                }, {
                    title: "interval",
                    path: "global/interval"
                }, {
                    title: "file",
                    path: "global/file"
                }, {
                    title: "auth",
                    path: "global/auth"
                }, {
                    title: "message",
                    path: "global/message"
                }, {
                    title: "mail",
                    path: "global/mail"
                }, {
                    title: "command",
                    path: "global/command"
                }, {
                    title: "renderer",
                    path: "global/renderer"
                } ]
            } ],
            "/api/": [ {
                title: "全局工具类 Api",
                collapsable: false,
                children: [ {
                    title: "redis",
                    path: "global/redis"
                }, {
                    title: "config",
                    path: "global/config"
                }, {
                    title: "interval",
                    path: "global/interval"
                }, {
                    title: "file",
                    path: "global/file"
                }, {
                    title: "auth",
                    path: "global/auth"
                }, {
                    title: "message",
                    path: "global/message"
                }, {
                    title: "mail",
                    path: "global/mail"
                }, {
                    title: "command",
                    path: "global/command"
                }, {
                    title: "renderer",
                    path: "global/renderer"
                } ]
            }, {
                title: "通用工具 utils",
                collapsable: false,
                children: [ {
                    title: "概览",
                    path: "/api/utils/"
                }, {
                    title: "progress",
                    path: "utils/progress"
                }, {
                    title: "request",
                    path: "utils/request"
                } ]
            } ],
            "/migration/": [ {
                title: "指南",
                collapsable: false,
                children: [ {
                    title: "概览",
                    path: "/migration/guide/"
                }, {
                    title: "新的增强功能",
                    path: "guide/feature"
                }, {
                    title: "破坏性变更",
                    path: "guide/breaking-changes"
                } ]
            },  {
                title: "项目环境",
                collapsable: false,
                children: [ {
                    title: "Cli 命令变更",
                    path: "/migration/environment/"
                }, {
                    title: "Redis 版本变更",
                    path: "environment/redis"
                } ]
            },  {
                title: "核心库",
                collapsable: false,
                children: [ {
                    title: "重写的 Client 核心类",
                    path: "/migration/core/"
                }, {
                    title: "重构的 Config 核心类",
                    path: "core/config"
                }, {
                    title: "Refresh 核心类变更",
                    path: "core/refresh"
                }, {
                    title: "通用工具类/方法",
                    path: "core/utils"
                } ]
            },  {
                title: "插件",
                collapsable: false,
                children: [ {
                    title: "新的插件入口定义",
                    path: "/migration/plugin/"
                } ]
            },  {
                title: "指令",
                collapsable: false,
                children: [ {
                    title: "新的指令入口定义",
                    path: "/migration/directive/"
                }, {
                    title: "新指令属性 priority",
                    path: "directive/priority"
                }, {
                    title: "order 指令参数的匹配内容",
                    path: "directive/order-match"
                }, {
                    title: "重写的 Enquire 指令",
                    path: "directive/enquire"
                } ]
            } ]
        },
        nav: [
            { text: "部署", link: "/deploy/install/" },
            {
                text: "配置",
                items: [
                    { text: "基本配置", link: "/config/base.html" },
                    { text: "指令配置", link: "/config/commands.html" }
                ]
            },
            {
                text: "插件",
                link: "/plugin/",
                items: [
                    { text: "genshin", link: "/plugin/genshin/" }
                ]
            },
            {
                text: "开发者",
                link: "/developer/",
                items: [
                    { text: "指南", link: "/guide/quick-start/" },
                    { text: "API", link: "/api/global/redis" },
                    { text: "v3 迁移文档", link: "/migration/guide/" }
                ]
            },
            { text: "FAQ", link: "/faq/" },
            { text: "致谢", link: "/thank/" },
            { text: "GitHub", link: "https://github.com/SilveryStar/Adachi-BOT" }
        ]
    }
} );