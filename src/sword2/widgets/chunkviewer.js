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

const {HtmlElement, el} = require('./base.js');
const utils = require('./utils.js');

const HEXHEADER = '<pre class="hv-header">0.1.2.3. 4.5.6.7. 8.9.a.b. c.d.e.f.</pre>';
const REPORTHEADER = '<pre>&nbsp;&nbsp;INTROSPECTION</pre>'

class wHexViewer extends HtmlElement {
    static defaultOptions = {
        selectCallback: null,
        display: 'table',
    }

    constructor(id, docId, opt = {}) {
        super(id, {...wHexViewer.defaultOptions, ...opt});
        this.docId = docId;
        this.numColumn = el(`hv-td-nums-${this.docId}`);
        this.hexColumn = el(`hv-td-hex-${this.docId}`);
        this.asciiColumn = el(`hv-td-ascii-${this.docId}`);
    }

    setChunk(chunk) {
        this.numColumn.setHtml(`<pre>${chunk.chunkNums}</pre>` || '');
        this.hexColumn.setHtml(`<pre>${chunk.chunkHex}</pre>` || '');
        this.asciiColumn.setHtml(`<pre>${chunk.chunkAscii}</pre>` || '');
    }

    hexSelected(txt) {
        if(this.opt.selectCallback) this.opt.selectCallback(txt);
    }
}

class wReportViewer extends HtmlElement {
    static defaultOptions = {
    }

    constructor(id, docId, opt = {}) {
        super(id, {...wReportViewer.defaultOptions, ...opt});
        this.docId = docId;
    }

    setChunk(chunk) {
        this.setHtml(chunk.report || '');
    }
}

class wChunkViewer extends HtmlElement {
    static defaultOptions = {
        selectCallback: null,
        reportOnly: false,
    }

    constructor(id, docId, opt = {}) {
        super(id, {...wChunkViewer.defaultOptions, ...opt});
        this.docId = docId;
        this.chunk = null;
        this.hexview = !this.opt.reportOnly;
        this.render();
        this.header = el(`chunkview-header-${this.docId}`);
        this.hexViewer = new wHexViewer(`hv-table-${this.docId}`, this.docId,
            {selectCallback: this.opt.selectCallback});
        this.reportViewer = new wReportViewer(`chunk-report-${this.docId}`, this.docId);
        this._switch();
    }

    _switch() {
        this.header.setHtml(this.hexview ?  HEXHEADER : REPORTHEADER);
        this.hexViewer.display(this.hexview);
        this.reportViewer.display(!this.hexview);
    }

    setChunk(chunk) {
        this.chunk = chunk;
        this.hexViewer.setChunk(this.chunk);
        this.reportViewer.setChunk(this.chunk);
    }

    switchViewer() {
        if (!this.opt.reportOnly) {
            this.hexview = !this.hexview;
            this._switch();
        }
    }

    render() {
        this.setHtml(require('../view/chunk.view.js').view(this.docId));
    }
}

exports.wChunkViewer = wChunkViewer;