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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const onoff_1 = require("onoff");
const discord = __importStar(require("discord.js"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const ledPin = 112;
const led = new onoff_1.Gpio(ledPin, "out");
function onExit() {
    led.writeSync(0);
    led.unexport();
    process.exit();
}
function lightLED(status) {
    led.read()
        .then(() => led.write(status ? 1 : 0))
        .catch((err) => console.log(err));
}
function registerDiscordCallbacks(client, config) {
    client.on('ready', () => {
        var _a;
        const tag = (_a = client === null || client === void 0 ? void 0 : client.user) === null || _a === void 0 ? void 0 : _a.tag;
        console.log(`Logged in as ${tag}!`);
    });
    client.on("presenceUpdate", (_, triggered) => {
        var _a, _b, _c;
        if (((_a = triggered.user) === null || _a === void 0 ? void 0 : _a.username) !== config.username) {
            return;
        }
        ;
        const userStatus = (_c = (_b = triggered.member) === null || _b === void 0 ? void 0 : _b.presence) === null || _c === void 0 ? void 0 : _c.status;
        lightLED(userStatus === "online");
    });
}
(function main() {
    const systemConfigPath = "/usr/local/etc/okaasanswitch/config.json";
    const homePath = os.homedir();
    const configPath = homePath === "/root"
        ? systemConfigPath
        : path.join(homePath, ".config/okaasanswitch/config.json");
    console.log("load config :", configPath);
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const client = new discord.Client({ intents: ['GUILDS', "GUILD_MEMBERS", "GUILD_PRESENCES"] });
    registerDiscordCallbacks(client, config.discord);
    client.login(config.discord.secret);
    process.on("SIGINT", onExit);
})();
