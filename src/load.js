export const available = () => !!window.ace;

const _url = 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/ace.js';
const _onLoad = [];
let _isLoading = false;

export default function load(cb) {
    if (available()) {
        cb();
        return;
    }

    _onLoad.push(cb);

    if (_isLoading)
        return;

    _isLoading = true;

    let result;
    const script = document.createElement('script');
    const container = document.getElementsByTagName('head')[0] ||
        document.getElementsByTagName('body')[0];

    script.type = 'text/javascript';
    script.src = _url;
    script.async = true;

    script.onload = script.onreadystatechange = function () {
        const ready = !this.readyState || this.readyState == 'complete';
        if (!result && ready) {
            result = true;
            _onLoad.forEach(_cb => _cb());
        }
    };

    container.appendChild(script);
}
