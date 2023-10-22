# 通用工具 utils

在 `src/utils` 中新提供了一些常用工具类/方法，可自行参考注释引入使用，这里仅对两个工具类作出说明。

## progress

该类用于创建一个单行进度条打印输出。

### 食用方法

```ts
import Progress from "@/utils/progress";

// 定义前缀内容、最大值与进度条最大长度
const total = 114;
const progress = new Progress( "下载进度", total, 50 );

// 遍历渲染递增进度
function downloading( completed: number = 0 ) {
    if ( completed > total ) return;
    progress.renderer( completed );
    completed++;
    setTimeout( () => {
        downloading( completed );
    }, 500 );
}

downloading();
```

```text
下载进度: ████████████████████████████████████████████░░░░░░  108/114
```

### new Progress()

创建一个 Progress 实例

- 参数1：前方所展示的描述文字
- 参数2：进度条的最大值
- 参数3：进度条的长度

### progress.renderer()

渲染输出进度内容。

- 参数1：当前进度条的值

## request

通用 ajax 请求类 `request`，该类对 axios 进行了一定的封装，尽可能地保证优化使用的同时不对开发者进行过多的限制。

该类抛出了一个方法 `register`，方法接收两个参数：axios 配置对象 baseConfig 和 api 列表对象 apis。并返回封装好的请求对象 request 与 axios 服务对象 server。其类型定义如下：

```ts
export type FetchGetMethod = "get" | "delete";
export type FetchPostMethod = "post" | "put";
export type FetchMethod = FetchGetMethod | FetchPostMethod;

export type FetchUrlFormat = ( url: string ) => string | Record<string, any>;
export interface FetchRequest<T = AxiosResponse> {
	<D = any>( params?: D, config?: AxiosRequestConfig<D> ): Promise<T>;
	<D = any>( params?: D, urlFormat?: FetchUrlFormat, config?: AxiosRequestConfig<D> ): Promise<T>;
}
export type FetchServer<T extends string | number | symbol, D = AxiosResponse> = Record<T, Record<FetchMethod, FetchRequest<D>>>;

export interface RequestMethods {
	register<T extends Record<string, string>>( baseConfig: CreateAxiosDefaults, apis: T ): {
		request: FetchServer<keyof T>,
		server: AxiosInstance
	};
}
```

可以使用 `request.api键名.请求类型` 来获取 ajax 请求方法，方法共有三个参数：请求传递数据，重写请求 url 方法 和 axios 配置项。三个参数均可选。

- 参数1：当为 `get` 或 `delete` 请求时，对象将会作为查询参数以键值对形式拼接至 url 上，反之则作为 post 请求数据传递。
- 参数2：可选方法，不传递此参数时此位置将被参数3替代。该方法接受一个值为当前 url 的形参，允许的返回值为**对象**或**字符串**类型。
    - 对象：作为查询参数以键值对形式拼接至 url 上。
    - 字符串：以返回值作为真实的请求 url。
- 参数3：axios 配置对象，提供 baseUrl、header、timeout 等属性。

```ts
import { register } from "@/utils/request";

const apis = {
	GENSHIN_USER: "/genshin/uid/$/user",
	LOGIN: "/login",
	UPDATE_STATUS: "/update/status"
}

const { server, request: $https } = register( {
	baseURL: "https://114.514.19.19",
	headers: {
		"content-type": "application/json"
	},
	timeout: 60000
}, apis )

// https://114.514.19.19/genshin/uid/100375694/user
// POST
// data: {random: true}
// headers: "content-type": "application/json"
$https.GENSHIN_USER.post( { random: true }, url => url.replace( "$", "100375694" ) ).then( res => {
	if ( res.status === 200 ) {
		console.log( res.data );
	}
} )


// https://114.514.19.19/login?s=114514
// POST
// data: {username: AsukaMari}
// headers: "content-type": "application/json"
$https.LOGIN.post( { username: "AsukaMari" }, () => ( { s: 114514 } ) ).then( res => {
	if ( res.status === 200 ) {
		console.log( res.data );
	}
} )

// https://114.514.19.19/update/status
// POST
// data: null
// headers: "User-Agent": "Adachi-BOT"
$https.UPDATE_STATUS.post( {}, {
	headers: {
		"User-Agent": "Adachi-BOT"
	}
} ).then( res => {
	if ( res.status === 200 ) {
		console.log( res.data );
	}
} )
```

### 自行设置请求返回值

默认情况下，请求所得的返回值为 axios 默认返回值类型，包含 status、data 等属性。可通过 `register` 方法抛出的 `server` 对象来进行响应拦截设置。此时需要自行对 `request` 对象的类型进行定义。

```ts
import { FetchServer } from "@/utils/request";

const { server, request } = bot.request.register( {
	baseURL: "/api",
	responseType: "json",
	timeout: 60000,
	headers: {
		'Content-Type': 'application/json;charset=UTF-8'
	}
}, apis );

// 设置响应拦截
server.interceptors.response.use( resp => {
    return Promise.resolve( resp.data );
} );

// 重新定义 request 的类型
type FetchResponse<D = any> = {
    code: number;
    data: D;
    msg?: string;
    total?: number;
}

export default <FetchServer<keyof typeof apis, FetchResponse>><unknown>request;
```

定义类型后，请求所得的响应对象将会变为 `FetchResponse` 类型。