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

//Workaround for global nwjs object access
global.console = console;
global.mainDocument = document;
global.mainWindow = window;

const {config} = require('./config.js');
config.load();

const {HtmlElement, el} = require('./widgets/base.js');
const {wVSplitter} = require('./widgets/splitter.js');
const {pWorkSpace} = require('./parts/ws.js');
const {DocPresenter} = require('./parts/doc.js');
const {FileBrowserPlugin} = require('./plugins/file-browser.js');
const events = require('./events.js');
const uc2 = require('./python/uc2.js');

let app = null;

function getSelectedText() {
    let txt = '';
    if (window.getSelection) {
        txt = window.getSelection();
    } else if (document.getSelection) {
        txt = document.getSelection();
    } else if (document.selection) {
        txt = document.selection.createRange().text;
    }
    return txt.toString() || '';
}


class SWord2App extends HtmlElement {
    constructor(id = 'app') {
        super(id);
        this.mw = null;
        this.activeDoc = null;
        this.docs = [];

        this.render();
        this.ws = new pWorkSpace(this, 'ws-table', {display: 'table'});
        this.fbPlugin = new FileBrowserPlugin(this);
        this.pluginSplitter = new wVSplitter('plugin-splitter',
            {leftTargetId: 'app-td-workspace', rightTargetId: 'app-td-plugin-area'});
    }

    display() {
        this.mw = nwgui.Window.get();
        global.mainWindow = this.mw;

        this.mw.setMinimumSize(config.winMinWidth, config.winMinHeight);
        if (config.winMaximized) this.mw.maximize();
        this.mw.setPosition('center');
        this.mw.on('close', function () {
            app.exit();
        });
        this.mw.on('maximize', function () {
            config.winMaximized = true;
        });
        this.mw.on('restore', function () {
            config.winMaximized = false;
        });
        el('startup').display(false);
        super.display();
        this.pluginSplitter.update();
    }

    run() {
        setTimeout(this.display.bind(this), 100);
        uc2.init();
    }

    exit() {
        config.save();
        nwgui.App.quit();
    }

    getDocById(doc_id) {
        let index = 0;
        while (index < this.docs.length) {
            if (this.docs[index].id === doc_id) {
                return this.docs[index];
            }
            index++;
        }
        return null;
    }

    openDoc(filePath) {
        let doc = null;
        try {
            doc = new DocPresenter(this, filePath);
        } catch (e) {
            this.log(e);
            alert(`Error opening:\n${filePath}\n\n${e}\n\nAlso see log file.`);
            return;
        }
        this.activeDoc = doc;
        this.docs.unshift(doc);
        events.emit(events.DOC_CHANGED);
    }

    closeDoc(doc = null, docId = null) {
        if (doc === null && docId === null) return;
        doc === null ? doc = this.getDocById(docId) : null;
        let docIndex = this.docs.indexOf(doc);
        if (doc.id === this.activeDoc.id) {
            this.activeDoc = (docIndex === this.docs.length - 1) ? this.docs[docIndex - 1] : this.docs[docIndex + 1];
        }
        doc.id = 0;
        this.docs = [...this.docs.filter((doc) => !!doc.id)];
        doc.remove();
        events.emit(events.DOC_CHANGED);
    }

    closeActiveDoc() {
        this.closeDoc(this.activeDoc);
    }

    closeAll() {
        while (this.docs.length) {
            this.closeDoc(this.docs[0]);
        }
    }

    setActiveDoc(doc = null, docId = null) {
        if (doc === null && docId === null) return;
        doc === null ? doc = this.getDocById(docId) : null;
        if (doc && doc !== this.activeDoc) {
            this.activeDoc = doc;
            events.emit(events.DOC_CHANGED);
        }
    }

    render() {
        this.setHtml(require('./view/app.view.js').view);
        el('app-td-workspace').setHtml(require('./view/ws.view.js').view);
        el('app-td-toolbar').setHtml(require('./view/toolbar.view.js').view);
        el('app-td-plugin-area').setHtml(`<div id="plugin-splitter" class="splitter"></div>
            ${require('./view/file-browser.view.js').view}`);
    }
}

function main() {
    app = new SWord2App();
    app.run();
}