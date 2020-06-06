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

const {HtmlElement} = require('./base.js');

class wBinViewer extends HtmlElement {
    static defaultOptions = {
        defaultValue: 'n/a',
    }

    constructor(id, opt={}) {
        super(id, {...wBinViewer.defaultOptions, ...opt});
        this.value = this.opt.defaultValue;
        this.render();
    }

    setValue(value='') {
        let subvalue = value.substr(0,8);
        let result = []
        let i = 0;
        while (i + 1 < subvalue.length) {
            result.push(parseInt(subvalue.substr(i, 2), 16).toString(2).padStart(8, '0'));
            i += 2;
        }
        let pad = value.length >8 ? '...': '';
        this.value = result.join('.') + pad || this.opt.defaultValue;
        this.render();
    }

    render() {
        this.setHtml(this.value);
    }
}

exports.wBinViewer = wBinViewer;