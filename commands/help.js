const Discord = require('discord.js');
const config = require('../config.json')

module.exports.run = async (bot, message, args) => {
    if (!args.length) {
        let output = `Commands \n\n[Use ${config.prefix}help <command> for details]\n`
        output += `\n${bot.commands.map(command => `${config.prefix}${command.conf.name} – ${command.conf.description} (${command.conf.usage})`).join('\n\n')}`;
        
        let embed = new Discord.RichEmbed()
        .setDescription(`${output}`)
        .setColor('RANDOM')
        return message.channel.send(embed)
        // return message.channel.send(output, { code: 'asciidoc', split: { char: '\u200b' }});
    } else {
        let command = args[0];
        if (bot.commands.has(command)) command = bot.commands.get(command);

        let embed = new Discord.RichEmbed()
        .setTitle(`${command.conf.name}`)
        .setColor('RANDOM')
        .addField('Description: ', `${command.conf.description}`)
        .addField('Usage: ', `${command.conf.usage}`)
        .addField('Aliases: ', `${command.conf.aliases.join(', ')}`)
        message.channel.send(embed)
        // message.channel.send(`= ${command.conf.name} = \n${command.conf.description}\nUsage: ${command.conf.usage}\nAliases: ${command.conf.aliases.join(', ')}`, { code: 'asciidoc' });
    }
}

module.exports.conf = {
    name: "help",
    description: "Shows all commands",
    usage: `help [command]`,
    aliases: ['helpmenu', 'cmds', 'commands']
}