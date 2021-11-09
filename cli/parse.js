import minimist from "minimist"

import {
  init,
  upgrade,
  createStream,
  createPage,
  createNano,
  createComponent,
} from "../ops.js"
import ide from "../ide.js"

export default function run(...slice) {
  const parsed = minimist(slice, {
    alias: {
      d: `description`,
      p: `pathname`,
    },
  })

  const [verb, arg1, arg2, arg3] = parsed._
  const nargs = { ...parsed }
  delete nargs._

  switch (verb) {
    case `start`: {
      return [ide, {}]
      break
    }
    case `init`: {
      const name = arg1

      if (!name) {
        throw new Error(
          `Usage: init <name> [--description="some description"] [-d "some description"]`
        )
      }

      return [init, { name, description: nargs.description }]
    }
    case `upgrade`: {
      return [upgrade]
    }
    case `create`: {
      // Usage 1: tiden create stream myStream
      // Usage 2: tiden create stream ns/ns2/ns3/nsX myStream

      const noun = arg1
      const name = arg2
      const path = arg3

      if (!noun || !name) {
        throw new Error(
          `Usage: create <thing> <name> [path] (where thing can be 'stream', 'component', 'page' or 'nano')`
        )
      }
      const excludeChars = /[-_\s]/g;
      const haveExcludeChars = name.search(excludeChars) !== -1
      if (haveExcludeChars) {
        throw new Error(`[name] of creating page/stream/nano/component should be camelCase`)
      }

      return create(noun, name, path, parsed)
    }
    case `help`: {
      return showHelp()
    }
    default: {
      return showHelp()
    }
  }
}

function showHelp() {
  console.log(`Usage:
    init <name> [--description="some description"] [-d "some description"]
    upgrade
    start
    create stream <name> [path]
    create nano <name> [path]
    create page <name> [path] [--pathname="/custom/url"] [-pn "/custom/url"]
    create component <name> [path]
  `)
}

function create(noun, name, path, extras) {
  if (noun === `stream`) {
    return [createStream, { path, name }]
  } else if (noun === `page`) {
    return [createPage, { path, name, pathname: extras.pathname }]
  } else if (noun === `nano`) {
    return [createNano, { path, name }]
  } else if (noun === `component`) {
    return [createComponent, { path, name }]
  } else {
    throw new Error(
      `Bad noun '${noun}'. Available: 'stream', 'component', 'page' or 'nano'`
    )
  }
}
