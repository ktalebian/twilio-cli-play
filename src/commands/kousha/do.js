  
const { TwilioClientCommand } = require("@twilio/cli-core").baseCommands;


class KoushaDo extends TwilioClientCommand {
    async run() {
        console.log('hello');
    }
}

module.exports = KoushaDo;