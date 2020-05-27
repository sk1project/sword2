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

exports.view = `
<table id="ws-table">
    <tr>
        <td id="ws-td-tabs" colspan="2">

            <div id="ws-tabs-div">
                <a href="#" class="tab"><i class="sw sw-close tab-button"></i>Wuniras.cgm</a><a href="#" class="tab tab-selected"><i class="sw sw-close tab-button"></i>Large circles.cgm</a><a href="#" class="tab"><i class="sw sw-close tab-button"></i>uniras.cgm</a>
            </div>


        </td>
    </tr>
    <tr>
        <td id="ws-td-toolbar" colspan="2">

            <i id="ws-backward-button" class="sw sw-backward i24 button"></i>
            <i id="ws-forward-button" class="sw sw-forward i24 button"></i>
            <i id="ws-home-button" class="sw sw-home i24 button" onclick="app.tree.selectRoot()"></i>
            <i id="ws-refresh-button" class="sw sw-refresh i24 button" onclick="app.tree.refresh()"></i>
            <div class="vline"></div>
            <i id="ws-collapse-button" class="sw sw-collapse i24 button" onclick="app.tree.collapseAll()"></i>
            <i id="ws-expand-button" class="sw sw-expand i24 button" onclick="app.tree.expandAll()"></i>
            <div class="vline"></div>
            <i id="ws-switch-button" class="sw sw-switch i24 button"></i>
            <div class="vline"></div>
            <i id="ws-close-button" class="sw sw-close-doc i24 button" onclick="app.closeActiveDoc()"></i>

        </td>
    </tr>
    <tr>
        <td id="ws-td-tree-header"></td>
        <td id="ws-td-hexview-header"><div id="left-splitter"></div></td>
    </tr>
    <tr>
        <td id="ws-td-tree" rowspan="2"></td>
        <td id="ws-td-hexview"></td>
    </tr>
    <tr>
        <td id="ws-td-binview">Bin view: <span id="hv-bin-value">n/a</span></td>
    </tr>
</table>
`;