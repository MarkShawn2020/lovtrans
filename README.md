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

## Features

- **LLM 口语化翻译** - 比 Google/DeepL 更自然的对话式翻译
- **3语言快切** - 母语 + 目的地语言 + 英语一键切换
- **语音输入/播放** - 火山引擎 ASR/TTS 集成
- **旅游场景优化** - 大字体展示，方便给对方看
- **智能语言识别** - 自动检测输入语言
- **PWA 支持** - 像原生 App 一样使用

## Quick Start

```bash
# Clone and install
git clone https://github.com/your-repo/lovtrans.git
cd lovtrans
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
pnpm dev
```

Open [http://localhost:6990](http://localhost:6990)

### Environment Variables

Required:
```
DATABASE_URL=your_supabase_connection_string
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Optional: `ARCJET_KEY`, `SENTRY_DSN`, `BETTER_STACK_SOURCE_TOKEN`

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| Database | Supabase (PostgreSQL), DrizzleORM |
| Auth | Supabase Auth (SSR) |
| LLM | ZenMux (多模型切换) |
| ASR/TTS | 火山引擎语音服务 |
| i18n | next-intl (中/英) |
| Monitoring | Sentry, PostHog |

## Development

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm test         # Unit tests
pnpm test:e2e     # E2E tests
pnpm storybook    # Component dev
pnpm db:studio    # Database explorer
pnpm db:generate  # Generate migrations
```

### Database Schema Changes

1. Edit `src/models/Schema.ts`
2. Run `pnpm db:generate`
3. Migrations apply automatically

## License

MIT
