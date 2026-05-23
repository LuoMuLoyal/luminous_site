# Luminous Website

Luminous 的官网前端项目，当前已迁移到 Nuxt 4。

在线访问：

- https://devluo.com/luminous/

## 项目简介

该项目用于展示 Luminous 智慧用药助手的核心价值、功能全景、使用场景、隐私政策与下载信息。

核心特性：

- Nuxt 4 文件路由与布局能力
- GSAP 与 Lenis 驱动的动效与滚动体验
- Three.js / TresJS 视觉场景能力（在低端设备自动降级）
- Tailwind CSS 4 样式能力与自定义设计令牌

## 技术栈

- Vue 3
- Nuxt 4
- Tailwind CSS 4
- GSAP
- Lenis
- Three.js
- @tresjs/core

## 环境要求

- Node.js >= 18
- npm >= 9

## 本地开发

```bash
npm install
npm run dev
```

默认开发地址：

- http://localhost:3000

## 环境变量

项目提供示例文件 [`.env.example`](.env.example)：

- `NUXT_PUBLIC_API_BASE_URL=http://localhost:3030`：本地联调后端地址
- `NUXT_APP_BASE_URL=/luminous_site/`：前端基础路径（用于路由与静态资源）

迁移期间仍兼容旧变量名：

- `VITE_API_BASE_URL`
- `VITE_PUBLIC_BASE`

如需使用，请复制为 `.env` 后按实际环境修改。

## 构建、静态导出与预览

```bash
npm run build
npm run generate
npm run preview
```

- `npm run build` 输出 Node Server 产物到 `.output/server`
- `npm run generate` 输出静态站点到 `.output/public`

## 部署说明（GitHub Pages / 子路径部署）

当前 Nuxt 基础路径配置在 [`nuxt.config.ts`](nuxt.config.ts) 中：

- 默认基础路径通过 `NUXT_APP_BASE_URL` 或兼容变量 `VITE_PUBLIC_BASE` 控制

推荐配置：

- GitHub Pages（仓库名 luminous_site）：`NUXT_APP_BASE_URL=/luminous_site/`
- 你的服务器地址 https://devluo.com/luminous/：`NUXT_APP_BASE_URL=/luminous/`

## 开源协议

本项目采用 [MIT License](LICENSE)。
