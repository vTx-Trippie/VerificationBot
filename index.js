const config = require('./config.json');
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const fs = require('fs');
bot.commands = new Discord.Collection();
const mysql = require('mysql');

var con = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
})

con.connect(err => {
    if(err) throw err;
    console.log('Connected to database')
})
function pluck(array) {
  return array.map((item) => {
    return item["name"]
  });
}

function hasRole(mem, role) {
  if (pluck(mem.roles).includes(role)) return true;
  else return false;
}
let settings;

fs.readdir("./commands/", (err, files) => {

    if (err) console.log(err)
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
      console.log("Commands Not Found! Sorry!");
      return;
    }
  
    jsfile.forEach((f, i) => {
      let props = require(`./commands/${f}`);
      console.log(`${f} loaded`);
      bot.commands.set(props.help.name, props);
    });
  });
  bot.on("ready", async () => {
    console.log(`${bot.user.username} is online and in ${bot.guilds.size} guilds!`);
    bot.user.setActivity("!Help | !", {
      type: "Playing"
    });

    con.query("SELECT * FROM settings", (err, results) => {
        if (err) return console.error(err);
        settings = results;
      });
  
  });
  
  bot.on("message", async message => {
  
    con.query("SELECT * FROM settings WHERE serverid = ?", [message.guild.id], (err, results) => {
        if (err) return console.error(err);
        if (results.length > 0) {
          let prefix = results[0].prefix;
          let verifyrole = results[0].verifyrole;
          let servername = results[0].servername;
          let serverid = results[0].serverid;
          let serverowner = results[0].serverowner;
          let adminrole = results[0].adminrole;
          restOfCode(prefix, verifyrole, servername, serverid, serverowner, adminrole)
        }
      });

    function restOfCode(prefix, verifyrole, servername, serverid, serverowner, adminrole) {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
  
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
  
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(bot, message, args, con);
  
    if (message.content.startsWith(prefix + "config set prefix")) {
        if (!hasRole(message.member, adminrole)) return message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${adminrole}\`, this is changeable with \`${prefix}config set adminrole\``);
        let newprefix = args[2];
        con.query("update settings set prefix = ? where serverid = ?", [newprefix, message.guild.id]);

        let embed = new Discord.RichEmbed()
        .setDescription('Prefix')
        .setColor('RED')
        .addField("Set prefix to ", newprefix)
        message.channel.send(embed)
    }
    if (message.content.startsWith(prefix + "config set verifyrole")) {
        if (!hasRole(message.member, adminrole)) return message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${adminrole}\`, this is changeable with \`${prefix}config set admin role\``);
        let verifyrole = args[2];
        con.query("update settings set verifyrole = ? where serverid = ?", [verifyrole, message.guild.id]);

        let embed = new Discord.RichEmbed()
        .setDescription('Verification Role')
        .setColor('RED')
        .addField("Set prefix to ", `${verifyrole}`)
        message.channel.send(embed)
    }
    else if (message.content.startsWith(prefix + "config set adminrole")) {
        if (message.author.id !== serverowner) return message.reply(`Sorry, only the guild owner can do this, contact ${bot.guilds.get(serverid).owner.displayName} if there any issues!`);
        let adminrole = args[2];
        con.query("update settings set adminrole = ? where serverid = ?", [adminrole, message.guild.id]);
        let aembed = new Discord.RichEmbed()
        .setDescription('Admin Role')
        .setColor('RED')
        .addField("Set Admin Role to ", adminrole)
        message.channel.send(aembed);
    }
  }
  });

bot.on("guildCreate", (server) => {
console.log(`Trying to insert server ${server.name} into database.`);
let info = {
    "servername": server.name,
    "serverid": server.id,
    "serverowner": server.owner.id,
    "prefix": "!",
    "adminrole": "Administrator",
    "verifyrole": "Verified"
}
con.query("INSERT INTO settings SET ?", info, (err) => {
    if (err) return console.error(err);
    console.log("Server Inserted!");
  });
});

bot.on("guildUpdate", (server) => {
  console.log(`Trying to update server ${server.name} into database.`);
  let info = {
    "servername": server.name,
    "serverid": server.id,
    "serverowner": server.owner.id
  }

  con.query("update settings SET ? where serverid = ?", [info, server.id], (err) => {
    if (err) return console.error(err);
    console.log("Server Updated!");
  });
});

bot.on("guildDelete", (server) => {
  console.log(`Attempting to remove ${server.name} from the database!`);
  con.query(`DELETE FROM settings WHERE serverid = ${server.id}`, (err) => {
    if (err) return console.error(err);
    console.log("Server Removed!");
  });
});
  
bot.login(config.token)