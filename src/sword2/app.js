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

const nwgui = require('nw.gui');
const path = require('path');

const {HtmlElement, el} = require('widgets/base.js');
const {VSplitter} = require('widgets/splitter.js');
const {Tree} = require('widgets/tree.js');
const fsutils = require('utils/fsutils.js');

const {config} = require('./config');
const data = require('./data.js');

require('widgets/base.js').init(document, window, console);
config.load();
let app = null;


class SWFileTable extends HtmlElement {
    constructor(id = 'fb-td-view') {
        super(id);
        this.view = el('fb-td-view');
        this.items = [];
        this.backward = [];
        this.forward = [];
        this.current_dir=config.current_path;
        this.selected = 0;
        this.render();
    }

    setPath(new_path='~') {
        this.current_dir = new_path;
        this.refresh();
    }

    goUp() {
        this.setPath(path.dirname(this.current_dir));
    }

    setSelection(index = 0) {
        el('fl-tr-' + this.selected).el.className='';
        this.selected = index;
        el('fl-tr-' + this.selected).el.className='selected';
    }

    onDblClick(index) {
        if(!this.items[index][2]) {
            this.setPath(this.items[index][1]);
        } else {
            alert('Open: ' + this.items[index][1])
        }
    }

    refresh() {
        this.selected = 0;
        this.render()
    }

    render() {
        this.items = fsutils.scanDir(this.current_dir);
        let html = '<div  class="div-scroll"><table id="fl-table">';
        for (let i = 0; i < this.items.length; i++) {
            let cls ='folder orange';
            let szStyle = 'style="padding: 0;"';
            if (this.items[i][2]) {
                cls = 'file gray';
                szStyle = 'style="padding-right: 10px"'
            }
            let selected = i === this.selected ? 'class="selected"' : '';
            html += `<tr id="fl-tr-${i}" ${selected} onclick="app.fileList.setSelection(${i})" `+
                `ondblclick="app.fileList.onDblClick(${i})">` +
                `<td><i class="sw sw-${cls}"></i></td>` +
                `<td class="filename">${this.items[i][0]}</td>` +
                `<td class="filesize" ${szStyle}>${this.items[i][2]}</td></tr>`;
        }
        html += '</table></div/>';
        this.el.innerHTML = html;
    }
}


class FileBrowserPlugin extends HtmlElement   {
    constructor(parentId='',id = 'fb-td-view') {
        super(id);
    }
}


class SWord2App extends HtmlElement {
    constructor(id = 'app') {
        super(id);
        this.tree = new Tree('ws-td-tree');
        this.tree.setModel(data.mdl);
        this.right_splitter = new VSplitter('right-splitter',
            {leftTargetId: 'app-td-workspace', rightTargetId: 'app-td-plugin-area'});
        this.left_splitter = new VSplitter('left-splitter',
            {leftTargetId: 'ws-td-tree-header', rightTargetId: 'ws-td-hexview-header'});
        this.fileList = new SWFileTable();
    }

    display() {
        el('startup').display(false);
        super.display();
    }

    run() {
        setTimeout(this.display.bind(this), 100);
    }

    reload() {
        nwgui.App.clearCache();
        location.reload();
    }

    exit() {
        config.save();
        nwgui.App.quit();
    }
}

function main() {
    nwgui.Window.get().maximize();
    app = new SWord2App();
    app.run();
}