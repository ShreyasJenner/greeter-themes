const video = document.querySelector('video');
const animationRunTime = 2500;

// function to start video
function startVideo() {
    video.playbackRate = 2.4;
    video.play();
}

// function to start post authentication animation
function startAnimation() {
    // hide the titles
    document.getElementsByClassName('content')[0].style.display = 'none';

    // hide the buttons
    const btns = document.querySelectorAll('button');
    btns.forEach((btn) => {btn.style.display = 'none'});

    // start the video 
    startVideo();
}

// function to add event listener to power buttons
function powerbuttonHandling() {
    // get the power buttons
    const shutdown = document.getElementById('shutdown-btn');
    const restart = document.getElementById('restart-btn');

    shutdown.addEventListener('click', () => {
        lightdm.shutdown();
    });
    
    restart.addEventListener('click', () => {
        lightdm.restart();
    })
}

/**********************************************************/
/* WEB GREETER CODE */

// function to wait for n ms
function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// function to sumbit username and password and authenticate
async function authenticate(username, password) {
    // check username and password with lightdm
    lightdm.authenticate(username);
    await wait(100);
    lightdm.respond(password);

    // wait and then return authentication value
    await wait(100);
    return lightdm.is_authenticated;
}

// function to init greeter
async function initListener() {
    
    // get username, password and button element
    const usertext = document.getElementById('username');
    const passtext = document.getElementById('password');
    const btn = document.getElementById('login-button');

    // event listener to get login when button is clicked
    btn.addEventListener('click', async () => {
        const authenticated = await authenticate(usertext.value.trim(), passtext.value.trim());
         // if password is correct, zoom in on image and start session
        if(authenticated) {
            startAnimation();
            await wait(animationRunTime);
            lightdm.start_session("xinitrc");
        } else {
            // if password is incorrect, turn the password box red
            passtext.style.border = "2px red";
            passtext.style.borderStyle = "solid";
        }
    });

    // event listener to login when enter button is pressed
    passtext.addEventListener('keyup', async (event) => {
        if(event.key === "Enter") {
            const authenticated = await authenticate(usertext.value.trim(), passtext.value.trim());
            // if password is correct, zoom in on image and start session
            if(authenticated) {
                startAnimation();
                await wait(animationRunTime);
                lightdm.start_session("xinitrc");
            } else {
                // if password is incorrect, turn the password box red
                passtext.style.border = "2px red";
                passtext.style.borderStyle = "solid";
            }
        }
    });

    // add power button handling
    powerbuttonHandling();
}

/* Driver Code */
initListener();
