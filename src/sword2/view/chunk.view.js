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
<div class="div-scroll">
    <table id="hv-table-${id}" class="hv-table">
        <tr>
            <td id="hv-td-nums-${id}" class="hv-td-nums"></td>
            <td id="hv-td-hex-${id}" class="hv-td-hex" 
            onmouseup="app.activeDoc.chunkViewer.hexViewer.hexSelected(getSelectedText())"></td>
            <td id="hv-td-ascii-${id}" class="hv-td-ascii"></td>
            <td></td>
        </tr>
    </table>
</div>
`;
}
