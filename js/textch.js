let message = {
    messages: [
        '"The cycle ends here. We must be better." - Kratos ',
        '"A man chooses. A slave obeys." - Andrew Ryan ',
        '"Good men mean well. We just dont always end up doing well." - Isaac Clarke ',
        '"Its not the end of the world, but you can see it from here." - Colt ',
        '"Im not a hero. Never was, never will be." - Arthur Morgan ',
        'You cant break a pot. You can only break the idea of a pot." - Yagami',
        '"Im here to make my mark. You know what they say, no risk, no reward." - Mirage ',
        '"Remember, no Russian." - Makarov ',
        '"The numbers, Mason! What do they mean?" - Reznov ',
        '"We get dirty, and the world stays clean." - Shepherd ',
        '"Bravo Six, Going Dark" - Captain Price '
    ],
    up: true,
    index: 0,
    count: 0,
    start: function () {
        message.interval = setInterval(() => {
            if (message.count == message.messages[message.index].length) {
                message.up = false
                clearInterval(message.interval)
                setTimeout(message.start, 750)
            } else if (message.count == 1) {
                message.up = true
                message.index = message.index == message.messages.length - 1 ? 0 : ++message.index
            }

            message.count = message.up ? ++message.count : --message.count
            document.getElementById('index_message').textContent = message.messages[message.index].slice(0, message.count)
        }, 75);
    }
}
message.start()