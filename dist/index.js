"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var onoff_1 = require("onoff");
var discord = __importStar(require("discord.js"));
var fs = __importStar(require("fs"));
var os = __importStar(require("os"));
var path = __importStar(require("path"));
var ledPin = 112;
var led = new onoff_1.Gpio(ledPin, "out");
function onExit() {
    led.writeSync(0);
    led.unexport();
    process.exit();
}
function lightLED(status) {
    led.read()
        .then(function () { return led.write(status ? 1 : 0); })
        .catch(function (err) { return console.log(err); });
}
function registerDiscordCallbacks(client, config) {
    client.on('ready', function () {
        var _a;
        var tag = (_a = client === null || client === void 0 ? void 0 : client.user) === null || _a === void 0 ? void 0 : _a.tag;
        console.log("Logged in as " + tag + "!");
    });
    client.on("presenceUpdate", function (_, triggered) {
        var _a, _b, _c;
        if (((_a = triggered.user) === null || _a === void 0 ? void 0 : _a.username) !== config.username) {
            return;
        }
        ;
        var userStatus = (_c = (_b = triggered.user) === null || _b === void 0 ? void 0 : _b.presence) === null || _c === void 0 ? void 0 : _c.status;
        lightLED(userStatus === "online");
    });
}
(function main() {
    var systemConfigPath = "/usr/local/etc/okaasanswitch/config.json";
    var homePath = os.homedir();
    var configPath = homePath === "/root"
        ? systemConfigPath
        : path.join(homePath, ".config/okaasanswitch/config.json");
    console.log("load config :", configPath);
    var config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    var client = new discord.Client();
    registerDiscordCallbacks(client, config.discord);
    client.login(config.discord.secret);
    process.on("SIGINT", onExit);
})();
