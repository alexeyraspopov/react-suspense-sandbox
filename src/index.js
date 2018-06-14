import React from 'react';
import ReactDOM from 'react-dom';
import { createCache, createResource } from 'simple-cache-provider';

import Fallback from './Fallback';

function loadUpperCase(text) {
  let delay = Math.random() * 3000 + 10;
  return new Promise(resolve => setTimeout(resolve, delay, text.toUpperCase()));
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

function Content() {
  return (
    <GlobalFallback placeholder={<LoadingText />}>
      <AsyncText text="Lorem ipsum dolor sit amet" />
    </GlobalFallback>
  );
}

function App() {
  return (
    <section>
      <p>
        This page is going to render some text. Let's assume that it takes some
        time.
      </p>
      <Content />
      <p>Also, here is some other synchronous content on the page.</p>
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
