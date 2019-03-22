const Discord = require('discord.js');
const Endb = require('endb');
const settings = new Endb.Database({
    name: 'settings',
    fileName: 'settings',
    path: './data'
});

module.exports.run = async (bot, message, args) => {
    let verifyrole = settings.get(`verifyrole_${message.guild.id}`);

    let vrole = message.guild.roles.find('name', verifyrole);
    if (message.member.roles.has(vrole.id)) return message.reply("You are already verified");
    await (message.member.addRole(vrole.id));

    let addEmbed = new Discord.RichEmbed()
        .setDescription("Verification")
        .setColor("RANDOM")
        .addField("User Verified", `${message.author}`)
    message.channel.send(addEmbed);
}

module.exports.conf = {
    name: 'verify',
    description: 'adds a role to the user when they run the command',
    usage: 'verify',
    aliases: ['vfy']
}