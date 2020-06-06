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

const {HtmlElement} = require('./base.js');


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
        this.opt.callback ? this.el.onclick = this.opt.callback : this.opt.callback = this.el.onclick;
        if (this.opt.title) this.el.setAttribute('title', this.opt.title);
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

    setEnabled(state = true) {
        state ? this.enable() : this.disable();
    }
}


class wToggleButton extends HtmlElement {
    static defaultOptions = {
        callback: null,
        onpressCallback: null,
        icon: 'quest',
        title: '',
        size: 24,
        state: true,
        pressed: false,
        class_: 'toggle-button',
        retval: true,
    }

    constructor(id, opt = {}) {
        super(id, {...wToggleButton.defaultOptions, ...opt});
        this.setClassName(this.opt.state, this.opt.pressed);
        this.el.onmousedown = this.onpress.bind(this);
        if (this.opt.title) this.el.setAttribute('title', this.opt.title);
    }

    setClassName(enabled = true, pressed = false) {
        this.el.className = `sw sw-${this.opt.icon} i${this.opt.size} ` +
            `${this.opt.class_}${enabled ? '' : '-disabled'}${pressed ? '-pressed' : ''}`;
    }

    onpress() {
        if (!this.opt.state) return;
        if (this.opt.onpressCallback && this.opt.pressed) return;
        this.setPressed(!this.opt.pressed);
        if (this.opt.onpressCallback) this.opt.onpressCallback(this);
        if(this.opt.callback) this.opt.callback(this.opt.retval);
    }

    disable() {
        this.opt.state = false;
        this.setClassName(false);
    }

    enable() {
        this.opt.state = true;
        this.setClassName();
    }

    setEnabled(state = true) {
        state ? this.enable() : this.disable();
    }

    setPressed(state=true) {
        this.opt.pressed = state;
        this.setClassName(this.opt.state, this.opt.pressed);
    }
}

class wToggleGroup {
    constructor() {
        this.btns = [];
    }

    add(btn) {
        btn.opt.onpressCallback = this.pressed.bind(this);
        this.btns.push(btn);
    }

    pressed(btn) {
        for(let i =0; i<this.btns.length; i++) {
            if(this.btns[i] !== btn) this.btns[i].setPressed(false);
        }
    }
}

exports.wButton = wButton;
exports.wToggleButton = wToggleButton;
exports.wToggleGroup = wToggleGroup;