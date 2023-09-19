import { JSDOM } from 'jsdom';

const { window } = new JSDOM(`
    <!doctype html>
    <html>
    <body>
    <div id="app"></div>
    </body>
    </html>
`, {
    runScripts: 'dangerously',
    resources: 'usable'
});

global.window = window;
global.document = window.document
global.navigator = {
    appName: 'other',
    userAgent: 'node.js',
    platform: 'node.js',
};

global.requestAnimationFrame = function(callback) {
    return setTimeout(callback, 0);
};

global.cancelAnimationFrame = function(id) {
    clearTimeout(id);
};

Object.defineProperties(global, {
    ...Object.getOwnPropertyDescriptors(window),
    ...Object.getOwnPropertyDescriptors(global),
});
