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
const {wVSplitter} = require('../widgets/splitter.js');
const {wBinViewer} = require('../widgets/binviewer.js');
const {wChunkViewer} = require('../widgets/chunkviewer.js');
const {wTree} = require('../widgets/tree.js');
const uc2 = require('../python/uc2.js');
const events = require('../events.js');


class DocPresenter extends HtmlElement {
    static defaultOptions = {
        deferred: true,
        parent: 'doc-space',
        class_: 'doc-view',
        display: 'table',
    }

    constructor(app, filePath, opt = {}) {
        super(null, {...DocPresenter.defaultOptions, ...opt});
        this.app = app;
        this.initModel(filePath);
    }

    initModel(filePath, model=null) {
        if(model === null) {
            uc2.load(filePath, this.initModel.bind(this));
            return;
        }
        this.model = model;
        this.id = this.model.id;
        this.caption = this.model.fileName;
        this.render();
        this.setTreeCaption(this.model.name);
        this.leftSplitter = new wVSplitter(`left-splitter-${this.id}`,
            {leftTargetId: `ws-td-tree-header-${this.id}`, rightTargetId: `ws-td-chunkview-header-${this.id}`});
        this.binViewer = new wBinViewer(`hv-bin-value-${this.id}`);
        this.chunkViewer = new wChunkViewer(`ws-td-chunkview-${this.id}`, this.id,
            {selectCallback: this.hexSelected.bind(this), reportOnly: !this.model.binary});
        this.tree = new wTree(`ws-td-tree-${this.id}`,
            {callbackPrefix: 'app.activeDoc.tree', selectCallback: this.chunkSelected.bind(this)});
        this.tree.setModel(this.model);
        this.leftSplitter.update();

        this.app.activeDoc = this;
        this.app.docs.unshift(this);
        events.emit(events.DOC_CHANGED);
    }

    setTreeCaption(txt) {
        el(`ws-td-tree-header-${this.id}`).setHtml(txt);
    }

    render() {
        this.el = this.document.createElement('table');
        this.el.setAttribute('id', this.id);
        this.el.setAttribute('class', this.opt.class_);
        this.el.innerHTML = require('../view/doc.view').view(this.id);
        el(this.opt.parent).el.appendChild(this.el);
    }

    chunkSelected(chunk) {
        this.app.ws.updateButtons();
        uc2.chunk(this.id, chunk.id, this.chunkViewer.setChunk.bind(this.chunkViewer));
    }

    hexSelected(txt) {
        txt = txt.replace('\n','').replace(' ','').substr(0,16);
        this.binViewer.setValue(txt);
        this.app.dcPlugin.convertHex(txt);
    }
}

exports.DocPresenter = DocPresenter;