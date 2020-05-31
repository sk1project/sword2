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
const events = require('../events.js');

class pTabs extends HtmlElement {
    static defaultOptions = {}

    constructor(app, id, opt = {}) {
        super(id, {...pTabs.defaultOptions, ...opt});
        this.app = app;
        this.width = null;
        events.connect(events.DOC_CHANGED, this.update.bind(this));
        this.window.addEventListener("resize", this.update.bind(this));
    }

    update() {
        this.setHtml();
        let html = '';
        let maxSize = (this.getWidth() - 30) / this.app.docs.length - 35;
        for (let i = 0; i < this.app.docs.length; i++) {
            let doc = this.app.docs[i];
            let suffix = doc.id === this.app.activeDoc.id ? ' tab-selected' : '';
            html += `<a href="#" class="tab${suffix}" onclick="app.setActiveDoc(null, '${doc.id}')" ` +
                `style="max-width: ${maxSize}px">` +
                `<i class="sw sw-close tab-button" onclick="app.closeDoc(null, '${doc.id}')">` +
                `</i>${doc.caption}</a>`;
        }
        this.setHtml(html);
    }

    // getWidth() {
    //     this.width = this.width || super.getWidth();
    //     return this.width;
    // }
}

exports.pTabs = pTabs;