# FFandown Frontend

[English](./README.md) | [中文](./README_ZH.md)

---

### 📖 项目介绍

FFandown Frontend 是 FFandown 动漫下载器的现代化、响应式 Web 界面。基于 Vue 3 和 Naive UI 构建，为管理动漫下载提供直观的用户体验，具备实时进度跟踪和全面的下载管理功能。

### ✨ 功能特性

- 🎯 **直观界面** - 简洁现代的设计，响应式布局
- 📊 **实时进度** - 基于 WebSocket 的实时下载进度跟踪
- 🎮 **全面管理** - 完整的下载任务控制功能
- 🔌 **插件系统** - 可扩展的插件架构
- 🌙 **深色模式** - 自动深色/浅色主题切换
- 📱 **移动友好** - 针对手机和平板设备优化
- 🌐 **多语言** - 支持多种语言
- ⚙️ **灵活配置** - 可自定义的下载设置
- 📬 **Webhook 支持** - 集成通知服务

### 🛠️ 技术栈

- **框架**: Vue 3 组合式 API
- **UI 库**: Naive UI
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **图标**: Icon Park
- **样式**: SCSS 配合现代 CSS 特性
- **实时通信**: SSE 实时更新

### 📦 安装说明

#### 环境要求

- Node.js 16+ 
- npm 或 yarn 或 pnpm

#### 快速开始

```bash
# 克隆仓库
git clone https://github.com/helson-lin/ffandown-front.git
cd ffandown-front

# 安装依赖
npm install
# 或
yarn install
# 或
pnpm install

# 启动开发服务器
npm run dev
# 或
yarn dev
# 或
pnpm dev

# 生产环境构建
npm run build
# 或
yarn build
# 或
pnpm build
```

### 🏗️ 项目结构

```
ffandown-front/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 调用和 WebSocket
│   │   ├── index.js       # REST API 定义
│   │   └── ws.js          # WebSocket 连接类
│   ├── components/        # 可复用 Vue 组件
│   │   ├── Header.vue     # 应用头部
│   │   ├── MissionCard.vue # 下载任务卡片
│   │   ├── NewMission.vue # 新建下载表单
│   │   ├── PluginList.vue # 插件管理
│   │   └── ...
│   ├── views/             # 页面组件
│   │   ├── Home.vue       # 主仪表板
│   │   ├── Login.vue      # 用户认证
│   │   └── pages/         # 子页面
│   ├── router/            # Vue Router 配置
│   ├── store/             # Pinia 状态管理
│   ├── utils/             # 工具函数
│   ├── style/             # 全局样式和 SCSS
│   ├── lang/              # 国际化
│   └── assets/            # 图片和静态资源
├── vite.config.js         # Vite 配置
└── package.json           # 依赖和脚本
```

### 🚀 使用方法

1. **启动后端**: 确保 FFandown 后端服务在 8081 端口运行
2. **访问界面**: 在浏览器中打开 `http://localhost:3000`
3. **登录**: 使用您的凭据访问仪表板
4. **添加下载**: 点击"添加任务"创建新的下载任务
5. **监控进度**: 在仪表板上查看实时进度更新
6. **管理插件**: 根据需要配置和启用/禁用插件

### ⚙️ 配置说明

应用程序可通过以下方式配置：

- **环境变量**: 设置 API 端点和其他配置
- **设置面板**: 应用内下载偏好配置
- **插件管理**: 启用/禁用和配置插件

### 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

### 📄 许可证

本项目采用 MIT 许可证。

