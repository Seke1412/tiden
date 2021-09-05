import { all, fork, spawn, cancel, delay, race } from "redux-saga/effects.js"
import publish from "./lib/api/publish.js"
import cache from "./lib/api/cache.js"
import connect from "./lib/api/connect.js"
import linkTo from "./lib/api/linkTo.js"
import subscribe from "./lib/api/subscribe.js"
import merge from "./lib/api/merge.js"
import mutex from "./lib/api/mutex.js"
import once from "./lib/api/once.js"
import request from "./lib/api/request.js"
import respondTo from "./lib/api/respondTo.js"
import respondToSync from "./lib/api/respondToSync.js"
import simpleStream from "./lib/api/simpleStream.js"
import waitFor from "./lib/api/waitFor.js"
import whenChanged from "./lib/api/whenChanged.js"
import * as router from "./lib/api/routing.js"
import stream from "./lib/api/stream.js"
import render from "./lib/api/render.js"
import html from "./lib/api/html.js"
import s from "./lib/api/s.js"
import url from "./lib/url.js"
import component, {
  css,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "./lib/api/component.js"

function announce(...args) {
  console.warn(`'announce' has been deprecated, use 'publish' instead.`)
  return publish(...args)
}

function listenFor(...args) {
  console.warn(`'listenFor' has been deprecated, use 'subscribe' instead.`)
  return subscribe(...args)
}

export {
  /* API exports starts here */
  announce,
  publish,
  cache,
  connect,
  linkTo,
  subscribe,
  listenFor,
  merge,
  mutex,
  once,
  request,
  respondTo,
  respondToSync,
  simpleStream,
  waitFor,
  whenChanged,
  router,
  stream,
  all,
  fork,
  spawn,
  delay,
  race,
  render,
  cancel,
  s,
  url,
  /* component exports start here */
  component,
  html,
  css,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
}

import { applyMiddleware, createStore } from "redux"
import createSagaMiddleware from "redux-saga"

let sagaMiddleware
let store

export default function tiden(actor) {
  if (sagaMiddleware) {
    sagaMiddleware.run(actor)
    return {
      sagaMiddleware,
      store,
    }
  }

  const ret = {}

  sagaMiddleware = createSagaMiddleware({
    onError: (e, { sagaStack }) => {
      console.error(e)
      console.error(sagaStack)
    },
  })
  store = createStore((s) => s || {}, applyMiddleware(sagaMiddleware))
  sagaMiddleware.run(actor)

  window.request = (...args) => {
    sagaMiddleware.run(function* () {
      const response = yield request(...args)
      console.log(response)
    })
  }
  window.publish = (...args) => {
    sagaMiddleware.run(function* () {
      yield publish(...args)
    })
  }

  return {
    sagaMiddleware,
    store,
  }
}
