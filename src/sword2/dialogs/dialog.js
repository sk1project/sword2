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

const {HtmlElement} = require('../widgets/base.js');


class wDialog extends HtmlElement {
    static defaultOptions = {
        callback: null,
        icon: 'quest',
        title: '',
    }

    constructor(app, id='dialog', opt = {}) {
        super(id, {...wDialog.defaultOptions, ...opt});
        this.app = app;
    }

    run() {
        this.app.overlay.display(true);
        this.app.el.style.filter = "blur(3px)";
        this.build();
    }

    build() {
        // The method should be overridden in subclass
    }

    close() {
        this.app.dlg = null;
        this.app.el.style.filter = "blur(0)";
        this.app.overlay.display(false);
        this.app.overlay.setHtml();
    }
}

exports.wDialog = wDialog;