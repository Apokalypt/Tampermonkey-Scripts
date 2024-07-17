// ==UserScript==
// @name         Show job platform
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Add the platform information on the job page
// @author       Apokalypt
// @match        https://socialclub.rockstargames.com/job/gtav/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rockstargames.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const path = window.location.pathname;
    const jobId = path.substring(path.lastIndexOf('/') + 1);

    console.log('Improve the design for the job with ID -> ', jobId);

    const { fetch: originalFetch } = window;

    window.fetch = async (...args) => {
        let [resource, config ] = args;

        // request interceptor here
        const response = await originalFetch(resource, config);

        const clonedResponse = response.clone();
        const path = clonedResponse.url;
        if (path.startsWith('https://scapi.rockstargames.com/ugc/mission/details') && clonedResponse.status === 200) {
            try {
                const result = await clonedResponse.json();

                setTimeout(() => {
                    const platform = result?.content?.platform;
                    if (platform) {
                        const container = document.getElementsByClassName('Ugc__stats__VvWBN')[0];

                        const div = document.createElement('div');
                        container.firstChild.classList.forEach( value => div.classList.add(value) );

                        const divKey = document.createElement('div');
                        divKey.textContent = 'Platform';
                        const divValue = document.createElement('div');
                        container.firstChild.children[1].classList.forEach( value => divValue.classList.add(value) );
                        divValue.textContent = platform.toUpperCase();

                        div.append(divKey);
                        div.append(divValue);

                        container.prepend(div);
                    } else {
                        alert('No platform found for this job: ', JSON.stringify(result));
                    }
                }, 500)
            } catch(e) {
                console.error(e);
                alert(e.message ?? 'Unknown error occured');
            }
        }

        // response interceptor here
        return response;
    };
})();
