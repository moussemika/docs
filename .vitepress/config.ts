import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	lang: "zh-cn",
	outDir: "./dist",
	srcDir: "./src",
	srcExclude: [ "./src/developer/*", "./src/pic_bed/*" ],
	title: "Adachi-Docs",
	description: "Adachi-BOT 文档",
	lastUpdated: true,
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		siteTitle: "Adachi-BOT",
		lastUpdatedText: "最后编辑于",
		outline: {
			label: "页面导航",
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
				items: [
					{ text: "genshin", link: "/plugin/genshin/" }
				]
			},
			{
				text: "开发者",
				items: [
					{ text: "指南", link: "/guide/quick_start/" },
					{ text: "API", link: "/api/global/redis" },
					{ text: "v3 迁移文档", link: "/migration/guide/" }
				]
			},
			{ text: "FAQ", link: "/faq/" },
			{ text: "致谢", link: "/thank/" }
		],
		
		sidebar: {
			"/deploy/": [ {
				text: "安装",
				collapsable: false,
				items: [ {
					text: "环境准备",
					link: "/deploy/install/"
				}, {
					text: "手动部署",
					link: "/deploy/install/manual"
				} , {
					text: "Docker 部署",
					link: "/deploy/install/docker"
				} ],
			}, {
				text: "使用",
				collapsable: false,
				items: [ {
					text: "使用指令",
					link: "/deploy/use/"
				}, {
					text: "内置指令",
					link: "/deploy/use/built_in"
				}, {
					text: "配置文件",
					link: "/deploy/use/config"
				}, {
					text: "更新 bot",
					link: "/deploy/use/update"
				}, {
					text: "使用插件",
					link: "/deploy/use/plugin"
				} ],
			}, {
				text: "其他",
				collapsable: false,
				items: [ {
					text: "网页控制台",
					link: "/deploy/other/"
				} ],
			} ] ,
			"/plugin/genshin/": [ {
				text: "原神插件",
				collapsable: false,
				items: [ {
					text: "配置",
					link: "/plugin/genshin/"
				}, {
					text: "图片样例",
					link: "/plugin/genshin/picture"
				}, {
					text: "相关声明",
					link: "/plugin/genshin/statement"
				}, {
					text: "致谢",
					link: "/plugin/genshin/thanks"
				} ]
			} ],
			"/guide/": [ {
				text: "开始",
				collapsable: false,
				items: [ {
					text: "起步",
					link: "/guide/quick_start/"
				}, {
					text: "网页控制台",
					link: "/guide/quick_start/web_console"
				}, {
					text: "创建一个插件",
					link: "/guide/quick_start/new_plugin"
				} ]
			}, {
				text: "插件",
				collapsable: false,
				items: [ {
					text: "插件声明",
					link: "/guide/plugin/"
				}, {
					text: "公共 express-server",
					link: "/guide/plugin/public_server"
				}, {
					text: "适配热更新插件指令",
					link: "/guide/plugin/hot_update"
				}, {
					text: "下载插件静态资源",
					link: "/guide/plugin/static_resource"
				}, {
					text: "静态资源托管目录",
					link: "/guide/plugin/public_dirs"
				}, {
					text: "订阅服务支持",
					link: "/guide/plugin/subscribe"
				}, {
					text: "生命周期钩子",
					link: "/guide/plugin/lifecycle"
				}, {
					text: "图片渲染器",
					link: "/guide/plugin/pic_render"
				}, {
					text: "注册插件配置文件",
					link: "/guide/plugin/config_file"
				} ]
			}, {
				text: "指令",
				collapsable: false,
				items: [ {
					text: "介绍",
					link: "/guide/directive/"
				}, {
					text: "Order 指令",
					link: "/guide/directive/order"
				}, {
					text: "Switch 指令",
					link: "/guide/directive/switch"
				}, {
					text: "Enquire 指令",
					link: "/guide/directive/enquire"
				} ]
			}, {
				text: "全局工具类",
				collapsable: false,
				items: [ {
					text: "总览",
					link: "/guide/global/"
				}, {
					text: "redis",
					link: "/guide/global/redis"
				}, {
					text: "config",
					link: "/guide/global/config"
				}, {
					text: "client",
					link: "/guide/global/client"
				}, {
					text: "interval",
					link: "/guide/global/interval"
				}, {
					text: "file",
					link: "/guide/global/file"
				}, {
					text: "auth",
					link: "/guide/global/auth"
				}, {
					text: "message",
					link: "/guide/global/message"
				}, {
					text: "mail",
					link: "/guide/global/mail"
				}, {
					text: "command",
					link: "/guide/global/command"
				}, {
					text: "renderer",
					link: "/guide/global/renderer"
				} ]
			} ],
			"/api/": [ {
				text: "全局工具类 Api",
				collapsable: false,
				items: [ {
					text: "redis",
					link: "/api/global/redis"
				}, {
					text: "config",
					link: "/api/global/config"
				}, {
					text: "interval",
					link: "/api/global/interval"
				}, {
					text: "file",
					link: "/api/global/file"
				}, {
					text: "auth",
					link: "/api/global/auth"
				}, {
					text: "message",
					link: "/api/global/message"
				}, {
					text: "mail",
					link: "/api/global/mail"
				}, {
					text: "command",
					link: "/api/global/command"
				}, {
					text: "renderer",
					link: "/api/global/renderer"
				} ]
			}, {
				text: "通用工具 utils",
				collapsable: false,
				items: [ {
					text: "概览",
					link: "/api/utils/"
				}, {
					text: "progress",
					link: "/api/utils/progress"
				}, {
					text: "request",
					link: "/api/utils/request"
				} ]
			} ],
			"/migration/": [ {
				text: "指南",
				collapsable: false,
				items: [ {
					text: "概览",
					link: "/migration/guide/"
				}, {
					text: "新的增强功能",
					link: "/migration/guide/feature"
				}, {
					text: "破坏性变更",
					link: "/migration/guide/breaking_changes"
				} ]
			},  {
				text: "项目环境",
				collapsable: false,
				items: [ {
					text: "Cli 命令变更",
					link: "/migration/environment/"
				}, {
					text: "Redis 版本变更",
					link: "/migration/environment/redis"
				} ]
			},  {
				text: "核心库",
				collapsable: false,
				items: [ {
					text: "重写的 Client 核心类",
					link: "/migration/core/"
				}, {
					text: "重构的 Config 核心类",
					link: "/migration/core/config"
				}, {
					text: "Refresh 核心类变更",
					link: "/migration/core/refresh"
				}, {
					text: "通用工具类/方法",
					link: "/migration/core/utils"
				} ]
			},  {
				text: "插件",
				collapsable: false,
				items: [ {
					text: "新的插件入口定义",
					link: "/migration/plugin/"
				} ]
			},  {
				text: "指令",
				collapsable: false,
				items: [ {
					text: "新的指令入口定义",
					link: "/migration/directive/"
				}, {
					text: "新指令属性 priority",
					link: "/migration/directive/priority"
				}, {
					text: "order 指令参数的匹配内容",
					link: "/migration/directive/order_match"
				}, {
					text: "重写的 Enquire 指令",
					link: "/migration/directive/enquire"
				} ]
			} ]
		},
		
		footer: {
			message: "Released under the MIT License.",
			copyright: "Copyright © 2021-2024 SilveryStar"
		},
		
		socialLinks: [
			{
				icon: {
					svg: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 27.9 32"><g transform="translate(-.095 .005)" fill="#040404"><path d="m27.1 31.2v-30.5h-2.19v-0.732h3.04v32h-3.04v-0.732z"/><path d="m8.23 10.4v1.54h0.044c0.385-0.564 0.893-1.03 1.49-1.37 0.58-0.323 1.25-0.485 1.99-0.485 0.72 0 1.38 0.14 1.97 0.42 0.595 0.279 1.05 0.771 1.36 1.48 0.338-0.5 0.796-0.941 1.38-1.32 0.58-0.383 1.27-0.574 2.06-0.574 0.602 0 1.16 0.074 1.67 0.22 0.514 0.148 0.954 0.383 1.32 0.707 0.366 0.323 0.653 0.746 0.859 1.27 0.205 0.522 0.308 1.15 0.308 1.89v7.63h-3.13v-6.46c0-0.383-0.015-0.743-0.044-1.08-0.0209-0.307-0.103-0.607-0.242-0.882-0.133-0.251-0.336-0.458-0.584-0.596-0.257-0.146-0.606-0.22-1.05-0.22-0.44 0-0.796 0.085-1.07 0.253-0.272 0.17-0.485 0.39-0.639 0.662-0.159 0.287-0.264 0.602-0.308 0.927-0.052 0.347-0.078 0.697-0.078 1.05v6.35h-3.13v-6.4c0-0.338-7e-3 -0.673-0.021-1-0.0114-0.314-0.0749-0.623-0.188-0.916-0.108-0.277-0.3-0.512-0.55-0.673-0.258-0.168-0.636-0.253-1.14-0.253-0.198 0.0083-0.394 0.042-0.584 0.1-0.258 0.0745-0.498 0.202-0.705 0.374-0.228 0.184-0.422 0.449-0.584 0.794-0.161 0.346-0.242 0.798-0.242 1.36v6.62h-3.13v-11.4z"/><path d="m0.936 0.732v30.5h2.19v0.732h-3.04v-32h3.03v0.732z"/></g></svg>'
				},
				link: "https://chat.adachi.work/"
			},
			{ icon: "github", link: "https://github.com/SilveryStar/Adachi-BOT" }
		]
	}
})
