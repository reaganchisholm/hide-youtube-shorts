// console.log('Hide Youtube Shorts: loaded');

const SHORTS_SVG = `<svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.6506 0C8.2806 0 7.9006 0.0999999 7.5606 0.31L2.2506 3.46C1.4406 3.93 0.960602 4.89 1.0006 5.9C1.0506 6.9 1.5806 7.77 2.3906 8.18C2.4106 8.19 3.1406 8.53 3.1406 8.53L2.2406 9.06C1.1006 9.74 0.660602 11.33 1.2606 12.61C1.6906 13.49 2.5006 14 3.3506 14C3.7206 14 4.0906 13.9 4.4406 13.69L9.7506 10.54C10.5506 10.06 11.0406 9.11 10.9906 8.09C10.9506 7.1 10.4106 6.22 9.6006 5.82C9.5806 5.81 8.8506 5.47 8.8506 5.47L9.7506 4.94C10.8906 4.26 11.3306 2.67 10.7206 1.39C10.3106 0.51 9.4906 0 8.6506 0Z" fill="currentColor"/></svg>`;
let interval = null;

const showShortsCheck = chrome.storage.local.get(['hys-hide-shorts-check']).then((obj) => {
    const isHidden = Boolean(obj['hys-hide-shorts-check']);
    // Wait for the button to be added to the DOM before adding our own button
    const waitingForElement = setInterval(() => {
        if(document.getElementById('top-level-buttons-computed') != null) {
            setupButton(isHidden);
            clearInterval(waitingForElement);

            if(isHidden == true) {
                hideShorts();
            }
        }
    }, 1000);
});

const setupButton = (isHidden) => {
    const button = document.createElement('button');
    button.innerHTML = SHORTS_SVG;
    button.style.background = 'transparent';
    button.style.border = '0';
    button.style.cursor = 'pointer';
    button.style.color = 'var(--yt-spec-text-primary)';

    if(isHidden == true) {
        toggleButton();
    }

    // Append the button to the DOM
    document.getElementById('top-level-buttons-computed').appendChild(button);

    // Add handling for clicks
    button.addEventListener('click', () => {
        if(button.style.opacity != '0.3') {
            hideShorts();
            toggleButton();
            chrome.storage.local.set({ "hys-hide-shorts-check": true });

            interval = setInterval(() => {
                hideShorts();
            }, 350);
        } else {
            toggleButton();
            chrome.storage.local.set({ "hys-hide-shorts-check": false });
            showShorts();
            clearInterval(interval);
            interval = null;
        }
    });

    function toggleButton(){
        if(button.style.opacity != '0.3') {
            button.title = 'Show Shorts';
            button.style.opacity = '0.3';
        } else {
            button.title = 'Hide Shorts';
            button.style.opacity = '1';
        }
    }
}

const hideShorts = () => {
    // Select all shorts that are not hidden
    const shorts = document.querySelectorAll('[overlay-style="SHORTS"]:not(.is-hidden)');

    // If there are no shorts, return
    if (!shorts) {
        return;
    }

    // Loop through all shorts and hide them
    shorts.forEach((short) => {
        const parent = short.closest('ytd-grid-video-renderer');

        if (parent) {
            // Hide the short, add our own class to it so we can avoid hidden ones
            short.classList.add('is-hidden');
            parent.style.display = 'none';
        }
    })
}

const showShorts = () => {
    // Select all shorts that are hidden
    const shorts = document.querySelectorAll('[overlay-style="SHORTS"].is-hidden');

    // If there are no shorts, return
    if (!shorts) {
        return;
    }

    // Loop through all shorts and show them
    shorts.forEach((short) => {
        const parent = short.closest('ytd-grid-video-renderer');

        if (parent) {
            // Show the short, remove our own class from it
            short.classList.remove('is-hidden');
            parent.style.display = 'block';
        }
    })
}