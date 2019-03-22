const Discord = require('discord.js');
const Endb = require('endb');
const settings = new Endb.Database({
    name: 'settings',
    fileName: 'settings',
    path: './data'
});

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You do not have Administrator Permission');
    let verifyrole = args.join(" ");
    if (!verifyrole) return message.channel.send('You didnt specify a role');

    let embed = new Discord.RichEmbed()
    .setDescription('Set Verify Role')
    .setColor('RANDOM')
    .addField('New Verify Role', `<@${verifyrole}>`)
    .setTimestamp()
    message.channel.send(embed);

    settings.set(`verifyrole_${message.guild.id}`, verifyrole);
}

module.exports.conf = {
    name: 'set-verify-role',
    description: 'set verification role',
    usage: 'set-verify-role @role',
    aliases: ['svr']
}