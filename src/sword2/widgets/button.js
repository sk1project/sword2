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

const {HtmlElement, el} = require('./base.js');


class wButton extends HtmlElement {
    static defaultOptions = {
        callback: null,
        icon: 'quest',
        title: '',
        size: 24,
    }

    constructor(id, opt = {}) {
        super(id, {...wButton.defaultOptions, ...opt});
        this.setClassName();
        this.el.onclick = this.opt.callback;
        if(this.opt.title) this.el.setAttribute('title', this.opt.title);
    }

    setClassName(disabled = false) {
        this.el.className = `sw sw-${this.opt.icon} i${this.opt.size} button${disabled ? '-disabled' : ''}`;
    }

    disable() {
        this.setClassName(true);
        this.el.onclick = null;
    }

    enable() {
        this.setClassName();
        this.el.onclick = this.opt.callback;
    }

    setEnabled(state=true) {
        state ? this.enable() : this.disable();
    }
}

exports.wButton = wButton;