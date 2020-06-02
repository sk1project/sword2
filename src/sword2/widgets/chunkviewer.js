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
        let nums = '';
        console.log(utils.countLines(chunk.chunkAscii));
        for (let i = 0; i < utils.countLines(chunk.chunkAscii); i++) {
            nums += `0000:` + ((i + 1) * 16).toString(16).padStart(4, '0') + '\n';
        }
        this.numColumn.setHtml(`<pre>${nums}</pre>` || '');
        this.hexColumn.setHtml(`<pre>${chunk.chunkHex}</pre>` || '');
        this.asciiColumn.setHtml(`<pre>${chunk.chunkAscii}</pre>` || '');
    }

    hexSelected(txt) {
        if(this.opt.selectCallback) this.opt.selectCallback(txt);
    }
}

class wChunkViewer extends HtmlElement {
    static defaultOptions = {
        selectCallback: null,
    }

    constructor(id, docId, opt = {}) {
        super(id, {...wChunkViewer.defaultOptions, ...opt});
        this.docId = docId;
        this.chunk = null;
        this.render()
        this.hexViewer = new wHexViewer(`hv-table-${this.docId}`, this.docId,
            {selectCallback: this.opt.selectCallback});
        this.hexViewer.display(true);
    }

    setChunk(chunk) {
        this.chunk = chunk;
        // TODO: switch viewer
        this.hexViewer.setChunk(this.chunk)
    }

    render() {
        this.setHtml(require('../view/chunk.view.js').view(this.docId));
    }
}

exports.wChunkViewer = wChunkViewer;