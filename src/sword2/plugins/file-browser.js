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

const {HtmlElement, el} = require('../widgets/base.js');
const {wFileList} = require("../widgets/filelist.js");
const {isRoot, isHome, parentDir, deleteFile} = require("../widgets/utils.js");
const {wButton} = require("../widgets/button.js");
const {config} = require('../config.js');

class FileBrowserPlugin extends HtmlElement {
    constructor(app, id = 'fb-table') {
        super(id);
        this.app = app;
        this.backward = [];
        this.forward = [];
        this.selectedItem = null;
        this.currentDir = config.currentDir;
        this.build();
        this.updateCtrls();
    }

    build() {
        this.view = new wFileList('fb-td-view',
            {
                openCallback: this.open.bind(this),
                selectCallback: this.selected.bind(this),
                currentDir: config.currentDir,
                fileTypes: config.fileTypes,
            });
        this.backwardBtn = new wButton('fb-backward-button',
            {callback: this.goBack.bind(this), icon: 'backward', title: 'Go back'});
        this.forwardBtn = new wButton('fb-forward-button',
            {callback: this.goForward.bind(this), icon: 'forward', title: 'Go forward'});
        this.upBtn = new wButton('fb-up-button',
            {callback: this.goUp.bind(this), icon: 'up', title: 'Go to parent folder'});
        this.homeBtn = new wButton('fb-home-button',
            {callback: this.goHome.bind(this), icon: 'home', title: 'Go to home folder'});
        this.refreshBtn = new wButton('fb-refresh-button',
            {callback: this.refresh.bind(this), icon: 'refresh', title: 'Refresh view'});
        this.deletehBtn = new wButton('fb-delete-button',
            {callback: this.deleteSelected.bind(this), icon: 'delete', title: 'Delete selected file'});
        this.fbHeader = el('fb-td-view-header');
    }

    goBack() {
        let itemPath = this.backward.pop();
        this.view.setPath(itemPath);
        this.forward.push(this.currentDir);
        this.currentDir = itemPath;
        this.updateCtrls();
    }

    goForward() {
        let itemPath = this.forward.pop();
        this.view.setPath(itemPath);
        this.backward.push(this.currentDir);
        this.currentDir = itemPath;
        this.updateCtrls();
    }

    goUp() {
        this.view.setPath(parentDir(this.currentDir));
        this.open({path: parentDir(this.currentDir), isFile: false});
        this.updateCtrls();
    }

    goHome() {
        this.view.setPath(config.HOME);
        this.open({path: config.HOME, isFile: false});
        this.updateCtrls();
    }

    refresh() {
        this.view.refresh();
        this.selectedItem = null;
        this.updateCtrls();
    }

    deleteSelected() {
        try {
            deleteFile(this.selectedItem.path);
        } catch (e) {
            alert(`Cannot delete file:<br>${this.selectedItem.path}`);
        }
        this.refresh();
    }

    open(item) {
        if (!item.isFile) {
            this.backward.push(this.currentDir);
            this.currentDir = config.currentDir = item.path;
            this.forward = [];
        } else {
            this.app.openDoc(item.path);
        }
        this.updateCtrls();
    }

    selected(item) {
        this.selectedItem = item;
        this.updateCtrls();
    }

    updateCtrls() {
        let caption = this.currentDir.startsWith(config.HOME) ?
            this.currentDir.replace(config.HOME + '/', '~/'): this.currentDir;
        this.fbHeader.setHtml(`<div class="truncater">${caption}</div>`);
        this.deletehBtn.setEnabled(this.selectedItem ? this.selectedItem.isFile : false);
        this.homeBtn.setEnabled(!isHome(this.view.currentDir));
        this.upBtn.setEnabled(!isRoot(this.view.currentDir));
        this.backwardBtn.setEnabled(this.backward.length !== 0);
        this.forwardBtn.setEnabled(this.forward.length !== 0);
        this.refreshBtn.enable();
    }

    static render() {
        return require('../view/file-browser.view.js').view;
    }
}

exports.FileBrowserPlugin = FileBrowserPlugin;