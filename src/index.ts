import { Gpio, BinaryValue } from "onoff";
import * as discord from "discord.js";
import * as fs  from "fs";
import * as path from "path";

const ledPin = 112;
const led = new Gpio(ledPin, "out");

const client = new discord.Client();

client.on('ready', () => {
    const tag = client?.user?.tag;
    console.log(`Logged in as ${tag}!`);

})

client.on("presenceUpdate", (_, triggered) => {
    if (triggered.user?.username !== "madmaid") {
        return
    };

    const userStatus = triggered.user?.presence?.status;
    if (userStatus === "online") {
        led.read()
            .then(() => led.write(1))
            .catch((err: any) => console.log(err));
    } else {
        led.read()
            .then(() => led.write(0))
            .catch((err: any) => console.log(err));
    }
})

const userConfigPath = path.join(process.env["HOME"] || process.exit(1), ".config/okaasanswitch/config.json");
const configPath = fs.existsSync(userConfigPath) ? userConfigPath : "/usr/local/etc/okaasanswitch/config.json"
const config = JSON.parse(fs.readFileSync(configPath, "utf8"))
client.login(config.secret)

function onExit() {
    led.writeSync(0);
    led.unexport();
    process.exit();
}

process.on("SIGINT", onExit)
