import React from 'react';
import ReactDOM from 'react-dom';
import { createCache, createResource } from 'simple-cache-provider';

import Fallback from './Fallback';

class Deferred {
  constructor() {
    this.resolver = null;
    this.promise = new Promise(r => {
      this.resolver = r;
    });
  }

  resolve(v) {
    return this.resolver && this.resolver(v);
  }
}

let rootElement = document.querySelector('main');

function openDialog(node) {
  return node && node.showModal();
}

function Confirm({ onConfirm }) {
  let valueRef = React.createRef();
  return (
    <dialog ref={openDialog}>
      <input type="text" ref={valueRef} />
      <button onClick={() => onConfirm(valueRef.current.value)}>Confirm</button>
    </dialog>
  );
}

function request(k) {
  return 'Hello' + k;
}

function AsyncActionWithConfirmation() {
  let s = new Deferred();

  let resource = createResource((k) => s.promise.then(v => request(k + v)));
  let cache = createCache();

  return (
    <Fallback ms={0} placeholder={<Confirm onConfirm={(v) => s.resolve(v)} />}>
      <Content resource={resource} cache={cache} />
    </Fallback>
  );
}

function Content({ resource, cache }) {
  let response = resource.read(cache, 't');
  return <p>{response}</p>;
}

function App() {
  return (
    <section>
      <AsyncActionWithConfirmation />
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
