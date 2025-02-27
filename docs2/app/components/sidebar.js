import { component, html } from "tiden"
import "./touchable.js"
import css from "./sidebar/css.js"
import { classMap } from "lit-html/directives/class-map.js"

component(`x-sidebar`, { css }, function sidebar({ methods }) {
  if (!methods) {
    return null
  }
  return html`
    <menu>
      ${methods.map(
        ({ name, selectMethod, isSelected, link }) => html` <li>
          <x-touchable .link=${link}>
            <span class="${classMap({ selected: isSelected })}"> ${name} </span>
          </x-touchable>
        </li>`
      )}
    </menu>
  `
})
