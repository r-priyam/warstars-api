import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { Intents } from 'discord.js';
import * as path from 'path';

export default class Client extends AkairoClient {
    public commandHandler: CommandHandler = new CommandHandler(this, {
        directory: path.join(__dirname, '..', 'commands'),
        prefix: '!',
        aliasReplacement: /-/g,
        allowMention: true,
        fetchMembers: true,
        commandUtil: true,
        handleEdits: true,
        defaultCooldown: 3000,
        commandUtilLifetime: 3e5,
        commandUtilSweepInterval: 9e5
    });

    public listenerHandler = new ListenerHandler(this, {
        directory: path.join(__dirname, '..', 'listener')
    });

    public inhibitorHandler = new InhibitorHandler(this, {
        directory: path.join(__dirname, '..', 'inhibitor')
    });

    public constructor() {
        super({
            intents: Object.values(Intents.FLAGS),
            ownerID: ['292332992251297794', '554882868091027456'],
            partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
            allowedMentions: { repliedUser: false, parse: ['users'] }
        });
    }

    private async init() {
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler,
            inhibitorHandler: this.inhibitorHandler
        });

        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
        this.inhibitorHandler.loadAll();
    }

    public async start(token: string) {
        await this.init();
        return this.login(token);
    }
}
