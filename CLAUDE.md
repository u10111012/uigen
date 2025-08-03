# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. It's a Next.js 15 application that allows users to describe React components in natural language and generates them using Claude AI with real-time preview capabilities.

## Essential Commands

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run dev:daemon` - Start dev server in background, logs to logs.txt
- `npm run setup` - Complete setup (install deps, generate Prisma client, run migrations)

### Testing & Quality
- `npm test` - Run tests with Vitest
- `npm run lint` - Run ESLint
- `npm run build` - Build for production

### Database
- `npx prisma generate` - Generate Prisma client (outputs to src/generated/prisma)
- `npx prisma migrate dev` - Run database migrations
- `npm run db:reset` - Reset database completely

## Architecture Overview

### Core System Components

**Virtual File System**: The heart of the application is a custom VirtualFileSystem class (`src/lib/file-system.ts`) that manages in-memory file operations without writing to disk. It supports creating, reading, updating, deleting, and renaming files/directories.

**AI Integration**: Uses Vercel AI SDK with Anthropic Claude via streaming chat API (`src/app/api/chat/route.ts`). The AI has access to two custom tools:
- `str_replace_editor` - For file content manipulation 
- `file_manager` - For file operations (rename, delete)

**Context Architecture**: Built around two main React contexts:
- `FileSystemContext` (`src/lib/contexts/file-system-context.tsx`) - Manages virtual file system state
- `ChatContext` (`src/lib/contexts/chat-context.tsx`) - Handles AI chat interactions

### Application Flow

1. **Authentication**: JWT-based auth with bcrypt password hashing (`src/lib/auth.ts`)
2. **Project Management**: Authenticated users get persistent projects; anonymous users get session-only projects
3. **Chat Interface**: Users describe components in natural language
4. **AI Processing**: Claude generates/modifies files using custom tools
5. **Live Preview**: Components are compiled and rendered in real-time using Babel standalone

### Key Data Models (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  projects  Project[]
}

model Project {
  id        String   @id @default(cuid())
  name      String
  userId    String?  // Optional for anonymous projects
  messages  String   @default("[]")  // JSON serialized chat history
  data      String   @default("{}")  // JSON serialized file system state
}
```

### File Structure Patterns

- **Actions**: Server actions in `src/actions/` for project CRUD operations
- **Components**: Organized by feature (`chat/`, `editor/`, `preview/`, `auth/`, `ui/`)
- **Testing**: Co-located `__tests__/` directories with Vitest + React Testing Library
- **Tools**: AI tool implementations in `src/lib/tools/`
- **Transforms**: JSX compilation utilities in `src/lib/transform/`

## Development Notes

### Environment Setup
- Requires `ANTHROPIC_API_KEY` in `.env` for full functionality
- Without API key, returns static mock components instead of AI-generated ones
- Uses SQLite database (`prisma/dev.db`) for local development

### Testing Strategy
- Vitest with jsdom environment for component testing
- Tests are co-located with components in `__tests__/` directories
- Run specific test: `npm test -- path/to/test.test.ts`

### Code Generation Flow
The AI system prompt (`src/lib/prompts/generation.tsx`) instructs Claude to:
1. Create React components with TypeScript
2. Use Tailwind CSS for styling
3. Create files in virtual file system using provided tools
4. Structure components with proper imports/exports

### Key Libraries
- **UI**: Radix UI primitives with custom Tailwind styling
- **Code Editor**: Monaco Editor for syntax highlighting
- **Markdown**: react-markdown for chat message rendering
- **State**: React Context (no external state management)
- **Database**: Prisma with SQLite for development

