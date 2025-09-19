import React, { useReducer } from "react";

/**
 * A set that stores async components.
 */
const children = new Set();

/**
 * A map that stores unique keys and their corresponding async components.
 */
const overrideKeys = new Map();

/**
 * A map that stores areas and their corresponding forceUpdate functions.
 */
const areas = new Map();


/**
 * A counter for generating keys for async components that do not have unique keys.
 */
let i = 0;

/**
 * Makes the `AsyncComponents` matching the `area` to render the `Component` with the `props` properties plus a `resolve` prop.
 *
 * @param {React.ComponentType} Component - The component to be wrapped.
 * @param {Record<string, any>} props - The props to be passed to the wrapped component.
 * @params {string} props.uniqueKey - A unique key to identify the wrapped component, so only one component with the same unique key is rendered at the same time.
 * @param {string} [area] - The area in which the wrapped component will be rendered.
 * @param {timeout} [timeout] - The timeout duration for the wrapped component.
 *
 * @returns {ComponentPromise} A promise that resolves when the wrapped component calls its `resolve` prop
 */
export function asyncit(
  Component,
  props = {},
  area = "",
  timeout = null
) {

  let resolve;
  const promise = new Promise((res) => {
    resolve = res;
  });

  if (props.uniqueKey && overrideKeys.has(props.uniqueKey)) {
    return overrideKeys.get(props.uniqueKey);
  }

  function promiseResolver(value) {
    console.log('resolve');
    resolve(value);
    promise.isResolved = true;
    resolve = () => {
      console.warn("You can't call resolve on a resolved promise.");
    };
  }

  if (timeout) {
    setTimeout(promiseResolver, timeout);
  } else {
    promise.resolve = promiseResolver;
  }
  promise.props = props;
  promise.area = area;
  promise.Component = Component;
  promise.key = props.uniqueKey ?? i++;
  promise.isResolved = false;

  if (props.uniqueKey) {
    overrideKeys.set(props.uniqueKey, promise);
  }

  if (!promise.isResolved) {
    children.add(promise);
  }

  promise.finally(() => {
    children.delete(promise);
    if (props.uniqueKey) {
      overrideKeys.delete(props.uniqueKey);
    }
    setImmediate(() => {
      console.log('finally');
      areas.get(area)?.();
    });
  });
  setImmediate(() => {
    console.log('children');
    areas.get(area)?.();
  });
  return promise;
}

/**
 * A component that renders async components with matching `area` props.
 *
 * @param props - The props of the component.
 * @param {string} [props.area] - The area in which to render async components.
 *
 * @returns A React element that renders async components with matching `area` props.
 */
export function AsyncComponents({ area = "" }) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  areas.set(area, forceUpdate);

  return (
    <>
      {Array.from(children).map(
        (promise) =>
          area === promise.area && (
            <promise.Component
              key={promise.key}
              {...promise.props}
              resolve={promise.resolve}
            />
          )
      )}
    </>
  );
}