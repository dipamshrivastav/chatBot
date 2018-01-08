//http://copperwebbot.azurewebsites.net/

var restify = require('restify')
var builder = require('botbuilder')
var cognitiveservices = require('botbuilder-cognitiveservices')

var botConnectorOptions = {
    appId: "5289b3be-0f1a-4412-80c3-c8f64f110f7b",
    appPassword: "hIDJ*F=fK=+hqS%5"
}

// Create bot
var connector = new builder.ChatConnector(botConnectorOptions)
var bot = new builder.UniversalBot(connector)

// Set up restify server
var server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('listening to: ', server.name, server.url)
})
server.post('/api/messages', connector.listen())

// Serve the embded HTML chat bot on our index.html page. Users will interact w/ the bot there.
// Look in the public folder and grab the index.html page
server.get(/\/?.*/, restify.serveStatic({
    directory: './public',
    default: 'index.html'
}));

// Luis Setup
var qnaRecognizer = new cognitiveservices.QnAMakerRecognizer({
    knowledgeBaseId: "706a028d-9166-4041-85bf-457e54d19687", 
    subscriptionKey: "5723d5dc5b394761b285b92a6f34f43e"
})

var BasicQnAMakerDialog = new cognitiveservices.QnAMakerDialog({
    recognizers: [qnaRecognizer],
    defaultMessage: 'No good match in the FAQ. Try changing your query terms.',
    qnaThreshold: 0.5
})

bot.dialog('/', BasicQnAMakerDialog)