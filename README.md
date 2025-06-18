# FFandown Frontend

[English](./README.md) | [中文](./README_ZH.md)

---

### 📖 Introduction

FFandown Frontend is a modern, responsive web interface for the FFandown anime downloader. Built with Vue 3 and Naive UI, it provides an intuitive user experience for managing anime downloads with real-time progress tracking and comprehensive download management features.

### ✨ Features

- 🎯 **Intuitive Interface** - Clean, modern design with responsive layout
- 📊 **Real-time Progress** - Live download progress tracking with SSE
- 🎮 **Comprehensive Management** - Full control over download tasks
- 🔌 **Plugin System** - Extensible plugin architecture
- 🌙 **Dark Mode** - Automatic dark/light theme switching
- 📱 **Mobile Friendly** - Optimized for mobile and tablet devices
- 🌐 **Multi-language** - Support for multiple languages
- ⚙️ **Flexible Configuration** - Customizable download settings
- 📬 **Webhook Support** - Integration with notification services

### 🛠️ Tech Stack

- **Framework**: Vue 3 with Composition API
- **UI Library**: Naive UI
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **Icons**: Icon Park
- **Styling**: SCSS with modern CSS features
- **Real-time**: SSE for live updates

### 📦 Installation

#### Prerequisites

- Node.js 16+ 
- npm or yarn or pnpm

#### Quick Start

```bash
# Clone the repository
git clone https://github.com/helson-lin/ffandown-front.git
cd ffandown-front

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev

# Build for production
npm run build
# or
yarn build
# or
pnpm build
```

### 🏗️ Project Structure

```
ffandown-front/
├── public/                 # Static assets
├── src/
│   ├── api/               # API calls and WebSocket
│   │   ├── index.js       # REST API definitions
│   │   └── ws.js          # WebSocket connection class
│   ├── components/        # Reusable Vue components
│   │   ├── Header.vue     # Application header
│   │   ├── MissionCard.vue # Download task card
│   │   ├── NewMission.vue # New download form
│   │   ├── PluginList.vue # Plugin management
│   │   └── ...
│   ├── views/             # Page components
│   │   ├── Home.vue       # Main dashboard
│   │   ├── Login.vue      # Authentication
│   │   └── pages/         # Sub-pages
│   ├── router/            # Vue Router configuration
│   ├── store/             # Pinia state management
│   ├── utils/             # Utility functions
│   ├── style/             # Global styles and SCSS
│   ├── lang/              # Internationalization
│   └── assets/            # Images and static resources
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies and scripts
```

### 🚀 Usage

1. **Start the Backend**: Ensure the FFandown backend service is running on port 8081
2. **Access the Interface**: Open `http://localhost:3000` in your browser
3. **Login**: Use your credentials to access the dashboard
4. **Add Downloads**: Click "Add Mission" to create new download tasks
5. **Monitor Progress**: Watch real-time progress updates on the dashboard
6. **Manage Plugins**: Configure and enable/disable plugins as needed

### ⚙️ Configuration

The application can be configured through:

- **Environment Variables**: Set API endpoints and other configurations
- **Settings Panel**: In-app configuration for download preferences
- **Plugin Management**: Enable/disable and configure plugins

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### 📄 License

This project is licensed under the MIT License.
