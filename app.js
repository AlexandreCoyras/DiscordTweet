require('dotenv').config()
const axios = require('axios');
const { Client, Intents, GatewayIntentBits  } = require('discord.js');
const moment = require('moment-timezone');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildIntegrations]
        });

axios.defaults.headers.common = {'Authorization': `bearer ${process.env.BEARER}`}
let tweets = []




const updateTwitter = () => {
    let hour = moment().tz('Europe/Paris').hours()
    if (hour > 2 && hour < 9) // Don't send request
        return setTimeout(updateTwitter, 7000)
    axios.get("https://api.twitter.com/2/users/1111277747161178114/tweets")
        .then((res) => {
            res.data.data.forEach((tweet) => {
                if (tweets.includes(tweet.id)) return
                tweets.push(tweet.id)
                let charToExclude = ["#", "'", "@", "’", ":", "é"]
                let codes = tweet.text.split(/[\s,]+/).filter((word) => {
                    if (!word.toLocaleLowerCase().includes("lacompo")) return false
                    return !charToExclude.some((chara) => word.indexOf(chara) !== -1);
                })
                if (codes.length >= 1)
                    codes.forEach((code) => {
                        client.channels.cache.get("844986176011632643").send(`${code}`)
                        client.channels.cache.get("844986176011632643").send("<@&1052353187430019102>")
                    })
            })
            setTimeout(updateTwitter, 5000)
        })
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    axios.get("https://api.twitter.com/2/users/1111277747161178114/tweets")
        .then((res) => {
            res.data.data.forEach((tw) => tweets.push(tw.id))
            updateTwitter()
        })
});

client.on("messageCreate", (message) => {
    console.log('AAA' + message)
    if (message.content.startsWith("ping")) {
        message.reply('pong')
    }
});

client.login(process.env.TOKEN);
