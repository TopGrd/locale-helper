# locale-helper README

国际化辅助工具

## Features

选中中文添加到 locale 里, 输入 locale 自动提示
![img](./locale.gif)

## Requirements

项目根目录下或者 src 下有 `locale/index.js`

## Extension Settings

需要以下设置

- `localeHelper.zhKey`: locale 里中文对应的 object 键值

```js
export default {
  'zh-cn': {
    util: '工具',
  },
};
```

## 操作

选中中文，右键菜单点击 `locale: convert variable`，输入键值，自动填充到 locale js 文件

输入`locale.`会自动提示 locale 里已有的字段
