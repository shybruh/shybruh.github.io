var audio = document.getElementById('audio');

var init = false;
audio.volume = 0.085;
setInterval(() => {
    if (!init) {
        audio.play()
            .then(() => {
                start();
                init = true;
            })
            .catch(err => { })
    }
}, 100);