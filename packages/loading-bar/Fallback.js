import React from 'react';
import ReactDOM from 'react-dom';

export default class Fallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = { shouldRender: false };
  }

  componentDidMount() {
    ReactDOM.unstable_deferredUpdates(() => {
      this.setState({ shouldRender: true });
    });
  }

  render() {
    let { ms, placeholder, children } = this.props;
    return this.state.shouldRender ? (
      <React.Timeout ms={ms}>
        {didExpire => (didExpire ? placeholder : children)}
      </React.Timeout>
    ) : null;
  }
}
