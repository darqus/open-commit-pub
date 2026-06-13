# Open Commit

AI-powered commit message generator for VS Code.

![screenshot](https://github.com/darqus/assets/blob/main/img/open-commit/ss-open-commit-1.png?raw=true)

![screenshot](https://github.com/darqus/assets/blob/main/img/open-commit/ss-open-commit-2.png?raw=true)

![screenshot](https://github.com/darqus/assets/blob/main/img/open-commit/ss-open-commit-3.png?raw=true)

<video src="https://github.com/darqus/assets/raw/refs/heads/main/video/open-commit.mp4" controls></video>

## Features

- 🤖 **AI-Generated Commit Messages** — automatically generates conventional commit messages from your code changes
- ⚡ **Two Execution Modes:**
  - **Direct API (fast)** — HTTPS request straight to Zen API, bypassing Opencode CLI spawn. ~1-3s faster per generation
  - **Opencode CLI** — fallback via `opencode run` when no API key is configured
- 📝 **Conventional Commits** — follows the Conventional Commits specification (`feat(scope): subject`)
- 🎯 **Live Streaming** — commit message appears in SCM inputBox in real-time as it's being generated
- 🛑 **Cancellable** — stop generation at any time
- 🌍 **Multi-language Support** — English and Russian
- 🆓 **Free tier available** — use free models via Opencode CLI when no API key is set

## Requirements

- **Fast mode:** API key from [opencode.ai](https://opencode.ai) (`open-commit.apiKey` setting)
- **Fallback mode:** [Opencode CLI](https://github.com/anomalyco/opencode) installed in your system PATH
- Git repository initialized in your workspace

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

## Quick Start

**Fastest way — configure an API key:**

1. Install the extension
2. Open VS Code settings (Ctrl+,)
3. Search for `open-commit.apiKey`
4. Paste your API key from [opencode.ai](https://opencode.ai)
5. Open Source Control (Ctrl+Shift+G) and click the generate button

**Without an API key** — the extension will automatically use Opencode CLI (must be installed separately).

## Usage

### Generate Commit Message

1. Make changes to your code
2. Open Source Control panel (Ctrl+Shift+G)
3. Click the Open Commit icon in the SCM title bar
4. Watch the commit message appear in real-time
5. Review, edit if needed, and commit

### Keyboard Shortcuts

- Generate commit message: Click Open Commit icon in Source Control
- Stop generation: Click stop icon during generation

## Commit Message Format

Generated messages follow Conventional Commits:

```
<type>(<scope>): <subject>
```

**Types:**

- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation
- `style` — Code style changes
- `refactor` — Code refactoring
- `perf` — Performance improvements
- `test` — Tests
- `chore` — Maintenance tasks

**Example:**

```
feat(auth): add JWT token validation
```

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `open-commit.apiKey` | `""` | API key for direct HTTPS calls to Zen API. **Recommended** — fastest mode, no Opencode CLI required |
| `open-commit.model` | `""` | Opencode model (auto-detected if empty). Used in fallback CLI mode only |
| `open-commit.variant` | `"minimal"` | Variant: `minimal`, `high`, `max`. Used in fallback CLI mode only |
| `open-commit.timeout` | `60` | Timeout in seconds |
| `open-commit.maxDiffSize` | `500000` | Maximum diff size in characters before truncation |

### Environment Variables

- `OPENCODE_API_KEY` — overrides `open-commit.apiKey`
- `OPENCODE_PATH` — path to Opencode CLI (default: `opencode`)
- `OPENCODE_MODEL` — overrides `open-commit.model`
- `OPENCODE_VARIANT` — overrides `open-commit.variant`

## How It Works

```
Generate button pressed
       │
       ▼
  Read configuration
       │
       ├── apiKey set? ──► Direct HTTPS to Zen API (opencode.ai)
       │                       (fast, no process spawn)
       │
       └── apiKey empty? ──► spawn(`opencode run --format json`)
                               (fallback, requires CLI installed)
       │
       ▼
  Commit message streams into SCM inputBox
       │
       ▼
  User reviews, edits, and commits
```

## Troubleshooting

### "API error 401"
Invalid or missing API key. Check the `open-commit.apiKey` setting.

### "Opencode not found"
Opencode CLI is not installed and no API key is set. Either install Opencode or configure `open-commit.apiKey`:
```bash
npm i -g opencode-ai
```

### "No changes to commit"
Make sure you have uncommitted changes in your Git repository.

### "Git extension not found"
Ensure VS Code's built-in Git extension is enabled.

## Development

### Prerequisites

- Node.js 18+ and npm
- VS Code

### Setup

```bash
git clone https://github.com/anomalyco/open-commit.git
cd open-commit
npm install
```

### Build

```bash
npm run compile     # Compile TypeScript
npm run watch       # Watch mode
npm run package     # Create VSIX package
npm run install:ext # Build and install locally
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Credits

Powered by [Opencode AI](https://github.com/anomalyco/opencode).
