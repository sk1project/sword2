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


class wVSplitter extends HtmlElement {
    static defaultOptions = {
        leftTargetId: '',
        rightTargetId: '',
    }

    constructor(id, opt = {}) {
        super(id, {...wVSplitter.defaultOptions, ...opt});
        this.left_target = el(this.opt.leftTargetId);
        this.right_target = el(this.opt.rightTargetId);
        this.el.onmousedown = this.onMouseDown.bind(this);
        this.right_target.el.onresize = this.onParentMove.bind(this);
        this.start = 0;
        this.left_w = 0;
        this.right_w = 0;
    }

    onMouseDown(event) {
        this.start = event.clientX;
        this.left_w = this.left_target.el.offsetWidth;
        this.right_w = this.right_target.el.offsetWidth;
        this.document.onmousemove = this.onMouseMove.bind(this);
        this.document.onmouseup = this.onMouseUp.bind(this);
        event.stopPropagation();
    }

    onMouseMove(event) {
        let delta = event.clientX - this.start;
        this.left_target.el.style.width = `${this.left_w + delta}px`;
        this.right_target.el.style.width = `${this.right_w - delta}px`;
        this.window.getSelection().empty();
    }

    onMouseUp() {
        this.document.onmousemove = null;
        this.document.onmouseup = null;
        this.window.getSelection().empty()
    }

    onParentMove() {
        this.el.style.left = `${this.right_target.el.offsetLeft}px`;
    }

    update() {
        //Not implemented yet
    }

}


exports.wVSplitter = wVSplitter;