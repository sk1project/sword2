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

const {initBase} = require('./widgets/base.js');
initBase(document, window, console);

const {config} = require('./config');
config.load();

const {HtmlElement, el} = require('./widgets/base.js');
const {wVSplitter} = require('./widgets/splitter.js');
const {wTree} = require('./widgets/tree.js');
const {FileBrowserPlugin} = require('./plugins/file-browser.js');
const data = require('./data.js');

let app = null;


class SWord2App extends HtmlElement {
    constructor(id = 'app') {
        super(id);
        this.tree = new wTree('ws-td-tree');
        this.tree.setModel(data.mdl);
        this.right_splitter = new wVSplitter('right-splitter',
            {leftTargetId: 'app-td-workspace', rightTargetId: 'app-td-plugin-area'});
        this.left_splitter = new wVSplitter('left-splitter',
            {leftTargetId: 'ws-td-tree-header', rightTargetId: 'ws-td-hexview-header'});
        this.fbPlugin = new FileBrowserPlugin(this, 'app-td-plugin-area');
    }

    display() {
        let win = nwgui.Window.get()
        win.maximize();
        win.setMinimumSize(config.winMinWidth, config.winMinHeight);
        win.on( 'close', function() {
            app.exit();
        } );
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

    open_doc(filePath) {
        alert(`Open: ${filePath}`);
    }

    exit() {
        config.save();
        nwgui.App.quit();
    }
}

function main() {
    app = new SWord2App();
    app.run();
}