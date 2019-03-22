const config = require('./config.json');
const Discord = require('discord.js');
const fs = require('fs');
const bot = new Discord.Client()
const Endb = require('endb');

const prefix = config.prefix;

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {

  if (err) console.log(err)
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log("Commands Not Found! Sorry!");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`[${i + 1}]: ${f} loaded`);
    bot.commands.set(props.conf.name, props);

    props.conf.aliases.forEach(alias => {
      bot.aliases.set(alias, props.conf.name);
    });
  });
});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online and in ${bot.guilds.size} guilds!`);
  bot.user.setActivity("v!help || v!", {
    type: "Playing"
  });

});
bot.on("message", async message => {

  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (!message.content.startsWith(`${prefix}`)) return;

  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let command = args.shift().toLowerCase();
  let cmd = bot.commands.get(command) || bot.commands.get(bot.aliases.get(command));
  if (!cmd) return;
  cmd.run(bot, message, args)
});


bot.login(config.token)