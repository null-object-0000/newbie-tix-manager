# Newbie Tix Manager

基于 Vue 3.0 框架 & Arco Design 开发的演出票务平台的管理端，提供演出管理、订单管理、会员管理等功能。

## 功能特点

- 🎫 演出管理：创建和管理演出信息，包括场次、座位、票价等
- 📦 订单管理：查看和处理用户订单，支持订单状态更新
- 👥 会员管理：管理用户信息，查看用户购票历史
- 📊 数据统计：票务销售数据可视化分析

## 技术栈

- 🚀 Vue 3.0 - 渐进式 JavaScript 框架
- 🔧 TypeScript - 类型安全的 JavaScript 超集
- 🎨 Arco Design - 字节跳动出品的企业级设计系统
- 📦 Vite - 下一代前端构建工具
- 🗃️ Pinia - Vue 的状态管理库
- 🛣️ Vue Router - Vue.js 的官方路由

## 开发环境

### 系统要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 本地开发

1. 克隆项目
```bash
git clone https://github.com/your-username/newbie-tix-manager.git
cd newbie-tix-manager
```

2. 安装依赖
```bash
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
```

4. 构建生产版本
```bash
pnpm build
```

## 项目结构

```
├── src/                    # 源代码目录
│   ├── assets/            # 静态资源
│   ├── components/        # 公共组件
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia 状态管理
│   ├── views/            # 页面视图
│   ├── App.vue           # 根组件
│   └── main.ts           # 入口文件
├── public/               # 公共资源
├── index.html            # HTML 模板
├── vite.config.ts        # Vite 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 项目配置
```

## 部署

1. 构建生产版本
```bash
pnpm build
```

2. 将 `dist` 目录下的文件部署到 Web 服务器

## 贡献

欢迎提交 Issue 或 Pull Request 来帮助改进项目。

## 许可证

[MIT License](LICENSE)