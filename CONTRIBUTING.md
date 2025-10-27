# Contributing to QuoriumAgro

Thank you for your interest in contributing to QuoriumAgro! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Respect differing viewpoints

## Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/quoriumagro.git
   cd quoriumagro
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Set up development environment** (see SETUP.md)

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates

### 2. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation as needed

### 3. Test Your Changes

```bash
# Lint
pnpm lint

# Type check
pnpm typecheck

# Run tests
pnpm test

# Test specific app
cd apps/api && pnpm test
```

### 4. Commit Changes

Use conventional commit messages:

```bash
git commit -m "feat: add product search functionality"
git commit -m "fix: resolve cart calculation bug"
git commit -m "docs: update API documentation"
```

Commit types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting)
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Style Guidelines

### TypeScript

- Use TypeScript strict mode
- Define proper types (avoid `any`)
- Use interfaces for object shapes
- Use enums for constants

```typescript
// Good
interface Product {
  id: string;
  name: string;
  price: number;
}

// Avoid
const product: any = { ... };
```

### React/React Native

- Use functional components
- Use hooks for state management
- Keep components small and focused
- Extract reusable logic into custom hooks

```typescript
// Good
export function ProductCard({ product }: { product: Product }) {
  const [isLiked, setIsLiked] = useState(false);
  
  return (
    <div>...</div>
  );
}
```

### NestJS

- Use dependency injection
- Keep controllers thin
- Put business logic in services
- Use DTOs for validation

```typescript
// Good
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  
  @Get()
  findAll() {
    return this.productsService.findAll();
  }
}
```

### Naming Conventions

- **Files**: kebab-case (`product-card.tsx`)
- **Components**: PascalCase (`ProductCard`)
- **Functions**: camelCase (`getUserById`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`)
- **Interfaces**: PascalCase with `I` prefix optional (`Product` or `IProduct`)

## Testing

### Unit Tests

```typescript
describe('ProductService', () => {
  it('should return all products', async () => {
    const products = await service.findAll();
    expect(products).toBeDefined();
  });
});
```

### Integration Tests

```typescript
describe('Products API', () => {
  it('GET /products should return products', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeInstanceOf(Array);
      });
  });
});
```

## Pull Request Guidelines

### PR Title

Use conventional commit format:
```
feat: add product filtering
fix: resolve cart total calculation
docs: update setup instructions
```

### PR Description

Include:
- **What**: What changes were made
- **Why**: Why these changes were needed
- **How**: How the changes were implemented
- **Testing**: How to test the changes
- **Screenshots**: For UI changes

Template:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Steps to test the changes

## Screenshots
(if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
```

### Review Process

1. **Automated Checks**: CI must pass
2. **Code Review**: At least one approval required
3. **Testing**: Reviewer tests changes locally
4. **Merge**: Squash and merge to main

## Project Structure

```
Nurtury/
├── apps/
│   ├── api/              # NestJS API
│   ├── mobile/           # React Native app
│   └── web/              # Next.js web app
├── packages/
│   ├── types/            # Shared types
│   ├── config/           # Shared configs
│   └── tsconfig/         # TS configs
└── docs/                 # Documentation
```

## Adding New Features

### 1. API Endpoint

1. Create module: `nest g module feature-name`
2. Create service: `nest g service feature-name`
3. Create controller: `nest g controller feature-name`
4. Add to `app.module.ts`
5. Write tests
6. Update API documentation

### 2. Frontend Component

1. Create component file
2. Add types/interfaces
3. Implement component
4. Add styles
5. Write tests
6. Update documentation

### 3. Database Changes

1. Update Prisma schema
2. Create migration: `pnpm db:migrate`
3. Update seed data if needed
4. Update types package
5. Update API services

## Documentation

- Update README.md for major changes
- Update API.md for API changes
- Add JSDoc comments for functions
- Update ARCHITECTURE.md for architectural changes

## Questions?

- Open an issue for questions
- Join our Discord (if available)
- Email: dev@quoriumagro.com

## License

By contributing, you agree that your contributions will be licensed under the project's license.

---

Thank you for contributing to QuoriumAgro! 🌱
