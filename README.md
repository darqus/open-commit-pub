# Open Commit

AI-powered commit message generator for VS Code using Opencode.

![screenshot](https://github.com/darqus/open-commit-pub/blob/main/static/ss_open_commit.png?raw=true)

<video src="https://github.com/darqus/assets/raw/refs/heads/main/video/open-commit.mp4" controls></video>

## Features

- 🤖 **AI-Generated Commit Messages** - Automatically generates commit messages based on your code changes using Opencode AI
- 📝 **Conventional Commits** - Follows industry-standard Conventional Commits specification
- 🎯 **Smart Integration** - Seamlessly integrates with VS Code's Source Control panel
- 🌍 **Multi-language Support** - Available in English and Russian
- ⚡ **Fast & Efficient** - Uses local Opencode for quick generation
- 🛑 **Cancellable** - Stop generation at any time

## Requirements

- [Opencode](https://github.com/anomalyco/opencode) must be installed and available in your system PATH
- Git repository initialized in your workspace

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Open Commit"
4. Click Install

### From VSIX

1. Download the latest `.vsix` file from [releases](https://github.com/darqus/open-commit-pub/releases)
2. Open VS Code
3. Go to Extensions (Ctrl+Shift+X)
4. Click "..." menu → "Install from VSIX..."
5. Select the downloaded file

### Install Opencode

See installation instructions at [Opencode repository](https://github.com/anomalyco/opencode).

Verify installation:

```bash
opencode --version
```

## Development

### Prerequisites

- Node.js 18+ and npm/yarn
- VS Code
- Opencode CLI installed

### Setup

```bash
# Clone the repository
git clone https://github.com/darqus/open-commit-pub.git
cd open-commit-pub

# Install dependencies
npm install
# or
yarn install
```

### Available Commands

```bash
# Build and package VSIX
npm run build
npm run package

# Install locally for testing
npm run build-and-install

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

### Install Locally

```bash
# Build and install in one command
npm run build-and-install

# Or manually install the VSIX
code --install-extension open-commit-0.0.1.vsix
```

### Testing the Extension

1. Run `npm run build-and-install`
2. Restart VS Code
3. Open a Git repository with changes
4. Use the extension via Source Control panel

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

### Command Palette

You can also use the Command Palette:

1. Press Ctrl+Shift+P
2. Type "Open Commit: Generate Commit Message"
3. Press Enter

## Configuration

### Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `open-commit.maxDiffSize` | number | 500000 | Maximum number of characters for inline diff. Larger diffs are passed via temp file. |

### Language

The extension automatically detects your VS Code language. Supported:
- English
- Russian

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
