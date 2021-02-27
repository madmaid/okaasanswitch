# okaasanswitch
VoIP status indicator for BeagleBone Black

In order to avoid disturbing, notifies that you are talking on VoIP to your housemate.
currently supports only Discord.

## Required
General:
- NodeJS
- LED connection from P9 30 to GND on BeagleBone Black

For Discord:
- Discord bot account
- Discord Server that the account you want detect (mostly it is you) and your bot joining

## Usage
### configure
```bash
  $EDITOR ~/.config/okaasanswitch/config.json
  # or
  sudoedit /usr/local/etc/okaasanswitch/config.json
```
For Discord: 
```json
  {
    "discord": {
        "username": "NAME_YOU_WANT_DETECT",
        "secret": "DISCORD_BOT_SECRET"
    }
  }
```

### run 
```bash
  cd /path/to/project_root/
  node ./dist/index/index.js
```
## Build (optional)
```bash
  cd /path/to/project_root/
  tsc
```
