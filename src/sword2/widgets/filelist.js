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


const os = require('os');

const {HtmlElement, el} = require('./base.js');
const utils = require('./utils.js');

class wFileList extends HtmlElement {
    static defaultOptions = {
        currentDir: os.homedir(),
        openCallback: null,
        selectCallback: null,
        fileTypes: ['.svg'],
    }

    constructor(id, opt = {}) {
        super(id, {...wFileList.defaultOptions, ...opt});
        this.items = [];
        this.currentDir = this.opt.currentDir;
        this.selected = 0;
        this.render();
    }

    setPath(newPath = '~') {
        this.currentDir = newPath;
        this.refresh();
    }

    setSelection(index = 0) {
        el('fl-tr-' + this.selected).el.className = '';
        this.selected = index;
        el('fl-tr-' + this.selected).el.className = 'selected';
        let item = this.items[index]
        if (this.opt.selectCallback !== null)
            this.opt.selectCallback({path: item.path, isFile: Boolean(item.size)});
    }

    onDblClick(index) {
        let item = this.items[index]
        if (!item.size) this.setPath(item.path);
        if (this.opt.openCallback !== null)
            this.opt.openCallback({path: item.path, isFile: Boolean(item.size)});
    }

    refresh() {
        this.selected = 0;
        this.render()
    }

    isSupported(filePath) {
        return this.opt.fileTypes.includes(utils.fileExt(filePath).toLowerCase());
    }

    render() {
        this.items = utils.scanDir(this.currentDir);
        let html = '<div  class="div-scroll"><table id="fl-table">';
        for (let i = 0; i < this.items.length; i++) {
            let cls = 'folder orange';
            let szStyle = 'style="padding: 0;"';
            if (this.items[i].size) {
                cls = this.isSupported(this.items[i].path) ? 'file gray' : 'file-unsupported gray';
                szStyle = 'style="padding-right: 10px"'
            }
            let selected = i === this.selected ? 'class="selected"' : '';
            html += `<tr id="fl-tr-${i}" ${selected} onclick="app.fbPlugin.view.setSelection(${i})" ` +
                `ondblclick="app.fbPlugin.view.onDblClick(${i})">` +
                `<td class="icon"><i class="sw sw-${cls}"></i></td>` +
                `<td class="filename"><div>${this.items[i].name}</div></td>` +
                `<td class="filesize" ${szStyle}>${this.items[i].size || ''}</td></tr>`;
        }
        html += '</table></div/>';
        this.el.innerHTML = html;
    }
}

exports.wFileList = wFileList;
