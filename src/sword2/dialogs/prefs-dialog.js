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


class PrefsDialog extends wDialog {
    static defaultOptions = {
        callback: null,
        icon: 'prefs',
        iconColor: 'selection-bg-color',
        msg: 'PREFERENCES',
        details: '',
    }

    constructor(app, config, opt = {}) {
        super(app, 'prefs-dialog', {...PrefsDialog.defaultOptions, ...opt});
        this.config = config;
    }

    build() {
        this.app.overlay.setHtml(
            require('../view/prefs-dlg.view.js').view(
                this.opt.msg, this.opt.icon, this.opt.iconColor));
    }
}

exports.PrefsDialog = PrefsDialog;