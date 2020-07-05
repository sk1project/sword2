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

const {el} = require('../widgets/base.js');
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
        this.logviewer = el('prefs-log-viewer');
        this.backend = el('prefs-backend');
        this.appWidth = el('prefs-app-width');
        this.appHeight = el('prefs-app-height');
        this.maxwin = el('prefs-maxwin');
        this.logviewer.el.value = this.config.editor;
        this.backend.el.value = this.config.python;
        this.appWidth.el.value = this.config.winMinWidth;
        this.appHeight.el.value = this.config.winMinHeight;
        this.maxwin.el.checked = this.config.winMaximized;
    }

    saveConfig () {
        this.config.editor = this.logviewer.el.value;
        this.config.python = this.backend.el.value;
        this.config.winMinWidth = Number(this.appWidth.el.value);
        this.config.winMinHeight = Number(this.appHeight.el.value);
        this.config.winMaximized = this.maxwin.el.checked;
        this.config.winMaximized ? mainWindow.maximize(): mainWindow.unmaximize();
        this.close();
    }
}

exports.PrefsDialog = PrefsDialog;