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
const uc2 = require('./uc2.js');

let app = null;
let appView = `
    <table id="app-table">
        <tr>
            <td id="app-td-toolbar"></td>
            <td id="app-td-workspace"></td>
            <td id="app-td-plugin-area"></td>
        </tr>
    </table>
`;


class SWord2App extends HtmlElement {
    constructor(id = 'app') {
        super(id);
        this.activeDocIndex = null;
        this.docs = [];

        this.render();
        this.ws = el('ws-table',{display: 'table'});
        this.tree = new wTree('ws-td-tree');
        // this.tree.setModel(data.mdl);
        this.fbPlugin = new FileBrowserPlugin(this);
        this.log(this.ws.opt);
    }

    display() {
        let win = nwgui.Window.get()
        win.maximize();
        win.setMinimumSize(config.winMinWidth, config.winMinHeight);
        win.on('close', function () {
            app.exit();
        });
        el('startup').display(false);
        super.display();
        this.right_splitter = new wVSplitter('right-splitter',
            {leftTargetId: 'app-td-workspace', rightTargetId: 'app-td-plugin-area'});
        this.left_splitter = new wVSplitter('left-splitter',
            {leftTargetId: 'ws-td-tree-header', rightTargetId: 'ws-td-hexview-header'});
    }

    run() {
        setTimeout(this.display.bind(this), 100);
    }

    reload() {
        nwgui.App.clearCache();
        location.reload();
    }

    openDoc(filePath) {
        let doc = null;
        try {
            doc = uc2.load(filePath);
        } catch (e) {
            alert(`Error opening: ${filePath}\nSee log file.`);
            return;
        }

        this.activeDocIndex = this.docs.length;
        this.docs.push(doc);
        this.log(this.docs, this.docs[0]);
        this.ws.display(this.docs.length > 0);
        this.tree.setModel(doc);
    }

    close(index=0){
        this.log(`closing ${index}`);
        if(this.docs.length===0 || index >= this.docs.length) return;
        let activate = (index===this.activeDocIndex && this.docs.length > 1);

        if (index<this.activeDocIndex) {
            this.activeDocIndex -=1;
        } else if(index===this.activeDocIndex && index===this.docs.length-1) {
            this.activeDocIndex -=1;
        }

        delete this.docs[index];
        this.ws.display(this.docs.length > 0);

        activate ? this.setActiveDoc(this.activeDocIndex): null;
    }

    closeActiveDoc() {
        this.close(this.activeDocIndex);
    }

    setActiveDoc(index=0) {
        if(this.docs.length===0 || index >= this.docs.length) return;

    }

    exit() {
        config.save();
        nwgui.App.quit();
    }

    render() {
        this.setHtml(appView);
        el('app-td-workspace').setHtml(require('./view/ws.view.js').view);
        el('app-td-toolbar').setHtml(require('./view/toolbar.view.js').view);
        el('ws-td-hexview').setHtml(require('./view/hex.view.js').view);
        el('app-td-plugin-area').setHtml(`<div id="right-splitter" class="splitter"></div>
            ${require('./view/file-browser.view.js').view}`);
    }
}

function main() {
    app = new SWord2App();
    app.run();
}