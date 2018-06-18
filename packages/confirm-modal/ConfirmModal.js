import React from 'react';
import ReactDOM from 'react-dom';

import Fallback from './Fallback';
import Deferred from './Deferred';
import createFetcher from './createFetcher';

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

  let fetcher = createFetcher(async (k) => {
    let v = await s.promise;
    return request(k + v);
  });

  let confirm = <Confirm onConfirm={(v) => s.resolve(v)} />;

  return (
    <Fallback ms={0} placeholder={confirm}>
      <Content fetcher={fetcher} />
    </Fallback>
  );
}

function Content({ fetcher }) {
  let response = fetcher.read('t');
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
