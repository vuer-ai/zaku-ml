# Zaku-ML

Interactive execution timeline visualization for displaying hierarchical task execution logs with precise timing information.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/geyangs-projects/v0-simple-user-management)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/x3w5ZUVXGxi)

## Overview

Zaku-ML is a sophisticated React/Next.js component for visualizing execution timelines. It displays hierarchical log data with interactive timeline bars, collapsible sections, pan/zoom controls, and a magnetic cursor system for precise time inspection.

## Features

- **Hierarchical Log Structure** - Displays logs with parent-child relationships
- **Collapsible Sections** - Expand/collapse tasks and attempts
- **Interactive Timeline Bars** - Color-coded execution bars showing task duration
- **Launch Wait Lines** - Visualizes gap between job creation and execution start
- **Magnetic Cursor System** - Hover-based time cursor with snapping to key events
- **Pan and Zoom** - Mouse wheel scrolling and Ctrl+wheel for zooming
- **Time Ruler** - Dynamic time scale with intelligent marker placement
- **Dark Mode Support** - Full theming via next-themes

## Claude Code Skill

Add Zaku-ML knowledge to Claude Code for intelligent assistance with this library.

**Option 1: Claude Code Command (Recommended)**

```bash
# add https://raw.githubusercontent.com/vuer-ai/zaku/main/skill/zaku.md as a skill
```

**Option 2: CLAUDE.md Import**

Add to your project's CLAUDE.md:

```markdown
@import https://raw.githubusercontent.com/vuer-ai/zaku/main/skill/zaku.md
```

## Getting Started

```bash
pnpm install
pnpm dev
```

## Deployment

Your project is live at:

**[https://vercel.com/geyangs-projects/v0-simple-user-management](https://vercel.com/geyangs-projects/v0-simple-user-management)**

## Development

Continue building your app on:

**[https://v0.dev/chat/projects/x3w5ZUVXGxi](https://v0.dev/chat/projects/x3w5ZUVXGxi)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
