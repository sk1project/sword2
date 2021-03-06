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

const {wDialog} = require('../dialogs/dialog.js');


class msgDialog extends wDialog {
    static defaultOptions = {
        callback: null,
        icon: 'exclam',
        iconColor: 'midred',
        msg: '',
        details: '',
    }

    constructor(app, opt = {}) {
        super(app, 'msg-dialog', {...msgDialog.defaultOptions, ...opt});
    }

    build() {
        this.app.overlay.setHtml(
            require('../view/msg-dlg.view.js').view(
                this.opt.msg, this.opt.details, this.opt.icon, this.opt.iconColor));
    }
}

exports.msgDialog = msgDialog;