import React from 'react';
import ReactDOM from 'react-dom';
import { createCache, createResource } from 'simple-cache-provider';

import Fallback from './Fallback';

function uploadContent(text) {
  return new Promise(resolve => setTimeout(resolve, 3000, text.toUpperCase()));
}

let uploadContentResource = createResource(uploadContent);

let rootElement = document.querySelector('main');

function UploadContentHandler({ value }) {
  let cache = createCache();
  return (
    <Fallback ms={0} placeholder={"Uploading..."}>
      <UploadContent cache={cache} value={value} />
    </Fallback>
  );
}

function UploadContent({ cache, value }) {
  let response = uploadContentResource.read(cache, value);
  return (
    <p>Uploaded: {response}</p>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isEditing: true, value: '' };
  }

  update(value) {
    this.setState({ value });
  }

  submit() {
    this.setState({ isEditing: false });
  }

  render() {
    return (
      <section>
        {this.state.isEditing ? (
          <div>
            <input
              type="text"
              value={this.state.value}
              onChange={event => this.update(event.target.value)}
            />
            <button onClick={() => this.submit()}>Submit</button>
          </div>
        ) : (
          <UploadContentHandler value={this.state.value} />
        )}
      </section>
    );
  }
}

let AsyncMode = React.unstable_AsyncMode;

ReactDOM.render(
  <AsyncMode>
    <App />
  </AsyncMode>,
  rootElement
);
