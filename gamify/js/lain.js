// function to randomly decide order for flicker animation
function triggerRandomFlicker() {

    // get list of elements to have flicker animation applied
    const flickerTitles = document.querySelectorAll('.title');

    flickerTitles.forEach((div) => div.classList.remove('flicker-animation'));

    // get random order
    const firstIndex = Math.random() < 0.5 ? 0 : 1;
    const secondIndex = 1 - firstIndex;

    // perform the flicker for the first title
    flickerTitles[firstIndex].classList.add('flicker-animation');
    setTimeout(() => {
        flickerTitles[firstIndex].classList.remove('flicker-animation');

        // perform the flicker for the second title after some delay
        setTimeout(() => {
            flickerTitles[secondIndex].classList.add('flicker-animation');

            setTimeout(() => {
                flickerTitles[secondIndex].classList.remove('flicker-animation');

                // repeat every 3s
                setTimeout(triggerRandomFlicker, 3000);
            }, 1000);
        }, 500);       // delay between flickers
    }, 1000);

}

// function to zoom in on the lain image
function zoomInOnImage() {
    const prof = document.getElementById('profile-img');

    // Get the position of the zoom target
    const targetRect = prof.getBoundingClientRect();

    // Calculate the center of the target area
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    // Calculate the transform origin and scale
    const scale = 2; // Zoom level (2x)
    const offsetX = window.innerWidth / 2 - targetCenterX - 15;
    const offsetY = window.innerHeight / 2 - targetCenterY;

    // Apply the zoom effect
    document.body.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    document.body.style.transformOrigin = 'center center';
}

// function to fill dropdown menu with usernames of system and display first host in username field
function getUsernames() {
    const usertext = document.getElementById('username');
    const dropdown = document.getElementById('dropdown-menu');

    // get user list and set username field to first user in the list
    const userlist = lightdm.users;
    usertext.value = userlist[0].username;

    // fill dropdown menu with usernames
    userlist.forEach((user) => {
        // create a li item and append to the ul
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(user.username.trim()));

        dropdown.appendChild(li);
    })
}

// function to drop menu when clicked
function dropMenu() {
    const userText = document.getElementById('username');
    const dropDown = document.getElementById('dropdown-menu');

    // handle click on usertext
    userText.addEventListener('click', () => {
        dropDown.classList.toggle('active');
    })

    // handle option selection
    dropDown.querySelectorAll('li').forEach(option => {
        option.addEventListener('click', () => {
            userText.value = option.textContent;
            userText.style.textAlign = 'center';

            dropDown.classList.remove('active');
        });
    });
}

// function to load the menu functions in the correct order
function loadMenu() {
    getUsernames();
    dropMenu();
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
    // start the random flickers
    triggerRandomFlicker()
    
    // get username, password and button element
    const usertext = document.getElementById('username');
    const passtext = document.getElementById('password');
    const btn = document.getElementById('login-button');

    // event listener to get login when button is clicked
    btn.addEventListener('click', async () => {
        const authenticated = await authenticate(usertext.value.trim(), passtext.value.trim());
         // if password is correct, zoom in on image and start session
        if(authenticated) {
            zoomInOnImage();
            await wait(1000);
            lightdm.start_session(lightdm.sessions[0].key);
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
                zoomInOnImage();
                await wait(1000);
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
