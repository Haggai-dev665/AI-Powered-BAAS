# Contributing to AI-Powered BaaS

Thank you for your interest in contributing to AI-Powered BaaS! We welcome contributions from the community and are pleased to have you join us.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Architecture Guidelines](#architecture-guidelines)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Submitting Changes](#submitting-changes)
- [Community](#community)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@aibaas.dev](mailto:conduct@aibaas.dev).

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **Docker** and **Docker Compose**
- **Git**
- **PostgreSQL** (for local development without Docker)
- **Redis** (for local development without Docker)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/AI-Powered-BAAS.git
   cd AI-Powered-BAAS
   ```

3. Add the original repository as an upstream remote:
   ```bash
   git remote add upstream https://github.com/original-owner/AI-Powered-BAAS.git
   ```

### Local Development Setup

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. **Start development services:**
   ```bash
   # Option 1: Using Docker Compose (Recommended)
   docker-compose up -d

   # Option 2: Manual setup
   npm run dev          # API server
   npm run start:ai     # AI services
   npm run start:web    # Frontend
   ```

5. **Verify the setup:**
   ```bash
   curl http://localhost:3000/health
   ```

## 🔄 Development Workflow

### Branch Naming Convention

Use descriptive branch names with prefixes:

- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test improvements

Examples:
- `feature/sentiment-analysis-api`
- `bugfix/authentication-token-refresh`
- `docs/api-documentation-update`

### Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to build process or auxiliary tools

**Examples:**
```bash
feat(api): add sentiment analysis endpoint
fix(auth): resolve JWT token expiration issue
docs(readme): update installation instructions
test(ai): add unit tests for NLP models
```

### Development Process

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Write code following our coding standards
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes:**
   ```bash
   npm test                    # Run Node.js tests
   python -m pytest           # Run Python tests
   npm run lint               # Check code style
   npm run type-check         # TypeScript type checking
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat(api): add new endpoint for image classification"
   ```

5. **Keep your branch updated:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

6. **Push your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🏗️ Architecture Guidelines

### Microservices Architecture

Our platform follows a microservices architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   AI Services   │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Python)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       ▼
         │              ┌─────────────────┐    ┌─────────────────┐
         │              │   Database      │    │   Model Store   │
         │              │   (PostgreSQL)  │    │   (File System) │
         │              └─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│   CDN/Storage   │
│   (MinIO/S3)    │
└─────────────────┘
```

### Service Communication

- **Synchronous**: REST APIs for direct service-to-service communication
- **Asynchronous**: Kafka for event-driven communication
- **Real-time**: WebSockets for live updates

### Database Design

- **PostgreSQL**: Primary database for structured data
- **MongoDB**: Document storage for unstructured data
- **Redis**: Caching and session management

## 📝 Coding Standards

### TypeScript/JavaScript Standards

- Use **TypeScript** for type safety
- Follow **ESLint** and **Prettier** configurations
- Use **camelCase** for variables and functions
- Use **PascalCase** for classes and interfaces
- Use **UPPER_SNAKE_CASE** for constants

```typescript
// Good
interface UserProfile {
  userId: string;
  email: string;
  preferences: UserPreferences;
}

const API_ENDPOINTS = {
  USERS: '/api/v1/users',
  AUTH: '/api/v1/auth'
} as const;
```

### Python Standards

- Follow **PEP 8** style guidelines
- Use **Black** for code formatting
- Use **type hints** for all function parameters and return types
- Use **snake_case** for variables and functions
- Use **PascalCase** for classes

```python
# Good
from typing import List, Optional
from pydantic import BaseModel

class AIModelResponse(BaseModel):
    prediction: str
    confidence: float
    metadata: Optional[dict] = None

async def process_text_sentiment(
    text: str, 
    model_name: str = "default"
) -> AIModelResponse:
    """Process text for sentiment analysis."""
    # Implementation here
    pass
```

### API Design Guidelines

- Use **RESTful** principles
- Include **API versioning** (`/api/v1/`)
- Use appropriate **HTTP status codes**
- Implement **consistent error responses**
- Include **request/response validation**

```typescript
// Good API endpoint structure
POST /api/v1/ai/sentiment
GET /api/v1/models
PUT /api/v1/models/{id}
DELETE /api/v1/models/{id}
```

### Error Handling

```typescript
// Consistent error response format
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  },
  "timestamp": "2025-05-29T10:30:00Z",
  "path": "/api/v1/auth/login"
}
```

## 🧪 Testing Guidelines

### Test Categories

1. **Unit Tests**: Test individual functions/methods
2. **Integration Tests**: Test service interactions
3. **End-to-End Tests**: Test complete user workflows
4. **Performance Tests**: Test system performance under load

### Testing Standards

- **Minimum 80% code coverage**
- Test both **happy path** and **error scenarios**
- Use **descriptive test names**
- Include **setup and teardown** procedures
- Mock external dependencies

### JavaScript/TypeScript Testing

```typescript
// Example test structure
describe('SentimentAnalysisService', () => {
  describe('analyzeSentiment', () => {
    it('should return positive sentiment for positive text', async () => {
      // Arrange
      const service = new SentimentAnalysisService();
      const input = 'I love this product!';

      // Act
      const result = await service.analyzeSentiment(input);

      // Assert
      expect(result.sentiment).toBe('positive');
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should handle empty text input gracefully', async () => {
      // Test error scenarios
    });
  });
});
```

### Python Testing

```python
import pytest
from unittest.mock import Mock, patch

class TestSentimentAnalyzer:
    def setup_method(self):
        self.analyzer = SentimentAnalyzer()

    def test_analyze_positive_sentiment(self):
        # Arrange
        text = "I love this product!"
        
        # Act
        result = self.analyzer.analyze(text)
        
        # Assert
        assert result.sentiment == "positive"
        assert result.confidence > 0.8

    @patch('model_loader.load_model')
    def test_handles_model_loading_error(self, mock_load):
        # Test with mocked dependencies
        mock_load.side_effect = Exception("Model not found")
        
        with pytest.raises(ModelLoadError):
            self.analyzer.load_model("invalid-model")
```

## 📚 Documentation

### Code Documentation

- Use **JSDoc** for TypeScript/JavaScript
- Use **docstrings** for Python
- Document **public APIs** thoroughly
- Include **examples** in documentation

```typescript
/**
 * Analyzes the sentiment of the provided text
 * @param text - The text to analyze
 * @param options - Configuration options for analysis
 * @returns Promise resolving to sentiment analysis result
 * @example
 * ```typescript
 * const result = await analyzeSentiment("I love this!", { model: "bert" });
 * console.log(result.sentiment); // "positive"
 * ```
 */
async function analyzeSentiment(
  text: string, 
  options?: AnalysisOptions
): Promise<SentimentResult> {
  // Implementation
}
```

### API Documentation

- Use **OpenAPI/Swagger** specifications
- Include **request/response examples**
- Document **authentication requirements**
- Provide **SDKs and code samples**

## 🔄 Submitting Changes

### Pull Request Process

1. **Ensure your branch is up to date:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Create a pull request:**
   - Use a descriptive title
   - Fill out the PR template completely
   - Link related issues
   - Include screenshots for UI changes

3. **PR Template:**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Tests pass
   - [ ] New tests added
   - [ ] Manual testing completed

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   ```

### Review Process

1. **Automated checks** must pass:
   - Tests
   - Code style (ESLint, Black)
   - Type checking
   - Security scanning

2. **Manual review** by maintainers:
   - Code quality
   - Architecture adherence
   - Performance implications
   - Security considerations

3. **Required approvals**: At least 2 maintainer approvals for significant changes

## 🏷️ Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Workflow

1. Create release branch: `release/v1.2.0`
2. Update version numbers and changelog
3. Create pull request to main
4. After merge, create GitHub release with tags
5. Deploy to staging for testing
6. Deploy to production

## 🎯 Project Areas

We welcome contributions in these areas:

### 🤖 AI/ML Development
- New model integrations
- Performance optimizations
- Model fine-tuning capabilities
- Custom training pipelines

### 🔧 Backend Development
- API endpoint development
- Database optimizations
- Authentication/authorization
- Performance improvements

### 🎨 Frontend Development
- React component development
- UI/UX improvements
- Dashboard features
- Mobile responsiveness

### 📱 SDK Development
- JavaScript/TypeScript SDK
- Python SDK
- Go SDK
- Documentation and examples

### 🔒 Security & Infrastructure
- Security audits
- Infrastructure automation
- Monitoring and logging
- Performance optimization

### 📖 Documentation
- API documentation
- Tutorials and guides
- Code examples
- Video content

## 🏆 Recognition

Contributors will be recognized in:

- **README contributors section**
- **Release notes**
- **Hall of Fame** on our website
- **Contributor badge** on Discord
- **Special recognition** for significant contributions

## 💬 Community

### Communication Channels

- **Discord**: [Join our community](https://discord.gg/aibaas)
- **GitHub Discussions**: [Ask questions and share ideas](https://github.com/your-username/AI-Powered-BAAS/discussions)
- **Email**: [contribute@aibaas.dev](mailto:contribute@aibaas.dev)
- **Twitter**: [@AIBaaS](https://twitter.com/aibaas)

### Getting Help

If you need help with contributions:

1. Check existing **documentation** and **issues**
2. Ask in **GitHub Discussions**
3. Join our **Discord community**
4. Attend **community office hours** (Fridays 2 PM UTC)

### Mentorship Program

New contributors can request mentorship:

- **Beginner-friendly issues** labeled with `good first issue`
- **Mentorship requests** via Discord
- **Pair programming sessions** for complex features
- **Code review guidance** for learning

## 📊 Contribution Guidelines by Type

### Bug Reports

When reporting bugs, include:

- **Steps to reproduce**
- **Expected vs actual behavior**
- **Environment details** (OS, Node.js version, etc.)
- **Relevant logs or error messages**
- **Screenshots** if applicable

### Feature Requests

For new features, provide:

- **Clear use case** and motivation
- **Detailed description** of the feature
- **Mockups or examples** if applicable
- **Consideration of alternatives**
- **Impact assessment**

### Security Issues

For security vulnerabilities:

- **Do NOT create public issues**
- Email [security@aibaas.dev](mailto:security@aibaas.dev)
- Include detailed reproduction steps
- Allow time for proper disclosure

---

Thank you for contributing to AI-Powered BaaS! Together, we're building the future of intelligent backend services. 🚀