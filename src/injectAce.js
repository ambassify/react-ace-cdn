import React from 'react';
import loadAce, { available as hasAce } from './load';

export default (Component) => class InjectAce extends React.Component {

    componentDidMount() {
        this.mounted = true;

        if (!hasAce())
            loadAce(() => { if (this.mounted) this.forceUpdate(); });
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        if (!hasAce())
            return null;

        return React.createElement(Component, { ace: window.ace, ...this.props});
    }
}
