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
const vscode = __importStar(require("vscode"));
const generate_1 = require("./commands/generate");
const stop_1 = require("./commands/stop");
const i18n_1 = require("./i18n");
const git_1 = require("./services/git");
const opencode_1 = require("./services/opencode");
const state_1 = require("./services/state");
const statusBar_1 = require("./ui/statusBar");
let gitService;
let opencodeService;
let stateManager;
let statusBarManager;
let generateCommand;
let stopCommand;
let outputChannel;
async function activate(context) {
    (0, i18n_1.initLocale)();
    outputChannel = vscode.window.createOutputChannel('Open Commit');
    outputChannel.appendLine('Open Commit extension activated');
    console.log('Open Commit extension is now active');
    // Initialize services
    gitService = new git_1.GitService();
    opencodeService = new opencode_1.OpencodeService();
    stateManager = new state_1.StateManager();
    statusBarManager = new statusBar_1.StatusBarManager(context);
    // Initialize Git API
    try {
        await gitService.initialize();
    }
    catch (error) {
        console.error('Failed to initialize Git service:', error);
    }
    // Initialize commands
    generateCommand = new generate_1.GenerateCommand(gitService, opencodeService, stateManager, outputChannel, statusBarManager);
    stopCommand = new stop_1.StopCommand(stateManager);
    // Subscribe to state changes
    stateManager.subscribe((state) => {
        statusBarManager.updateStatus(state);
    });
    // Initialize context key
    await vscode.commands.executeCommand('setContext', 'open-commit.isGenerating', false);
    // Register commands
    const generateDisposable = vscode.commands.registerCommand('open-commit.generateCommitMessage', () => generateCommand.execute());
    const stopDisposable = vscode.commands.registerCommand('open-commit.stopGeneration', () => stopCommand.execute());
    context.subscriptions.push(generateDisposable, stopDisposable, outputChannel);
}
function deactivate() {
    statusBarManager?.dispose();
    console.log('Open Commit extension is now deactivated');
}
