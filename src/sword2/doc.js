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

const {HtmlElement, el} = require('./widgets/base.js');
const {wVSplitter} = require('./widgets/splitter.js');
const {wTree} = require('./widgets/tree.js');
const uc2 = require('./uc2.js');

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
        this.model = uc2.load(filePath);
        this.id = this.model.id;
        this.caption = this.model.fileName;
        this.render();
        this.setTreeCaption(this.model.name);
        this.left_splitter = new wVSplitter(`left-splitter-${this.id}`,
            {leftTargetId: `ws-td-tree-header-${this.id}`, rightTargetId: `ws-td-hexview-header-${this.id}`});
        this.tree = new wTree(`ws-td-tree-${this.id}`, {callbackPrefix: 'app.activeDoc.tree'});
        this.tree.setModel(this.model);
    }

    setTreeCaption(txt) {
        el(`ws-td-tree-header-${this.id}`).setHtml(txt);
    }

    render() {
        this.el = this.document.createElement('table');
        this.el.setAttribute('id', this.id);
        this.el.setAttribute('class', this.opt.class_);
        this.el.innerHTML = require('./view/doc.view').view(this.id);
        el(this.opt.parent).el.appendChild(this.el);
    }
}

exports.DocPresenter = DocPresenter;