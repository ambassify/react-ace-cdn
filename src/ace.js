import PropTypes from 'prop-types';
import React from 'react';
import isEqual from 'lodash.isequal';
import injectAce from './injectAce';

const editorOptions = [
    'minLines',
    'maxLines',
    'readOnly',
    'highlightActiveLine',
    'tabSize',
    'enableBasicAutocompletion',
    'enableLiveAutocompletion',
    'enableSnippets'
];

export class ReactAce extends React.Component {

    constructor(props) {
        super(props);
        [
            'onEditor',
            'onChange',
            'onFocus',
            'onBlur',
            'onCopy',
            'onPaste',
            'onScroll',
            'handleOptions'
        ]
            .forEach(method => {
                this[method] = this[method].bind(this);
            });
    }

    componentDidMount() {
        const {
            ace,
            className,
            onBeforeLoad,
            mode,
            focus,
            theme,
            fontSize,
            value,
            defaultValue,
            cursorStart,
            showGutter,
            wrapEnabled,
            showPrintMargin,
            keyboardHandler,
            onLoad,
            commands,
            annotations,
            markers
        } = this.props;

        this.editor = ace.edit(this.editorRef);

        if (onBeforeLoad)
            onBeforeLoad(ace);


        const editorProps = Object.keys(this.props.editorProps);
        for (let i = 0; i < editorProps.length; i++)
            this.editor[editorProps[i]] = this.props.editorProps[editorProps[i]];

        if (mode)
            this.editor.getSession().setMode(`ace/mode/${mode}`);

        if (theme)
            this.editor.setTheme(`ace/theme/${theme}`);

        this.editor.setFontSize(fontSize);
        this.editor.setValue(defaultValue === undefined ? value : defaultValue, cursorStart);
        this.editor.renderer.setShowGutter(showGutter);
        this.editor.getSession().setUseWrapMode(wrapEnabled);
        this.editor.setShowPrintMargin(showPrintMargin);
        this.editor.on('focus', this.onFocus);
        this.editor.on('blur', this.onBlur);
        this.editor.on('copy', this.onCopy);
        this.editor.on('paste', this.onPaste);
        this.editor.on('change', this.onChange);
        this.editor.session.on('changeScrollTop', this.onScroll);
        this.handleOptions(this.props);
        this.editor.getSession().setAnnotations(annotations || []);
        this.handleMarkers(markers || []);

        // get a list of possible options to avoid 'misspelled option errors'
        const availableOptions = this.editor.$options;
        for (let i = 0; i < editorOptions.length; i++) {
            const option = editorOptions[i];
            if (Object.hasOwnProperty.call(availableOptions, option))
                this.editor.setOption(option, this.props[option]);

        }

        if (Array.isArray(commands)) {
            commands.forEach((command) => {
                this.editor.commands.addCommand(command);
            });
        }

        if (keyboardHandler)
            this.editor.setKeyboardHandler('ace/keyboard/' + keyboardHandler);


        if (className)
            this.editorRef.className += ' ' + className;


        if (focus)
            this.editor.focus();


        if (onLoad)
            onLoad(this.editor);

    }

    componentDidUpdate(oldProps) {
        const nextProps = this.props;

        for (let i = 0; i < editorOptions.length; i++) {
            const option = editorOptions[i];
            if (nextProps[option] !== oldProps[option])
                this.editor.setOption(option, nextProps[option]);

        }

        if (nextProps.className !== oldProps.className) {
            const appliedClasses = this.editorRef.className;
            const appliedClassesArray = appliedClasses.trim().split(' ');
            const oldClassesArray = oldProps.className.trim().split(' ');
            oldClassesArray.forEach((oldClass) => {
                const index = appliedClassesArray.indexOf(oldClass);
                appliedClassesArray.splice(index, 1);
            });
            this.editorRef.className = ' ' + nextProps.className + ' ' + appliedClassesArray.join(' ');
        }

        if (nextProps.mode !== oldProps.mode)
            this.editor.getSession().setMode('ace/mode/' + nextProps.mode);

        if (nextProps.theme !== oldProps.theme)
            this.editor.setTheme('ace/theme/' + nextProps.theme);

        if (nextProps.keyboardHandler !== oldProps.keyboardHandler) {
            if (nextProps.keyboardHandler)
                this.editor.setKeyboardHandler('ace/keyboard/' + nextProps.keyboardHandler);
            else
                this.editor.setKeyboardHandler(null);

        }
        if (nextProps.fontSize !== oldProps.fontSize)
            this.editor.setFontSize(nextProps.fontSize);

        if (nextProps.wrapEnabled !== oldProps.wrapEnabled)
            this.editor.getSession().setUseWrapMode(nextProps.wrapEnabled);

        if (nextProps.showPrintMargin !== oldProps.showPrintMargin)
            this.editor.setShowPrintMargin(nextProps.showPrintMargin);

        if (nextProps.showGutter !== oldProps.showGutter)
            this.editor.renderer.setShowGutter(nextProps.showGutter);

        if (!isEqual(nextProps.setOptions, oldProps.setOptions))
            this.handleOptions(nextProps);

        if (!isEqual(nextProps.annotations, oldProps.annotations))
            this.editor.getSession().setAnnotations(nextProps.annotations || []);

        if (!isEqual(nextProps.markers, oldProps.markers))
            this.handleMarkers(nextProps.markers || []);

        if (this.editor && this.editor.getValue() !== nextProps.value) {
            // editor.setValue is a synchronous function call, change event is emitted before setValue return.
            this.silent = true;
            const pos = this.editor.session.selection.toJSON();
            this.editor.setValue(nextProps.value, nextProps.cursorStart);
            this.editor.session.selection.fromJSON(pos);
            this.silent = false;
        }

        if (nextProps.focus && !oldProps.focus)
            this.editor.focus();

        if (nextProps.height !== this.props.height)
            this.editor.resize();

    }

    componentWillUnmount() {
        this.editor.destroy();
        this.editor = null;
    }


    handleOptions(props) {
        const setOptions = Object.keys(props.setOptions);
        for (let y = 0; y < setOptions.length; y++)
            this.editor.setOption(setOptions[y], props.setOptions[setOptions[y]]);

    }

    handleMarkers(markers) {
        const { Range } = this.props.ace.require('ace/range');

        // remove foreground markers
        let currentMarkers = this.editor.getSession().getMarkers(true);
        for (const i in currentMarkers) {
            if (Object.hasOwnProperty.call(currentMarkers, i))
                this.editor.getSession().removeMarker(currentMarkers[i].id);

        }
        // remove background markers
        currentMarkers = this.editor.getSession().getMarkers(false);
        for (const i in currentMarkers) {
            if (Object.hasOwnProperty.call(currentMarkers, i))
                this.editor.getSession().removeMarker(currentMarkers[i].id);

        }
        // add new markers
        markers.forEach(({ startRow, startCol, endRow, endCol, className, type, inFront = false }) => {
            const range = new Range(startRow, startCol, endRow, endCol);
            this.editor.getSession().addMarker(range, className, type, inFront);
        });
    }

    onEditor(ref) {
        this.editorRef = ref;
    }

    onChange() {
        if (this.props.onChange && !this.silent) {
            const value = this.editor.getValue();
            this.props.onChange(value);
        }
    }

    onFocus() {
        if (this.props.onFocus)
            this.props.onFocus();

    }

    onBlur() {
        if (this.props.onBlur)
            this.props.onBlur();

    }

    onCopy(text) {
        if (this.props.onCopy)
            this.props.onCopy(text);

    }

    onPaste(text) {
        if (this.props.onPaste)
            this.props.onPaste(text);

    }

    onScroll() {
        if (this.props.onScroll)
            this.props.onScroll(this.editor);

    }

    render() {
        const { name, width, height, style } = this.props;
        const divStyle = { width, height, ...style };
        return (
            <div ref={this.onEditor} id={name} style={divStyle} />
        );
    }
}

ReactAce.propTypes = {
    ace: PropTypes.object,
    mode: PropTypes.string,
    focus: PropTypes.bool,
    theme: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    height: PropTypes.string,
    width: PropTypes.string,
    fontSize: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    showGutter: PropTypes.bool,
    onChange: PropTypes.func,
    onCopy: PropTypes.func,
    onPaste: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onScroll: PropTypes.func,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    onLoad: PropTypes.func,
    onBeforeLoad: PropTypes.func,
    minLines: PropTypes.number,
    maxLines: PropTypes.number,
    readOnly: PropTypes.bool,
    highlightActiveLine: PropTypes.bool,
    tabSize: PropTypes.number,
    showPrintMargin: PropTypes.bool,
    cursorStart: PropTypes.number,
    editorProps: PropTypes.object,
    setOptions: PropTypes.object,
    annotations: PropTypes.array,
    markers: PropTypes.array,
    keyboardHandler: PropTypes.string,
    wrapEnabled: PropTypes.bool,
    enableBasicAutocompletion: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.array
    ]),
    enableLiveAutocompletion: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.array
    ]),
    commands: PropTypes.array
};

ReactAce.defaultProps = {
    name: 'ace-editor',
    focus: false,
    mode: '',
    theme: '',
    height: '500px',
    width: '500px',
    value: '',
    fontSize: 12,
    showGutter: true,
    onChange: null,
    onPaste: null,
    onLoad: null,
    onScroll: null,
    minLines: null,
    maxLines: null,
    readOnly: false,
    highlightActiveLine: true,
    showPrintMargin: true,
    tabSize: 4,
    cursorStart: 1,
    editorProps: {},
    setOptions: {},
    wrapEnabled: false,
    enableBasicAutocompletion: false,
    enableLiveAutocompletion: false
};

export default injectAce(ReactAce);
