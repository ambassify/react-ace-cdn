# react-ace-cdn

A react component for Ace that loads the Ace files from `https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/` on demand.

## Install

`npm install react-ace-cdn`

## Usage

```javascript
import React from 'react';
import { render } from 'react-dom';
import AceEditor from 'react-ace-cdn';

function onChange(newValue) {
  console.log('change',newValue);
}

// Render editor
render(
  <AceEditor
    mode="java"
    theme="github"
    onChange={onChange}
    name="UNIQUE_ID_OF_DIV"
    editorProps={{$blockScrolling: true}}
  />,
  document.getElementById('example')
);
```

#### Available Props

|Prop|Default|Description|
|-----|------|----------|
|name| 'ace-editor'| Unique Id to be used for the editor|
|mode| ''| Language for parsing and code highlighting|
|theme| ''| theme to use|
|height| '500px'| CSS value for height|
|width| '500px'| CSS value for width|
|className| | custom className|
|fontSize| 12| pixel value for font-size|
|showGutter| true| boolean|
|showPrintMargin| true| boolean|
|highlightActiveLine| true| boolean|
|focus| false| boolean|
|cursorStart| 1| number|
|wrapEnabled| false| Wrapping lines|
|readOnly| false| boolean|
|minLines| | Minimum number of lines to be displayed|
|maxLines| | Maximum number of lines to be displayed|
|enableBasicAutocompletion| false| Enable basic autocompletion|
|enableLiveAutocompletion| false| Enable live autocompletion|
|tabSize| 4| tabSize number|
|value | ''| String value you want to populate in the code highlighter|
|defaultValue | ''| Default value of the editor|
|onLoad| | Function onLoad|
|onBeforeLoad| | function that trigger before editor setup|
|onChange| | function that occurs on document change it has 1 argument value. see the example above|
|onCopy| | function that trigger by editor `copy` event, and pass text as argument|
|onPaste| | function that trigger by editor `paste` event, and pass text as argument|
|onFocus| | function that trigger by editor `focus` event|
|onBlur| | function that trigger by editor `blur` event|
|onScroll| | function that trigger by editor `scroll` event|
|editorProps| | Object of properties to apply directly to the Ace editor instance|
|setOptions| | Object of [options](https://github.com/ajaxorg/ace/wiki/Configuring-Ace) to apply directly to the Ace editor instance|
|keyboardHandler| | String corresponding to the keybinding mode to set (such as vim)|
|commands| | Array of new commands to add to the editor
|annotations| | Array of annotations to show in the editor i.e. `[{ row: 0, column: 2, type: 'error', text: 'Some error.'}]`, displayed in the gutter|
|markers| | Array of [markers](https://ace.c9.io/api/edit_session.html#EditSession.addMarker) to show in the editor, i.e. `[{ startRow: 0, startCol: 2, endRow: 1, endCol: 20, className: 'error-marker', type: 'background' }]`|


## Modes, Themes, and Keyboard Handlers

All modes, themes, and keyboard handlers will be requested from CDN on-demand.  This prevents bloating the compiled javascript with extra modes and themes for your application.

### Example Modes

* javascript
* java
* python
* xml
* ruby
* sass
* markdown
* mysql
* json
* html
* handlebars
* golang
* csharp
* coffee
* css

### Example Themes

* monokai
* github
* tomorrow
* kuroir
* twilight
* xcode
* textmate
* solarized dark
* solarized light
* terminal

### Example Keyboard Handlers

* vim
* emacs
