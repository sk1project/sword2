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
const uc2 = require('../python/uc2.js');

const SELECTED = 'sw-stack sw-checked-inv before-selection-bg-color selection-fg-color';
const UNSELECTED = 'sw-stack sw-unchecked before-border-color bg-color';

class DataConvertPlugin extends HtmlElement {
    static defaultOptions = {
        display: 'table',
        fields: [
            {type:'char', icon:'byte', color:'midblue'},
            {type:'uchar', icon:'byte', color:'midblue'},
            {type:'short', icon:'word', color:'midgreen'},
            {type:'ushort', icon:'word', color:'midgreen'},
            {type:'Int', icon:'dword', color:'midred'},
            {type:'UInt', icon:'dword', color:'midred'},
            {type:'Long', icon:'dword', color:'midred'},
            {type:'Float', icon:'dword', color:'midred'},
            {type:'LongLong', icon:'qword', color:'midbrown'},
            {type:'ULongLong', icon:'qword', color:'midbrown'},
            {type:'Double', icon:'qword', color:'midbrown'}],
        bigEndian: false,
    }

    constructor(app, id = 'dc-table', opt = {}) {
        super(id, {...DataConvertPlugin.defaultOptions, ...opt});
        this.app = app;
        this.hexdict = null;
        this.hexstring = '';
        this.hexval = el('dc-span-hex');
        this.table = el('dc-values-table');
        this.check = el('big-endian-check');
        this.checkIcon = el('big-endian-check-icon');
        this.check.el.onclick = this.switchBigEndian.bind(this);
        this.convertHex();
    }

    switchBigEndian() {
        console.log('Event!')
        this.opt.bigEndian = !this.opt.bigEndian;
        this.checkIcon.el.className = this.opt.bigEndian ? SELECTED: UNSELECTED;
        this.convertHex(this.hexstring);
    }

    convertHex(hexstring='') {
        this.hexstring = hexstring;
        this.hexdict = uc2.convertHex(this.hexstring || '', this.opt.bigEndian);
        this.render();
    }

    render() {
        this.hexval.setHtml(this.hexdict.hex);
        let html = `<tr><th class="view-header">Type</th><th class="view-header">Value</th></tr>`;
        for(let i=0; i<this.opt.fields.length; i++) {
            let item = this.opt.fields[i];
            html += `<tr><td><i class="sw-stack sw-${item.icon} before-${item.color} white">q</i>`+
                `${item.type}</td><td>${this.hexdict[item.type]}</td></tr>`
        }
        this.table.setHtml(html);
    }
}

exports.DataConvertPlugin = DataConvertPlugin;