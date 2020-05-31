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

const {pTabs} = require('./tabs');
const {HtmlElement, el} = require('../widgets/base.js');
const events = require('../events.js');

class pWorkSpace extends HtmlElement {
    static defaultOptions = {}

    constructor(app, id, opt = {}) {
        super(id, {...pWorkSpace.defaultOptions, ...opt});
        this.app = app;
        this.tabs = new pTabs(this.app, 'ws-tabs-div');
        // this.left_splitter = new wVSplitter('left-splitter',
        //     {leftTargetId: 'ws-td-tree-header', rightTargetId: 'ws-td-hexview-header'});
        events.connect(events.DOC_CHANGED, this.update.bind(this));
    }

    update() {
        this.display(!!this.app.docs.length);
        for (let i = 0; i < this.app.docs.length; i++) {
            this.app.docs[i].display(this.app.docs[i] === this.app.activeDoc);
        }
    }
}

exports.pWorkSpace = pWorkSpace;