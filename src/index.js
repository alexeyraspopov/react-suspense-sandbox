import React from 'react';
import ReactDOM from 'react-dom';
import { createCache, createResource } from 'simple-cache-provider';

import Fallback from './Fallback';

function loadUpperCase(text) {
  return new Promise(resolve => setTimeout(resolve, 4000, text.toUpperCase()));
}

let cache = createCache();
let resource = createResource(loadUpperCase);

let rootElement = document.querySelector('main');
let asideElement = document.querySelector('aside');

function AsyncText({ text }) {
  let uppercased = resource.read(cache, text);
  return <p>{uppercased}</p>;
}

let loadingBar = ReactDOM.createPortal(
  <div className="loading-bar" />,
  asideElement
);

function GlobalFallback({ placeholder, children }) {
  let content = (
    <React.Fragment>
      {placeholder}
      {loadingBar}
    </React.Fragment>
  );
  return <Fallback ms={400} placeholder={content} children={children} />;
}

function LoadingText() {
  return (
    <p>
      <em>Let's just wait a bit, okay? I'm working on it...</em>
    </p>
  );
}

function App() {
  return (
    <section>
      <p>
        This page is going to render some text. Let's assume that it takes some
        time.
      </p>
      <GlobalFallback placeholder={<LoadingText />}>
        <AsyncText text="Lorem ipsum dolor sit amet" />
        <p>
          Also, this text should appear simultaneously with the first paragraph.
        </p>
      </GlobalFallback>
    </section>
  );
}

let AsyncMode = React.unstable_AsyncMode;

ReactDOM.render(
  <AsyncMode>
    <App />
  </AsyncMode>,
  rootElement
);
