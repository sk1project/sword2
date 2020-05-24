/**
 * @preserve Copyright 2020 by Ihor E. Novikov.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License
 * as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
const {OptObject} = require('../base');

let document = null;
let window = null;
let console = null;

function init(doc, win, con) {
    document = doc;
    window = win;
    console = con;
}

class HtmlElement extends OptObject {
    static defaultOptions = {
        display: 'block',
    }
    constructor(id, opt={}) {
        super(opt= {...HtmlElement.defaultOptions, ...opt});
        this.console = console;
        this.document = document;
        this.window = window;
        this.id = id;
        this.el = this.document.getElementById(id);
    }

    display(val = true) {
        this.el.style.display = val ? this.opt.display : 'none';
    }

    switchDisplay() {
        this.display(this.el.style.display === 'none');
    }

    setHtml(html = '') {
        this.el.innerHTML = html;
    }

    setBgColor(color = '#fff') {
        this.el.style.background = color;
    }

    setFgColor(color = '#000') {
        this.el.style.color = color;
    }

    addClass(cls, prefix = ' ') {
        this.el.className += `${prefix}${cls}`;
    }

    removeClass(cls, prefix = ' ') {
        this.el.className = this.el.className.replace(`${prefix}${cls}`, '');
    }
}

const el = (id) => document.getElementById(id) ? new HtmlElement(id): null;

class Component extends HtmlElement  {
    static defaultOptions = {}

    constructor(id, opt={}) {
        super(id, opt= {...Component.defaultOptions, ...opt});
    }
}

exports.init = init;
exports.el = el;
exports.HtmlElement = HtmlElement;
