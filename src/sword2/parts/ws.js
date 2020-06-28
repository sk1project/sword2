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
const {HtmlElement} = require('../widgets/base.js');
const {wButton} = require('../widgets/button.js');
const events = require('../events.js');

class pWorkSpace extends HtmlElement {
    static defaultOptions = {}

    constructor(app, id, opt = {}) {
        super(id, {...pWorkSpace.defaultOptions, ...opt});
        this.app = app;
        this.tabs = new pTabs(this.app, 'ws-tabs-div');
        this.backBtn = new wButton('ws-backward-button', {icon: 'backward'});
        this.forwardBtn = new wButton('ws-forward-button', {icon: 'forward'});
        this.switchBtn = new wButton('ws-switch-button', {icon: 'switch'});
        events.connect(events.DOC_CHANGED, this.update.bind(this));
    }

    update() {
        this.display(!!this.app.docs.length);
        this.tabs.update();
        this.updateButtons();
        for (let i = 0; i < this.app.docs.length; i++) {
            this.app.docs[i].display(this.app.docs[i] === this.app.activeDoc);
        }
    }

    updateButtons() {
        if(this.app.activeDoc) {
            this.backBtn.setEnabled(this.app.activeDoc.tree.history.back.length);
            this.forwardBtn.setEnabled(this.app.activeDoc.tree.history.forward.length);
            this.switchBtn.setEnabled(this.app.activeDoc.model.binary);
        } else {
            this.backBtn.disable();
            this.forwardBtn.disable();
            this.switchBtn.disable();
        }
    }
}

exports.pWorkSpace = pWorkSpace;