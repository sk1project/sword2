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

exports.view = function (id) {
    return `
<table id="${id}" class="doc-view">
    <tr>
        <td id="ws-td-tree-header-${id}" class="view-header ws-td-tree-header"></td>
        <td id="ws-td-hexview-header-${id}" class="view-header hexview-header">
            <div id="left-splitter-${id}" class="splitter left-splitter"></div>
        </td>
    </tr>
    <tr>
        <td id="ws-td-tree-${id}" class="ws-td-tree" rowspan="2"></td>
        <td id="ws-td-hexview-${id}" class="ws-td-hexview"></td>
    </tr>
    <tr>
        <td id="ws-td-binview-${id}" class="ws-td-binview">
            Bin view: <span id="hv-bin-value-${id}" class="hv-bin-value">n/a</span>
        </td>
    </tr>
</table>   
`;
}