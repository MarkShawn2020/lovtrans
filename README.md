<p align="center">
  <img src="docs/images/cover.png" alt="LovTrans Cover" width="100%">
</p>

<h1 align="center">
  <img src="assets/logo.svg" width="32" height="32" alt="Logo" align="top">
  LovTrans
</h1>

<p align="center">
  <strong>AI 驱动的旅游翻译工具</strong><br>
  <sub>专为中国出境游用户设计 | 口语化翻译 | 3语言快切</sub>
</p>

<p align="center">
  <a href="#features">功能</a> •
  <a href="#quick-start">快速开始</a> •
  <a href="#tech-stack">技术栈</a> •
  <a href="#development">开发</a> •
  <a href="#license">许可证</a>
</p>

---

## Why LovTrans?

出境游时，Google/DeepL 翻译太书面，对方听不懂？LovTrans 用 LLM 生成**口语化翻译**，让沟通更自然。

```
你: "这个多少钱？"
      ↓ LLM 口语化翻译
泰语: "อันนี้เท่าไหร่ครับ?"
      ↓ 大字展示给对方看
```

## Features

- **LLM 口语化翻译** - 比 Google/DeepL 更自然的对话式翻译
- **3语言快切** - 母语 + 目的地语言 + 英语，一键切换
- **语音输入** - 说话即翻译，免打字
- **语音播放** - 翻译结果语音播放，给对方听
- **旅游场景优化** - 大字体展示，方便给对方看
- **智能语言识别** - 自动检测输入是中文还是外语
- **PWA 支持** - 添加到主屏幕，像 App 一样使用

## Quick Start

```bash
# 克隆仓库
git clone https://github.com/cs-magic/lovtrans.git
cd lovtrans
pnpm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的凭证

# 启动开发服务器
pnpm dev
```

访问 [http://localhost:6990](http://localhost:6990)

### 环境变量

必需:
```
DATABASE_URL=your_supabase_connection_string
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

可选: `ARCJET_KEY`, `SENTRY_DSN`, `BETTER_STACK_SOURCE_TOKEN`

## Tech Stack

| 分类 | 技术 |
|------|------|
| 框架 | Next.js 16, React 19, TypeScript |
| 样式 | Tailwind CSS v4, shadcn/ui |
| 数据库 | Supabase (PostgreSQL), DrizzleORM |
| 认证 | Supabase Auth (SSR) |
| LLM | ZenMux (多模型切换) |
| ASR/TTS | 火山引擎语音服务 |
| 国际化 | next-intl (中/英) |
| 监控 | Sentry, PostHog |

## Development

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 生产构建
pnpm test         # 单元测试
pnpm test:e2e     # E2E 测试
pnpm storybook    # 组件开发
pnpm db:studio    # 数据库管理
pnpm db:generate  # 生成迁移
```

### 修改数据库 Schema

1. 编辑 `src/models/Schema.ts`
2. 运行 `pnpm db:generate`
3. 迁移自动应用

## Roadmap

- [x] 文字翻译
- [x] 语音输入 (ASR)
- [x] 语音播放 (TTS)
- [x] 3语言设置
- [ ] 图片翻译 (菜单OCR)
- [ ] 实时对话模式
- [ ] 离线翻译

## License

MIT License - 详见 [LICENSE](LICENSE)
