import { Gpio, BinaryValue } from "onoff";
import * as discord from "discord.js";
import * as fs  from "fs";
import * as os from "os";
import * as path from "path";

const ledPin = 112;
const led = new Gpio(ledPin, "out");


type DiscordConfig = {
    username: string,
    secret: string
}

type Config = {
    discord: DiscordConfig
}

function onExit() {
    led.writeSync(0);
    led.unexport();
    process.exit();
}

function lightLED(status: boolean) {
    led.read()
        .then(() => led.write(status? 1 : 0))
        .catch((err: any) => console.log(err));
}


function registerDiscordCallbacks(client: discord.Client, config: DiscordConfig){
    client.on('ready', () => {
        const tag = client?.user?.tag;
        console.log(`Logged in as ${tag}!`);

    })

    client.on("presenceUpdate", (_, triggered) => {
        if (triggered.user?.username !== config.username) {
            return
        };

        const userStatus = triggered.member?.presence?.status;


        lightLED(userStatus === "online");
    })
}

(function main(){
    const systemConfigPath = "/usr/local/etc/okaasanswitch/config.json"
    const homePath = os.homedir();
    const configPath = homePath === "/root"
        ? systemConfigPath
        : path.join(homePath, ".config/okaasanswitch/config.json");

    console.log("load config :", configPath)

    const config = JSON.parse(fs.readFileSync(configPath, "utf8")) as unknown as Config;

    const client = new discord.Client({ intents: ['GUILDS', "GUILD_MEMBERS", "GUILD_PRESENCES"] });
    registerDiscordCallbacks(client, config.discord);

    client.login(config.discord.secret);

    process.on("SIGINT", onExit)
})()
