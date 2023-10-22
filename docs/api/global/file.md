# 工具类 File Api

## 类型定义

```ts
type PresetPlace = "config" | "plugin" | "root";
type FileType = "directory" | "file" | null;
export type CompressType = "zip" | "tgz" | "tar";

export interface FileResponse {
    /** 最终输出的绝对路径 */
    path: string;
}

/* 类型回执 */
export interface FileTypeResponse extends FileResponse {
    /** 文件类型 */
    type: FileType;
}

/* 创建回执 */
export interface FileStatusResponse extends FileResponse {
    /** 创建成功与否 */
    status: boolean;
}
```

## 方法列表

> 下面方法可能同时存在同步与异步两种方法，将会在类型中全部展示。
> 由于同步与异步方法除返回值是否为 `Promise` 类型外使用方式完全一致，因此只对异步方法做出解释。

### getFilePath()

```ts
interface ManagementMethod {
    getFilePath( path: string, place?: PresetPlace ): string;
}
```

- `path` 目标的相对路径地址
- `place` 相对路径的基地址，默认 `"config"`
- 返回值: 绝对路径地址

获取目标的绝对路径地址。

### isExist()

```ts
interface ManagementMethod {
    isExist( path: string ): Promise<boolean>;
    isExistSync( path: string ): boolean;
}
```

- `path` 目标的**绝对**路径地址
- 返回值: 是否存在

校验目标是否存在。

### getFileType()

```ts
interface ManagementMethod {
    getFileType( path: string ): Promise<FileTypeResponse>;
    getFileTypeSync( path: string ): FileTypeResponse;
}
```

- `path` 目标的**绝对**路径地址
- 返回值: 文件类型回执
  - `path` 目标的绝对路径
  - `type` 文件类型。当获取失败时（例如文件不存在），值为 `null`

获取目标的文件类型（文件/目录）。

### renameFile()

```ts
interface ManagementMethod {
    renameFile( fileName: string, newName: string, place?: PresetPlace ): Promise<void>;
    renameFileSync( fileName: string, newName: string, place?: PresetPlace ): void;
}
```

- `fileName` 原文件的相对路径地址
- `newName` 重命名文件的相对路径地址
- `place` 相对路径的基地址，默认 `"config"`

重命名文件。

### createDir()

```ts
interface ManagementMethod {
    createDir( dirName: string, place?: PresetPlace, recursive?: boolean ): Promise<FileStatusResponse>;
    createDirSync( dirName: string, place?: PresetPlace, recursive?: boolean ): FileStatusResponse;
}
```

- `dirName` 创建目标的相对路径地址
- `place` 相对路径的基地址，默认 `"config"`
- `recursive` 是否遍历创建父级目录，默认 `true`
- 返回值: 创建回执
  - `path` 目标目录的绝对路径
  - `status` 目标目录是否存在

创建目录。

### createParentDir()

```ts
interface ManagementMethod {
    createParentDir( fileName: string, place?: PresetPlace ): Promise<FileStatusResponse>;
    createParentDirSync( fileName: string, place?: PresetPlace ): FileStatusResponse;
}
```

- `dirName` 创建目标的相对路径地址
- `place` 相对路径的基地址，默认 `"config"`
- 返回值: 创建回执
  - `path` 目标文件的绝对路径
  - `status` 目标文件是否存在

循环遍历创建目标的父级目录。

### getDirFiles()

```ts
interface ManagementMethod {
    getDirFiles( dirName: string, place?: PresetPlace ): Promise<string[]>;
    getDirFilesSync( dirName: string, place?: PresetPlace ): string[];
}
```

- `dirName` 目标目录的相对路径地址
- `place` 相对路径的基地址，默认 `"config"`
- 返回值: 文件名列表

获取目标目录下的第一级文件列表。

### copyFile()

```ts
interface ManagementMethod {
    copyFile( originPath: string, targetPath: string, place?: PresetPlace ): Promise<string>;
    copyFileSync( originPath: string, targetPath: string, place?: PresetPlace ): string;
}
```

- `originPath` 源文件的相对路径地址
- `targetPath` 复制目标的相对路径地址
- `place` 相对路径的基地址，默认 `"config"`
- 返回值: 复制后文件的绝对路径

复制文件到指定路径，这种文件复制方式是相对安全的，它会循环遍历创建目标路径的父级目录。

但当源文件不存在时，它依旧会报错。

### createFile()

```ts
interface ManagementMethod {
    createFile( fileName: string, data: any, place?: PresetPlace ): Promise<FileStatusResponse>;
    createFileSync( fileName: string, data: any, place?: PresetPlace ): FileStatusResponse;
}
```

- `fileName` 创建的文件的相对路径地址
- `data` 创建文件时填入的初始内容
- `place` 相对路径的基地址，默认 `"config"`
- 返回值: 创建回执
  - `path` 被创建的文件的绝对路径
  - `status` 创建成功状态，目标已存在时，结果为 `false`

在指定路径下创建文件，这种文件创建方式是相对安全的，它会循环遍历创建目标路径的父级目录。
当目标文件已存在时，不会进行创建操作。

### loadFile()

```ts
interface ManagementMethod {
    loadFile( fileName: string, place?: PresetPlace, encoding?: BufferEncoding ): Promise<string | null>;
    loadFileSync( fileName: string, place?: PresetPlace, encoding?: BufferEncoding ): string | null;
}
```

- `fileName` 要读取的文件的相对路径地址
- `place` 相对路径的基地址，默认 `"config"`
- `encoding` 文件编码格式，默认 `"utf-8"`
- 返回值: 读取文件的内容

读取指定路径下的文件内容，若读取失败（例如文件不存在），则返回 `null`。

### loadFileByStream()

```ts
interface ManagementMethod {
    loadFileByStream( readSteam: fs.ReadStream ): Promise<Buffer | null>;
    loadFileByStream( fileName: string, highWaterMark?: number, place?: PresetPlace ): Promise<Buffer | null>;
}
```

有两种使用方式，第一种：

- `readSteam` 读取流
- 返回值: 读取文件的内容

第二种：

- `fileName` 要读取的文件的相对路径地址
- `highWaterMark` 最大缓冲数据量，单位 `KB`，默认 `64`
- `place` 相对路径的基地址，默认 `"config"`
- 返回值: 读取文件的内容

流式读取指定路径下的文件内容，返回 [Buffer] 格式的内容。若读取失败（例如文件不存在），则返回 `null`。

> 强烈推荐读取大文件时使用这种方式。

### writeFile()

```ts
interface ManagementMethod {
    writeFile( fileName: string, data: any, place?: PresetPlace ): Promise<string>;
    writeFileSync( fileName: string, data: any, place?: PresetPlace ): string;
}
```

- `fileName` 要写入的文件的相对路径地址
- `data` 待写入的内容
- `place` 相对路径的基地址，默认 `"config"`
- 返回值: 被写入文件的绝对路径

向目标文件中写入内容，会直接覆盖掉原内容。这种文件写入方式是相对安全的，它会循环遍历创建目标路径的父级目录。
当目标文件不存在时，会直接创建并写入内容。

### createYAML()

```ts
interface ManagementMethod {
    createYAML( ymlName: string, data: any, place?: PresetPlace ): Promise<FileStatusResponse>;
    createYAMLSync( ymlName: string, data: any, place?: PresetPlace ): FileStatusResponse;
}
```

- `ymlName` 要写入的 `.yml` 文件的相对路径地址，不需要携带后缀名
- `data` 待写入的内容
- `place` 相对路径的基地址，默认 `"config"`
- 返回值: 创建回执
  - `path` 被创建的文件的绝对路径
  - `status` 创建成功状态，目标已存在时，结果为 `false`

在指定路径下创建 `.yml` 文件，这是 [createFile()](#createfile) 的 `.yml` 特化版本。它会自动将 `data` 进行 [yaml-stringify][js-yaml] 转义为 `yaml` 文件格式内容后再进行写入。

由于其仅针对 `.yml` 文件，因此无需在 `ymlName` 参数中携带扩展名。

> yaml 文件相较于传统的 json 文件有诸多优势，常作为配置文件使用，可以详细了解一下 yaml 文件类型。

### loadYAML()

```ts
interface ManagementMethod {
    loadYAML( ymlName: string, place?: PresetPlace ): Promise<Record<string, any> | null>;
    loadYAMLSync( ymlName: string, place?: PresetPlace ): Record<string, any> | null;
}
```

- `ymlName` 要读取的 `.yml` 文件的相对路径地址，不需要携带后缀名
- `place` 相对路径的基地址，默认 `"config"`
- 返回值: 读取文件的内容

读取指定路径下的 `.yml` 文件内容，这是 [loadFile()](#loadfile) 的 `.yml` 特化版本。它会自动 通过 [yaml-parse][js-yaml] 将读取到的文件内容转义为键值对对象。

由于其仅针对 `.yml` 文件，因此无需在 `ymlName` 参数中携带扩展名。

### writeYAML()

```ts
interface ManagementMethod {
    writeYAML( ymlName: string, data: any, place?: PresetPlace ): Promise<string>;
    writeYAMLSync( ymlName: string, data: any, place?: PresetPlace ): string;
}
```

- `ymlName` 要写入的 `.yml` 文件的相对路径地址，不需要携带后缀名
- `data` 待写入的内容
- `place` 相对路径的基地址，默认 `"config"`
- 返回值: 被写入文件的绝对路径

向目标 `.yml` 文件中写入内容，这是 [writeFile()](#writefile) 的 `.yml` 特化版本。它会自动将 `data` 进行 [yaml-stringify][js-yaml] 转义为 `yaml` 文件格式内容后再进行写入。

由于其仅针对 `.yml` 文件，因此无需在 `ymlName` 参数中携带扩展名。

### deleteFile()

```ts
interface ManagementMethod {
    deleteFile( fileName: string, place?: PresetPlace ): Promise<FileStatusResponse>;
}
```

- `fileName` 要删除的文件或目录的相对路径地址
- `place` 相对路径的基地址，默认 `"config"`
- 返回值: 创建回执
  - `path` 删除文件或根目录的绝对路径
  - `status` 删除成功状态，目标不存在或存在删除失败的情况时，结果为 `false`

删除指定目标的文件或目录。当为目录时，将会遍历删除目录内的全部内容。

### unCompressFile()

```ts
interface ManagementMethod {
    unCompressFile( type: CompressType, originPath: string, targetPath: string, place?: PresetPlace ): Promise<FileStatusResponse>;
}
```

- `type` 待解压的文件类型
- `data` 压缩文件的相对路径地址
- `data` 解压目标目录的相对路径地址
- `place` 相对路径的基地址，默认 `"config"`
- 返回值: 创建回执

将指定类型的压缩文件内容解压到指定目录中。

### downloadFile()

```ts
interface ManagementMethod {
    downloadFile<T extends string | string[]>( url: string, savePath: T, setValueCallBack?: ( data: Buffer ) => any, place?: PresetPlace, retry?: number ): Promise<T>;
}
```

- `url` 要下载的文件 url 地址
- `savePath` 下载后的保存地址的相对路径，支持字符串或字符串数组
- `setValueCallBack` 可选，对下载的文件进行保存前处理的回调函数
  - `data` 下载的文件 [Buffer] 内容
  - 返回值: 处理后的文件内容
- `place` 相对路径的基地址，默认 `"root"`
- `retry` 失败重试次数，默认 `3`
- 返回值: 被下载文件的绝对路径，格式决定于 `savePath` 的格式

下载指定 `url` 地址的文件，并保存到 `savePath` 所指定位置。当需要保存到多个地址时，`savePath` 可以指定为字符串数组的形式。

文件下载后在保存之前会经过 `setValueCallBack` 一层处理，可执行自定义逻辑并返回最终用于保存的内容

返回值的类型由 `savePath` 的类型决定，即 `savePath` 为字符串时就返回字符串，为字符串数组时就返回字符串数组。

### downloadFileStream()

```ts
interface ManagementMethod {
    downloadFileStream<T extends string | string[]>( url: string, savePath: T, place?: PresetPlace, retry?: number ): Promise<T>;
}
```

- `url` 要下载的文件 url 地址
- `savePath` 下载后的保存地址的相对路径，支持字符串或字符串数组
- `place` 相对路径的基地址，默认 `"root"`
- `retry` 失败重试次数，默认 `3`
- 返回值: 被下载文件的绝对路径，格式决定于 `savePath` 的格式

流式下载指定 `url` 地址的文件，并保存到 `savePath` 所指定位置。当需要保存到多个地址时，`savePath` 可以指定为字符串数组的形式。

返回值的类型由 `savePath` 的类型决定，即 `savePath` 为字符串时就返回字符串，为字符串数组时就返回字符串数组。

> 建议使用此方法下载大型文件

[js-yaml]: https://github.com/eemeli/yaml
[Buffer]: https://nodejs.org/dist/latest-v20.x/docs/api/buffer.html