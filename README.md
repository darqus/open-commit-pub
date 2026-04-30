# Open Commit

AI-powered commit message generator for VS Code using Opencode.

![screenshot](https://github.com/darqus/assets/blob/main/img/open-commit/ss-open-commit-1.png?raw=true)

![screenshot](https://github.com/darqus/assets/blob/main/img/open-commit/ss-open-commit-2.png?raw=true)

![screenshot](https://github.com/darqus/assets/blob/main/img/open-commit/ss-open-commit-3.png?raw=true)

<video src="https://github.com/darqus/assets/raw/refs/heads/main/video/open-commit.mp4" controls></video>

## Features

- 🤖 **AI-Generated Commit Messages** - Automatically generates commit messages based on your code changes using Opencode AI
- 📝 **Conventional Commits** - Follows industry-standard Conventional Commits specification
- 🎯 **Smart Integration** - Seamlessly integrates with VS Code's Source Control panel
- 🌍 **Multi-language Support** - Available in English and Russian
- ⚡ **Fast, Free & Efficient** - Uses local Opencode with the free `opencode/minimax-m2.5-free` model and `minimal` variant by default
- 🛑 **Cancellable** - Stop generation at any time

## Requirements

- [Opencode](https://github.com/anomalyco/opencode) must be installed and available in your system PATH
- Git repository initialized in your workspace
- Uses the free `opencode/minimax-m2.5-free` model and `minimal` variant by default for the fastest local commit message generation

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Open Commit"
4. Click Install

### From VSIX

1. Download the latest `.vsix` file from releases
2. Open VS Code
3. Go to Extensions (Ctrl+Shift+X)
4. Click "..." menu → "Install from VSIX..."
5. Select the downloaded file

### Install Opencode

See installation instructions at [Opencode repository](https://github.com/anomalyco/opencode).

## Development

### Prerequisites

- Node.js 18+ and npm/yarn
- VS Code

### Setup

```bash
# Clone the repository
git clone https://github.com/anomalyco/open-commit.git
cd open-commit

# Install dependencies
npm install
# or
yarn install
```

### Build

```bash
# Compile TypeScript
npm run compile
# or
yarn compile

# Watch mode for development
npm run watch
# or
yarn watch
```

### Package

```bash
# Create VSIX package
npm run package
# or
yarn package
```

### Install Locally

```bash
# Build and install in one command
npm run build-and-install
# or
yarn build-and-install

# Or manually install the VSIX (version will be substituted automatically)
code --install-extension open-commit-$(node -p "require('./package.json').version").vsix
```

### Update Dependencies

```bash
# Update all dependencies
npm update
# or
yarn upgrade

# Check for outdated packages
npm outdated
# or
yarn outdated
```

## Usage

### Generate Commit Message

1. Make changes to your code
2. Open Source Control panel (Ctrl+Shift+G)
3. Click the Opencode icon in the Changes section
4. Wait for AI to generate the commit message
5. Review and commit

### Keyboard Shortcuts

- Generate commit message: Click Opencode icon in Source Control
- Stop generation: Click stop icon during generation

## Commit Message Format

Generated messages follow Conventional Commits:

```
<type>(<scope>): <subject>

<body>
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style changes
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Tests
- `chore` - Maintenance tasks
- `ci` - CI/CD changes
- `build` - Build system changes

**Example:**

```
feat(auth): add JWT token validation

Implement JWT token validation middleware to secure API endpoints.
Includes token expiration check and signature verification.
```

## Configuration

Currently, the extension works out of the box with Opencode. Future versions will include customizable settings.

## Troubleshooting

### "Opencode not found"

Make sure Opencode is installed and available in your PATH:

```bash
opencode --version
```

### "No changes to commit"

Make sure you have uncommitted changes in your Git repository.

### "Git extension not found"

Ensure VS Code's built-in Git extension is enabled.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Credits

Powered by [Opencode AI](https://github.com/anomalyco/opencode).
