# Agent Guidelines for T3 Stack Project

## Build/Test/Lint Commands

- **Dev**: `pnpm dev` (with Turbo)
- **Build**: `pnpm build`
- **Lint**: `pnpm lint` (fix with `pnpm lint:fix`)
- **TypeCheck**: `pnpm typecheck`
- **Format**: `pnpm format:check` (fix with `pnpm format:write`)
- **Full Check**: `pnpm check` (combines lint + typecheck)

## Code Style Guidelines

- Use **type imports** with inline syntax: `import { type ComponentProps } from "react"`
- Prefix unused variables with underscore: `_unusedParam`
- Use **@/ path alias** for imports from src/
- Follow **camelCase** for variables/functions, **PascalCase** for components
- Use **Zod schemas** for validation in tRPC routers
- Export default for React components, named exports for utilities
- Use **async/await** over Promise chains
- Handle errors with try/catch or error boundaries
- No semicolons enforced, Prettier handles formatting
- Use **TypeScript strict mode** - no any types
- Prefer **const assertions** and **satisfies** operator for type safety
