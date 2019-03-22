const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    if (message.author.id !== '179527279939026944') return message.channel.send('You do not have permission to use this');    

    try {
        var code = args.join(' ');
        var evaled = eval(code);

        if (typeof evaled !== 'string')
            evaled = require('util').inspect(evaled)
        let embed = new Discord.RichEmbed()
        .setTitle('Eval')
        .setColor('RANDOM')
        .addField('Input', `\`\`\`${code}\`\`\``)
        .addField('Output', `\`\`\`javascript\n${evaled}\`\`\``)
        message.channel.send(embed)
    } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`x1\n${clean(err)}\n\`\`\``)
    }
}

function clean(text) {
    if (typeof(text) === 'string')
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

module.exports.conf = {
    name: "eval",
    description: "Developer Command",
    usage: "eval [code]",
    aliases: ['checkcode', 'evaluate']
}