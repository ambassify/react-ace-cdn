import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ReactAce } from '../../src/ace.js';
import loadAce from '../../src/load.js';

Enzyme.configure({ adapter: new Adapter() });

let ace;

describe('Ace Component', () => {

    // Required for the document.getElementById used by Ace can work in the test environment
    const domElement = document.getElementById('app');
    const mountOptions = {
        attachTo: domElement,
    };
    let wrapper;

    afterEach(function() {
        wrapper?.unmount();
        wrapper = null;
    })

    describe('General', () => {


        before(function(done) {
            loadAce(() => { ace = window.ace; done(); });
        });

        it('should render without problems with defaults properties', () => {
            wrapper = mount(<ReactAce ace={ace} />, mountOptions);
            expect(wrapper).to.exist;
        });

        it('should get the ace library from the onBeforeLoad callback', () => {
            const beforeLoadCallback = sinon.spy();
            wrapper = mount(<ReactAce ace={ace} onBeforeLoad={beforeLoadCallback}/>, mountOptions);

            expect(beforeLoadCallback.callCount).to.equal(1);
            expect(beforeLoadCallback.getCall(0).args[0]).to.deep.equal(window.ace);
        });

        it('should get the editor from the onLoad callback', () => {
            const loadCallback = sinon.spy();
            wrapper = mount(<ReactAce ace={window.ace} onLoad={loadCallback}/>, mountOptions);

            // Get the editor
            const editor = wrapper.instance().editor;

            expect(loadCallback.callCount).to.equal(1);
            expect(loadCallback.getCall(0).args[0]).to.deep.equal(editor);
        });

        it('should set the editor props to the Ace element', () => {
            const editorProperties = {
                react: 'setFromReact',
                test: 'setFromTest',
            };
            wrapper = mount(<ReactAce ace={ace} editorProps={editorProperties}/>, mountOptions);

            const editor = wrapper.instance().editor;

            expect(editor.react).to.equal(editorProperties.react);
            expect(editor.test).to.equal(editorProperties.test);
        });

        it('should set the command for the Ace element', () => {
            const commandsMock = [
                {
                    name: 'myReactAceTest',
                    bindKey: { win: 'Ctrl-M', mac: 'Command-M' },
                    exec: () => {
                    },
                    readOnly: true
                },
                {
                    name: 'myTestCommand',
                    bindKey: { win: 'Ctrl-W', mac: 'Command-W' },
                    exec: () => {
                    },
                    readOnly: true
                }
            ];
            wrapper = mount(<ReactAce ace={ace} commands={commandsMock}/>, mountOptions);

            const editor = wrapper.instance().editor;
            expect(editor.commands.commands.myReactAceTest).to.deep.equal(commandsMock[0]);
            expect(editor.commands.commands.myTestCommand).to.deep.equal(commandsMock[1]);
        });

        it('should trigger the focus on mount', () => {
            const onFocusCallback = sinon.spy();
            wrapper = mount(<ReactAce ace={ace} focus={true} onFocus={onFocusCallback}/>, mountOptions);

            // Read the focus
            expect(onFocusCallback.callCount).to.equal(1);
        });

        it('should set up the markers', () => {
            const markers = [ {
                startRow: 3,
                type: 'text',
                className: 'test-marker'
            } ];
            wrapper = mount(<ReactAce ace={ace} markers={markers}/>, mountOptions);

            // Read the markers
            const editor = wrapper.instance().editor;
            expect(editor.getSession().getMarkers()['3'].clazz).to.equal('test-marker');
            expect(editor.getSession().getMarkers()['3'].type).to.equal('text');
        });

        it('should set editor to null on componentWillUnmount', () => {
            wrapper = mount(<ReactAce ace={ace} />, mountOptions);

            const instance = wrapper.instance()
            expect(instance.editor).to.not.equal(null);
            // Check the editor is null after the Unmount
            wrapper.unmount();
            expect(instance.editor).to.equal(null);
            wrapper = null;
        });

    });

    describe('Events', () => {

        it('should call the onChange method callback', () => {
            const onChangeCallback = sinon.spy();
            wrapper = mount(<ReactAce ace={ace} onChange={onChangeCallback}/>, mountOptions);

            // Check is not previously called
            expect(onChangeCallback.callCount).to.equal(0);

            // Trigger the change event
            const expectText = 'React Ace Test';
            wrapper.instance().editor.setValue(expectText, 1);

            expect(onChangeCallback.callCount).to.equal(1);
            expect(onChangeCallback.getCall(0).args[0]).to.equal(expectText);
        });

        it('should call the onCopy method', () => {
            const onCopyCallback = sinon.spy();
            wrapper = mount(<ReactAce ace={ace} onCopy={onCopyCallback}/>, mountOptions);

            // Check is not previously called
            expect(onCopyCallback.callCount).to.equal(0);

            // Trigger the copy event
            const expectText = 'React Ace Test';
            wrapper.instance().onCopy(expectText);

            expect(onCopyCallback.callCount).to.equal(1);
            expect(onCopyCallback.getCall(0).args[0]).to.equal(expectText);
        });

        it('should call the onPaste method', () => {
            const onPasteCallback = sinon.spy();
            wrapper = mount(<ReactAce ace={ace} onPaste={onPasteCallback}/>, mountOptions);

            // Check is not previously called
            expect(onPasteCallback.callCount).to.equal(0);

            // Trigger the Paste event
            const expectText = 'React Ace Test';
            wrapper.instance().onPaste(expectText);

            expect(onPasteCallback.callCount).to.equal(1);
            expect(onPasteCallback.getCall(0).args[0]).to.equal(expectText);
        });

        it('should call the onFocus method callback', () => {
            const onFocusCallback = sinon.spy();
            wrapper = mount(<ReactAce ace={ace} onFocus={onFocusCallback}/>, mountOptions);

            // Check is not previously called
            expect(onFocusCallback.callCount).to.equal(0);

            // Trigger the focus event
            wrapper.instance().editor.focus();

            expect(onFocusCallback.callCount).to.equal(1);
        });

        it('should call the onBlur method callback', () => {
            const onBlurCallback = sinon.spy();
            wrapper = mount(<ReactAce ace={ace} onBlur={onBlurCallback}/>, mountOptions);

            // Check is not previously called
            expect(onBlurCallback.callCount).to.equal(0);

            // Trigger the blur event
            wrapper.instance().onBlur();

            expect(onBlurCallback.callCount).to.equal(1);
        });

        it('should not trigger a component error to call the events without setting the props', () => {
            wrapper = mount(<ReactAce ace={ace} />, mountOptions);

            // Check the if statement is checking if the property is set.
            wrapper.instance().onChange();
            wrapper.instance().onCopy('copy');
            wrapper.instance().onPaste('paste');
            wrapper.instance().onFocus();
            wrapper.instance().onBlur();
        });

    });

    describe('ComponentWillReceiveProps', () => {

        it('should update the editorOptions on componentWillReceiveProps', () => {
            const options = {
                printMargin: 80
            };
            wrapper = mount(<ReactAce ace={ace} setOptions={options}/>, mountOptions);

            // Read set value
            const editor = wrapper.instance().editor;
            expect(editor.getOption('printMargin')).to.equal(options.printMargin);

            // Now trigger the componentWillReceiveProps
            const newOptions = {
                printMargin: 200,
                animatedScroll: true,
            };
            wrapper.setProps({ setOptions: newOptions });
            expect(editor.getOption('printMargin')).to.equal(newOptions.printMargin);
            expect(editor.getOption('animatedScroll')).to.equal(newOptions.animatedScroll);
        });

        it('should update the className on componentWillReceiveProps', () => {
            const className = 'old-class';
            wrapper = mount(<ReactAce ace={ace} className={className}/>, mountOptions);

            // Read set value
            let editor = wrapper.instance().editorRef;
            expect(editor.className).to.equal(' ace_editor ace-tm old-class');

            // Now trigger the componentWillReceiveProps
            const newClassName = 'new-class';
            wrapper.setProps({ className: newClassName });
            editor = wrapper.instance().editorRef;
            expect(editor.className).to.equal(' new-class ace_editor ace-tm');
        });


        it('should update the value on componentWillReceiveProps', () => {
            const startValue = 'start value';
            wrapper = mount(<ReactAce ace={ace} value={startValue}/>, mountOptions);

            // Read set value
            let editor = wrapper.instance().editor;
            expect(editor.getValue()).to.equal(startValue);

            // Now trigger the componentWillReceiveProps
            const newValue = 'updated value';
            wrapper.setProps({ value: newValue });
            editor = wrapper.instance().editor;
            expect(editor.getValue()).to.equal(newValue);
        });

        it('should trigger the focus on componentWillReceiveProps', () => {
            const onFocusCallback = sinon.spy();
            wrapper = mount(<ReactAce ace={ace} onFocus={onFocusCallback}/>, mountOptions);

            // Read the focus
            expect(onFocusCallback.callCount).to.equal(0);

            // Now trigger the componentWillReceiveProps
            wrapper.setProps({ focus: true });
            expect(onFocusCallback.callCount).to.equal(1);
        });

    });

});
