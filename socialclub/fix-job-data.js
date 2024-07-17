// ==UserScript==
// @name         Fix SC Job
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Add the missing property on the job to avoid the Social Club to crash when trying to load the job
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
            // Edit the response here to add the property "content.data.mission.ene.loc" if it doesn't exist
            const data = await clonedResponse.json();
            if (data?.content?.data?.mission?.ene && !data.content.data.mission.ene.loc) {
                data.content.data.mission.ene.loc = [];
            }

            return new Response(JSON.stringify(data), clonedResponse);
        } else {
            return response;
        }
    };
})();
