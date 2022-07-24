# COALITION EVENTS, based on FPARMA-WEB
A modernization effort of the FPARMA website for use with coalition events as an extension of the website

## Foreword
I'm a .NET enterprise dev trudging my way through node/js. Many of these changes may contain incorrect js uses/environs, but otherwise function for the time being. Any updates from more experienced js devs are appreciated.

## Instructions
NOTE: Does not currently support the latest node version
1. Clone repo
2. Install node 11.0.0 ([nvm](https://nvm.sh) recommended)
3. Install mongodb and start a thread
4. Run npm install
5. Copy config.example.json and change settings
5. Start server by entering "gulp dev"

## Setting ENV
You can change enviroment variables if you do not want to use config.json

* PORT
* SESSION:SECRET
* DB:URI
* DB:USER
* DB:PASSWORD
* STEAM:REALM
* STEAM:KEY (api key)
