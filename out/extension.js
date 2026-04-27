"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const node_child_process_1 = require("node:child_process");
const node_util_1 = require("node:util");
const vscode = __importStar(require("vscode"));
const i18n_1 = require("./i18n");
const execAsync = (0, node_util_1.promisify)(node_child_process_1.exec);
// Глобальное состояние для отслеживания генерации
let isGenerating = false;
let abortController = null;
let statusBarItem;
function activate(context) {
    (0, i18n_1.initLocale)();
    console.log("Open Commit extension is now active");
    // Инициализация context key для управления видимостью кнопок
    vscode.commands.executeCommand("setContext", "open-commit.isGenerating", false);
    // Создаём status bar item для отображения статуса
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.name = "Open Commit";
    statusBarItem.command = "open-commit.generateCommitMessage";
    context.subscriptions.push(statusBarItem);
    updateStatusBar(false);
    // Команда генерации сообщения коммита
    const generateDisposable = vscode.commands.registerCommand("open-commit.generateCommitMessage", async () => {
        if (isGenerating) {
            vscode.window.showWarningMessage((0, i18n_1.t)("alreadyGenerating"));
            return;
        }
        await generateCommitMessage();
    });
    // Команда остановки генерации
    const stopDisposable = vscode.commands.registerCommand("open-commit.stopGeneration", async () => {
        if (abortController) {
            abortController.abort();
            isGenerating = false;
            vscode.commands.executeCommand("setContext", "open-commit.isGenerating", false);
            updateStatusBar(false);
            vscode.window.showInformationMessage((0, i18n_1.t)("generationStopped"));
        }
    });
    context.subscriptions.push(generateDisposable, stopDisposable);
}
function updateStatusBar(generating) {
    if (statusBarItem) {
        if (generating) {
            statusBarItem.text = (0, i18n_1.t)("statusBarGenerating");
            statusBarItem.tooltip = (0, i18n_1.t)("tooltipStop");
            statusBarItem.command = "open-commit.stopGeneration";
            statusBarItem.backgroundColor = new vscode.ThemeColor("statusBarItem.warningBackground");
            statusBarItem.show();
        }
        else {
            statusBarItem.text = (0, i18n_1.t)("statusBarIdle");
            statusBarItem.tooltip = (0, i18n_1.t)("tooltipGenerate");
            statusBarItem.command = "open-commit.generateCommitMessage";
            statusBarItem.backgroundColor = undefined;
            statusBarItem.hide();
        }
    }
}
async function generateCommitMessage() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage((0, i18n_1.t)("noWorkspace"));
        return;
    }
    const workspacePath = workspaceFolders[0].uri.fsPath;
    try {
        // Проверяем, является ли директория git-репозиторием
        let isGitRepo = true;
        try {
            await execAsync("git rev-parse --git-dir", { cwd: workspacePath });
        }
        catch {
            isGitRepo = false;
        }
        if (!isGitRepo) {
            const action = await vscode.window.showErrorMessage((0, i18n_1.t)("notGitRepo"), { modal: true }, { title: (0, i18n_1.t)("initRepo") }, { title: (0, i18n_1.t)("cancel"), isCloseAffordance: true });
            if (action?.title === (0, i18n_1.t)("initRepo")) {
                try {
                    await execAsync("git init", { cwd: workspacePath });
                    vscode.window.showInformationMessage((0, i18n_1.t)("repoInitialized"));
                    // Рекурсивно вызываем функцию после инициализации
                    return await generateCommitMessage();
                }
                catch (initError) {
                    vscode.window.showErrorMessage((0, i18n_1.t)("gitError", initError instanceof Error ? initError.message : (0, i18n_1.t)("unknownError")));
                }
            }
            return;
        }
        // Получаем список измененных файлов
        const { stdout: gitStatus } = await execAsync("git status --porcelain", {
            cwd: workspacePath,
        });
        if (!gitStatus.trim()) {
            vscode.window.showInformationMessage((0, i18n_1.t)("noChanges"));
            return;
        }
        // Проверяем наличие настроенных git credentials
        const credentialsConfigured = await checkGitCredentials(workspacePath);
        if (!credentialsConfigured) {
            const action = await vscode.window.showErrorMessage((0, i18n_1.t)("gitCredentialsMissing"), { modal: true }, { title: (0, i18n_1.t)("configureGit") }, { title: (0, i18n_1.t)("cancel"), isCloseAffordance: true });
            if (action?.title === (0, i18n_1.t)("configureGit")) {
                await configureGitCredentials(workspacePath);
            }
            return;
        }
        // Проверяем, существует ли HEAD (есть ли коммиты в репозитории)
        let hasHead = true;
        try {
            await execAsync("git rev-parse HEAD", { cwd: workspacePath });
        }
        catch {
            hasHead = false;
        }
        let diffToUse = "";
        if (hasHead) {
            // Репозиторий имеет коммиты, используем стандартный diff
            const { stdout: diff } = await execAsync("git diff HEAD", {
                cwd: workspacePath,
            });
            diffToUse = diff;
            if (!diff.trim()) {
                // Проверяем staged файлы
                const { stdout: stagedDiff } = await execAsync("git diff --cached HEAD", {
                    cwd: workspacePath,
                });
                if (!stagedDiff.trim()) {
                    vscode.window.showInformationMessage((0, i18n_1.t)("noChangesToAnalyze"));
                    return;
                }
                diffToUse = stagedDiff;
            }
        }
        else {
            // Репозиторий пуст (нет коммитов)
            const { stdout: stagedDiff } = await execAsync("git diff --cached", {
                cwd: workspacePath,
            });
            if (stagedDiff.trim()) {
                // Есть staged файлы — используем их
                diffToUse = stagedDiff;
            }
            else {
                // Нет staged файлов — сообщаем пользователю
                const action = await vscode.window.showInformationMessage((0, i18n_1.t)("emptyRepoNoStaged"), { modal: true }, { title: (0, i18n_1.t)("stageFiles") }, { title: (0, i18n_1.t)("cancel"), isCloseAffordance: true });
                if (action?.title === (0, i18n_1.t)("stageFiles")) {
                    vscode.env.clipboard.writeText(`# Добавьте файлы в staging area:\ngit add .\n\n# Затем сгенерируйте сообщение коммита через Open Commit`);
                    vscode.window.showInformationMessage((0, i18n_1.t)("commandsCopied"));
                }
                return;
            }
        }
        const diffToSend = diffToUse.length > 50000
            ? diffToUse.slice(0, 50000)
            : diffToUse;
        await generateMessageWithOpenCode(diffToSend, workspacePath);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : (0, i18n_1.t)("unknownError");
        vscode.window.showErrorMessage((0, i18n_1.t)("gitError", errorMessage));
    }
}
async function generateMessageWithOpenCode(diff, workspacePath) {
    isGenerating = true;
    abortController = new AbortController();
    // Обновляем context key для переключения иконки
    vscode.commands.executeCommand("setContext", "open-commit.isGenerating", true);
    updateStatusBar(true);
    const progressOptions = {
        location: vscode.ProgressLocation.Notification,
        title: (0, i18n_1.t)("progressTitle"),
        cancellable: true,
    };
    try {
        // Проверяем наличие opencode cli
        const OPENCODE_PATH = process.env.OPENCODE_PATH || "/home/eo/.opencode/bin/opencode";
        try {
            const options = {
                cwd: workspacePath,
                shell: true,
            };
            await execAsync(`"${OPENCODE_PATH}" --version`, options);
        }
        catch {
            vscode.window.showErrorMessage((0, i18n_1.t)("openCodeCliNotFound"));
            isGenerating = false;
            abortController = null;
            vscode.commands.executeCommand("setContext", "open-commit.isGenerating", false);
            updateStatusBar(false);
            return;
        }
        await vscode.window.withProgress(progressOptions, async (progress, token) => {
            token.onCancellationRequested(() => {
                if (abortController) {
                    abortController.abort();
                }
            });
            progress.report({ increment: 10 });
            const prompt = `Commit message (Conventional Commits, max 50 chars, no period):

${diff}`;
            progress.report({ increment: 20 });
            // Вызываем opencode run для генерации сообщения коммита
            const OPENCODE_PATH = process.env.OPENCODE_PATH || "/home/eo/.opencode/bin/opencode";
            const OPENCODE_MODEL = process.env.OPENCODE_MODEL;
            const OPENCODE_VARIANT = process.env.OPENCODE_VARIANT || "minimal";
            const args = ["run", "--dangerously-skip-permissions", "--variant", OPENCODE_VARIANT, "--format", "json"];
            if (OPENCODE_MODEL) {
                args.push("--model", OPENCODE_MODEL);
            }
            args.push("--", prompt);
            const commitMessage = await new Promise((resolve, reject) => {
                const child = (0, node_child_process_1.spawn)(OPENCODE_PATH, args, {
                    cwd: workspacePath,
                    stdio: ["pipe", "pipe", "pipe"],
                });
                let stdout = "";
                let stderr = "";
                child.stdout?.on("data", (data) => {
                    stdout += data.toString();
                });
                child.stderr?.on("data", (data) => {
                    stderr += data.toString();
                });
                child.on("close", (code) => {
                    if (code === 0) {
                        let message = "";
                        const lines = stdout.split("\n").filter(Boolean);
                        for (const line of lines) {
                            try {
                                const data = JSON.parse(line);
                                if (data.type === "text" && data.part?.text) {
                                    message = data.part.text.trim();
                                }
                            }
                            catch {
                                // ignore
                            }
                        }
                        resolve(message);
                    }
                    else {
                        reject(new Error(stderr || `Exit code ${code}`));
                    }
                });
                child.on("error", reject);
                child.stdin?.end();
            });
            progress.report({ increment: 50 });
            // Удаляем markdown форматирование и code blocks
            let message = commitMessage;
            const codeBlockMatch = message.match(/```(?:\w+)?\s*([\s\S]*?)```/);
            if (codeBlockMatch) {
                message = codeBlockMatch[1].trim();
            }
            message = message
                .replace(/```/g, "")
                .replace(/\*\*/g, "")
                .replace(/\*/g, "")
                .replace(/`/g, "")
                .replace(/\n{3,}/g, "\n\n")
                .trim();
            if (message) {
                await setGitInputBoxValue(message);
                vscode.window.showInformationMessage((0, i18n_1.t)("commitGenerated"));
                const smartCommit = vscode.workspace
                    .getConfiguration("git")
                    .get("enableSmartCommit", true);
                if (smartCommit) {
                    vscode.window.showWarningMessage((0, i18n_1.t)("disableSmartCommitWarning"));
                }
            }
            else {
                vscode.window.showWarningMessage((0, i18n_1.t)("emptyMessage"));
            }
            progress.report({ increment: 20 });
        });
    }
    catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
            vscode.window.showInformationMessage((0, i18n_1.t)("generationCancelled"));
            return;
        }
        const errorMessage = error instanceof Error ? error.message : (0, i18n_1.t)("unknownError");
        if (errorMessage.includes("E2BIG")) {
            vscode.window.showErrorMessage((0, i18n_1.t)("openCodeCliTooLargeDiff"));
        }
        else {
            vscode.window.showErrorMessage((0, i18n_1.t)("openCodeError", errorMessage));
        }
        console.error("OpenCode error:", error);
    }
    finally {
        isGenerating = false;
        abortController = null;
        vscode.commands.executeCommand("setContext", "open-commit.isGenerating", false);
        updateStatusBar(false);
    }
}
async function setGitInputBoxValue(message) {
    const gitExtension = vscode.extensions.getExtension("vscode.git");
    if (!gitExtension) {
        throw new Error((0, i18n_1.t)("gitExtensionNotFound"));
    }
    const git = gitExtension.isActive ? gitExtension.exports : await gitExtension.activate();
    const api = git.getAPI(1);
    if (api.repositories.length === 0) {
        throw new Error((0, i18n_1.t)("gitRepoNotFound"));
    }
    api.repositories[0].inputBox.value = message;
}
/**
 * Проверка наличия настроенных git credentials (user.name и user.email)
 */
async function checkGitCredentials(workspacePath) {
    try {
        // Проверяем user.name
        const { stdout: userName } = await execAsync("git config user.name", {
            cwd: workspacePath,
        });
        // Проверяем user.email
        const { stdout: userEmail } = await execAsync("git config user.email", {
            cwd: workspacePath,
        });
        return userName.trim().length > 0 && userEmail.trim().length > 0;
    }
    catch {
        return false;
    }
}
/**
 * Настройка git credentials через input boxes
 */
async function configureGitCredentials(workspacePath) {
    // Запрашиваем имя
    const userName = await vscode.window.showInputBox({
        prompt: (0, i18n_1.t)("gitUserNamePrompt"),
        placeHolder: "John Doe",
        ignoreFocusOut: true,
    });
    if (!userName) {
        return;
    }
    // Запрашиваем email
    const userEmail = await vscode.window.showInputBox({
        prompt: (0, i18n_1.t)("gitUserEmailPrompt"),
        placeHolder: "johndoe@example.com",
        ignoreFocusOut: true,
    });
    if (!userEmail) {
        return;
    }
    // Устанавливаем конфиги на локальном уровне (для проекта)
    try {
        await execAsync(`git config user.name "${userName}"`, {
            cwd: workspacePath,
        });
        await execAsync(`git config user.email "${userEmail}"`, {
            cwd: workspacePath,
        });
        vscode.window.showInformationMessage((0, i18n_1.t)("gitConfigured"));
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : (0, i18n_1.t)("unknownError");
        vscode.window.showErrorMessage((0, i18n_1.t)("gitError", errorMessage));
    }
}
function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
    console.log("Open Commit extension is now deactivated");
}
