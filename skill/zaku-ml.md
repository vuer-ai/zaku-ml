# Zaku-ML: Interactive Execution Timeline Visualization

> Interactive execution timeline visualization for displaying hierarchical task execution logs with precise timing information.

## Overview

Zaku-ML is a sophisticated React/Next.js component for visualizing execution timelines. It displays hierarchical log data with interactive timeline bars, collapsible sections, pan/zoom controls, and a magnetic cursor system for precise time inspection.

## Core Features

- **Hierarchical Log Structure**: Parent-child relationships with multiple indentation levels
- **Collapsible Sections**: Expand/collapse tasks and attempts
- **Interactive Timeline Bars**: Color-coded execution bars showing task duration
- **Launch Wait Lines**: Visualizes gap between job creation and execution start
- **Magnetic Cursor System**: Hover-based time cursor with snapping to key events
- **Pan and Zoom**: Mouse wheel scrolling and Ctrl+wheel for zooming
- **Time Ruler**: Dynamic time scale with intelligent marker placement
- **Off-screen Indicators**: Wedge indicators when bars extend beyond viewport
- **Dark Mode Support**: Full theming via next-themes

## Data Structure

```typescript
type LogItemData = {
  id: string                    // Unique identifier
  parentId: string | null       // Parent item for hierarchy
  indent: number                // Visual indentation level (0, 1, 2, ...)
  type: "task" | "attempt" | "info" | "step"
  label: string                 // Display text
  icon?: "history" | "file-code" | "bot" | "check-circle" | "pause-circle"
  createTime?: number           // When item was created (seconds)
  startTime?: number            // When execution started (seconds)
  duration?: number             // How long it took (seconds)
  time?: number                 // Point-in-time event (seconds)
  color?: "blue" | "green" | "orange" | "gray-light" | "gray-medium" | "purple"
  isCollapsible?: boolean       // Can be expanded/collapsed
  hasStripes?: boolean          // Visual striped pattern for parent bars
}
```

## Key Functions

### formatDuration(seconds: number): string
Converts seconds to human-readable format. Handles:
- Milliseconds: `"342ms"`
- Seconds: `"3.141s"`
- Minutes: `"2m 34.00s"`
- Hours: `"1h 23m 45s"`
- Days: `"2d 05h 30m"`
- Months: `"3mo 015d 12h"`
- Years: `"1y 02mo 015d"`

```typescript
formatDuration(0.342)     // "342ms"
formatDuration(3.141)     // "3.141s"
formatDuration(154)       // "2m 34.00s"
formatDuration(5025)      // "1h 23m 45s"
formatDuration(192600)    // "2d 05h 30m"
```

### timeToPercent(time: number): number
Converts absolute time to viewport percentage for positioning.
```typescript
const percent = ((time - viewStart) / viewDuration) * 100
```

## Usage Example

```tsx
import { ExecutionTimeline } from "@/components/execution-timeline"

export default function Page() {
  return <ExecutionTimeline />
}
```

To customize the data, modify the `logData` array in the component:

```typescript
const logData: LogItemData[] = [
  {
    id: "0",
    parentId: null,
    indent: 0,
    type: "info",
    label: "Job registered in queue",
    icon: "history",
    time: 0,
    color: "purple",
  },
  {
    id: "1",
    parentId: null,
    indent: 0,
    type: "task",
    label: "my-task",
    icon: "file-code",
    createTime: 0,
    startTime: 0.5,
    duration: 10,
    color: "blue",
    isCollapsible: true,
    hasStripes: true,
  },
  // ... nested attempts and steps
]
```

## Color Scheme

| Color | Use Case | CSS Class |
|-------|----------|-----------|
| `blue` | Primary tasks, main execution | `bg-blue-500` |
| `green` | Completed steps, success | `bg-green-500` |
| `orange` | Halted/waiting states | `bg-orange-500` |
| `purple` | Info events, queue registration | `bg-purple-500` |
| `gray-light` | Muted background elements | `bg-muted` |
| `gray-medium` | Secondary waiting states | `bg-slate-400` |

## Interaction Controls

| Action | Control |
|--------|---------|
| Pan left/right | Scroll wheel or arrow buttons |
| Zoom in/out | Ctrl+scroll or Alt+scroll |
| Expand/collapse | Click chevron on collapsible items |
| Inspect time | Hover over timeline |

## Component Architecture

```
ExecutionTimeline/
├── Sidebar (30% width)
│   ├── Search input
│   └── Hierarchical log list
│       ├── Guide lines (visual hierarchy)
│       ├── Expand/collapse buttons
│       └── Item labels with icons
└── Timeline (70% width)
    ├── Time Ruler
    │   ├── Tick marks
    │   ├── Time labels
    │   └── Snap indicator dots
    ├── Timeline Bars
    │   ├── Launch wait lines
    │   ├── Execution bars
    │   ├── Start circles
    │   └── Duration labels
    ├── Off-screen wedge indicators
    ├── Cursor overlay
    │   ├── Vertical line
    │   ├── Time readout
    │   └── Magnet icon (when snapped)
    └── Pan controls
```

## State Management

```typescript
// Expanded items (collapsible sections)
const [expandedItems, setExpandedItems] = useState<Set<string>>()

// Currently hovered item
const [hoveredId, setHoveredId] = useState<string | null>(null)

// Viewport positioning
const [viewStart, setViewStart] = useState(number)   // Left edge in seconds
const [viewDuration, setViewDuration] = useState(number) // Visible range in seconds
```

## Key Computed Values (useMemo)

- **childrenMap**: Maps parent IDs to arrays of child items
- **logDataWithMeta**: Enriches data with `isLast` flag and ancestor chain
- **visibleLogData**: Filters items based on expanded state
- **timeMarkers**: Generates time labels for ruler at appropriate intervals
- **keyEventTimes**: Collects all significant time events for cursor snapping

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Theming**: next-themes
- **UI Components**: Radix UI primitives

## Project Structure

```
zaku-ml/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── execution-timeline.tsx   # Main component (900+ lines)
│   ├── theme-provider.tsx
│   └── ui/                      # Shadcn UI components
├── hooks/
│   ├── use-toast.ts
│   └── use-mobile.tsx
├── lib/
│   └── utils.ts                 # cn() utility
└── skill/
    └── zaku-ml.md              # This file
```
