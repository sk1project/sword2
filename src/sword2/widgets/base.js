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


class OptObject {
    static defaultOptions = {}

    constructor(opt = {}) {
        this.opt = {...OptObject.defaultOptions, ...opt};
    }
}

class HtmlElement extends OptObject {
    static defaultOptions = {
        deferred: false,
        display: 'block',
    }

    constructor(id, opt = {}) {
        super({...HtmlElement.defaultOptions, ...opt});
        this.log = console.log;
        this.document = mainDocument;
        this.mw = mainWindow;
        this.id = id;
        if(!this.opt.deferred) this.el = this.document.getElementById(this.id);
    }

    display(state = true) {
        this.el.style.display = state ? this.opt.display : 'none';
    }

    switchDisplay() {
        this.display(this.el.style.display === 'none');
    }

    isDisplayed() {
        return this.el.style.display !== 'none';
    }

    setHtml(html = '') {
        this.el.innerHTML = html;
    }

    addHtml(html = '') {
        this.el.innerHTML += html;
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

    getWidth() {
        return this.el.offsetWidth;
    }

    getHeight() {
        return this.el.offsetHeight;
    }

    remove() {
        this.el.remove();
    }

    update() {
        //Stub for later implementation
    }
}

const el = (id, opt = {}) => mainDocument.getElementById(id) ? new HtmlElement(id, opt) : null;

class Component extends HtmlElement {
    static defaultOptions = {}

    constructor(id, opt = {}) {
        super(id, {...Component.defaultOptions, ...opt});
    }
}


exports.el = el;
exports.HtmlElement = HtmlElement;
