const Discord = require("discord.js");

module.exports.run = async (bot, message, args, con) => {

  con.query("SELECT * FROM settings", (err, results) => {
    if (err) return console.error(err);
    settings = results;
  });

  con.query(`SELECT verifyrole FROM settings WHERE serverid = ${message.guild.id}`, async (err, results) => {
    let verifyrole = results[0].verifyrole;

    let vrole = message.guild.roles.find(`name`, verifyrole);

    if(message.member.roles.has(vrole.id)) return message.reply("You are already verified");
    await(message.member.addRole(vrole.id));

  let addEmbed = new Discord.RichEmbed()
  .setDescription("Verification")
  .setColor("RED")
  .addField("User Verified", `${message.author}`)
  message.channel.send(addEmbed)
  })


}

module.exports.help = {
  name: "verify"
}
