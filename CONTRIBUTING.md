# Contributing to Booking Lapangan Futsal

Terima kasih atas minat Anda untuk berkontribusi! Dokumen ini memberikan panduan untuk berkontribusi pada project ini.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.3 or higher
- PostgreSQL database (production) atau gunakan Aiven Cloud untuk development
- Git

### Setup Development Environment

```bash
# 1. Fork repository ini di GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/booking_lapangan.git
cd booking_lapangan

# 3. Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/booking_lapangan.git

# 4. Run setup script
./setup.sh

# 5. Start development servers
./start-dev.sh
```

---

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes

### Creating a Feature Branch

```bash
# Update your local develop branch
git checkout develop
git pull upstream develop

# Create new feature branch
git checkout -b feature/your-feature-name
```

---

## Code Style

### TypeScript

- Use **TypeScript** untuk semua file backend dan frontend
- Follow **Elysia** best practices untuk backend
- Follow **React** best practices untuk frontend
- Use **async/await** instead of callbacks
- Prefer **arrow functions** untuk consistency

### Formatting

```bash
# Backend formatting
cd backend
bun run format  # (jika ada prettier script)

# Frontend formatting
cd frontend
bun run format
```

### Naming Conventions

- **Files**: kebab-case (e.g., `user-profile.tsx`)
- **Components**: PascalCase (e.g., `UserProfile`)
- **Functions/Variables**: camelCase (e.g., `getUserData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_UPLOAD_SIZE`)
- **Database Tables**: snake_case (e.g., `pemesanan`, `jadwal_master`)

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(booking): add date range picker for booking page

Implemented a custom date range picker component that allows
users to select start and end dates for reservations.

Closes #123
```

```bash
fix(auth): resolve JWT token expiration issue

Updated token expiration from 1 day to 7 days to reduce
frequent re-authentication prompts.
```

---

## Pull Request Process

### Before Submitting PR

1. **Update from upstream**
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout your-feature-branch
   git rebase develop
   ```

2. **Run tests**
   ```bash
   # Backend tests
   cd backend
   bun test
   
   # API tests
   cd ..
   ./test-api.sh
   ```

3. **Check TypeScript compilation**
   ```bash
   # Backend
   cd backend
   bun run build
   
   # Frontend
   cd ../frontend
   bun run build
   ```

4. **Test manually** (see [TESTING.md](TESTING.md))

### Creating the PR

1. Push your branch to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a Pull Request on GitHub

3. Fill in the PR template:
   - **Title**: Clear and descriptive
   - **Description**: What changes were made and why
   - **Related Issue**: Reference any related issues
   - **Screenshots**: For UI changes
   - **Checklist**: Ensure all items are checked

### PR Template

```markdown
## Description
Brief description of changes made

## Related Issue
Fixes #(issue number)

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran and provide instructions to reproduce.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published
```

---

## Testing

### Running Tests

```bash
# Automated API tests
./test-api.sh

# Backend unit tests (if implemented)
cd backend
bun test

# Frontend tests (if implemented)
cd frontend
bun test
```

### Manual Testing Checklist

See [TESTING.md](TESTING.md) for comprehensive manual testing checklist covering:
- Authentication (Login, Register, Google OAuth)
- Booking Flow
- User Profile
- Admin Panel (all CRUD operations)
- File Uploads
- Feedback System

### Test Coverage

- Aim for at least **80% code coverage** for new features
- All public APIs must have tests
- Critical paths must have integration tests

---

## Project Structure

```
booking_lapangan/
├── backend/              # Elysia + Bun backend
│   ├── src/
│   │   ├── index.ts         # Entry point
│   │   ├── db.ts            # Database connection
│   │   ├── migrate.ts       # Migrations
│   │   ├── seed.ts          # Seeders
│   │   ├── middleware/      # Auth middleware
│   │   └── routes/          # API routes
│   ├── package.json
│   └── tsconfig.json
├── frontend/             # React + Vite frontend
│   ├── src/
│   │   ├── App.tsx          # Main app component
│   │   ├── api.ts           # Axios client
│   │   ├── context/         # React contexts
│   │   ├── components/      # Reusable components
│   │   └── pages/           # Page components
│   ├── package.json
│   └── tsconfig.json
├── README.md             # Main documentation
├── API.md                # API documentation
├── TESTING.md            # Testing guide
├── DEPLOYMENT.md         # Deployment guide
├── CONTRIBUTING.md       # This file
└── LICENSE               # MIT License
```

---

## Database Migrations

### Creating a Migration

```bash
cd backend

# Create migration file in src/migrations/
# Filename: YYYY-MM-DD-HHMMSS_description.ts
```

### Migration Template

```typescript
import sql from '../db';

export async function up() {
  await sql`
    CREATE TABLE example (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function down() {
  await sql`DROP TABLE IF EXISTS example`;
}
```

### Running Migrations

```bash
cd backend
bun run migrate
```

---

## API Development

### Adding New Endpoint

1. **Create route file** in `backend/src/routes/` (or add to existing)

```typescript
import { Elysia } from 'elysia';
import { jwtPlugin } from '../middleware/auth';

export const myRoute = new Elysia({ prefix: '/api/my-route' })
  .use(jwtPlugin)
  .get('/', async ({ query }) => {
    // Handler logic
    return { data: [] };
  })
  .post('/', async ({ body, user }) => {
    // Protected route (requires auth)
    return { success: true };
  });
```

2. **Register route** in `backend/src/index.ts`

```typescript
import { myRoute } from './routes/my-route';

app.use(myRoute);
```

3. **Document API** in [API.md](API.md)

4. **Add test** in [test-api.sh](test-api.sh)

---

## Frontend Development

### Adding New Page

1. **Create page component** in `frontend/src/pages/`

```typescript
import React from 'react';
import UserTemplate from '../components/layout/UserTemplate';

const MyPage: React.FC = () => {
  return (
    <UserTemplate>
      <div className="container mt-4">
        <h2>My Page</h2>
        {/* Content */}
      </div>
    </UserTemplate>
  );
};

export default MyPage;
```

2. **Add route** in `frontend/src/App.tsx`

```typescript
import MyPage from './pages/MyPage';

// In router config
<Route path="/my-page" element={<MyPage />} />
```

3. **Add navigation link** (if needed)

---

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgres://user:pass@host:port/db?sslmode=require
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
PORT=3000
```

### Frontend

Environment variables untuk frontend diatur di `frontend/src/api.ts` (BASE_URL hardcoded sebagai `http://localhost:3000/api`).

Untuk production, update `BASE_URL` atau gunakan environment variable dari Vite (`import.meta.env.VITE_API_URL`).

---

## Reporting Issues

### Bug Reports

Include:
- **Clear title** and description
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Bun version, browser)
- **Error messages** or logs

### Feature Requests

Include:
- **Clear description** of the feature
- **Use case** - why is this needed?
- **Proposed solution** (optional)
- **Alternatives considered** (optional)

---

## Questions?

If you have questions about contributing:

1. Check existing documentation ([README.md](README.md), [API.md](API.md), [TESTING.md](TESTING.md))
2. Search existing [GitHub Issues](https://github.com/ORIGINAL_OWNER/booking_lapangan/issues)
3. Open a new issue with the `question` label

---

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Booking Lapangan Futsal! 🚀**
