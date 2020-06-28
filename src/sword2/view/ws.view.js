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
        <td id="ws-td-tabs"><div id="ws-tabs-div"></div></td>
    </tr>
    <tr>
        <td id="ws-td-toolbar">
            <i id="ws-backward-button" class="sw sw-backward i24 button" title="Go to previous element"
               onclick="app.activeDoc.tree.goBack()"></i>
            <i id="ws-forward-button" class="sw sw-forward i24 button" title="Go to next element"
               onclick="app.activeDoc.tree.goForward()"></i>
            <i id="ws-home-button" class="sw sw-home i24 button" title="Go to tree root node"
                onclick="app.activeDoc.tree.selectRoot()"></i>
            <i id="ws-refresh-button" class="sw sw-refresh i24 button" title="Refresh tree view"
                onclick="app.activeDoc.tree.refresh()"></i>
            
            <div class="vline"></div>
            
            <i id="ws-collapse-button" class="sw sw-collapse i24 button" title="Collapse all nodes"
                onclick="app.activeDoc.tree.collapseAll()"></i>
            <i id="ws-expand-button" class="sw sw-expand i24 button" title="Expand all nodes"
                onclick="app.activeDoc.tree.expandAll()"></i>
            
            <div class="vline"></div>
            
            <i id="ws-switch-button" class="sw sw-switch i24 button" title="Change chunk view"
                onclick="app.activeDoc.chunkViewer.switchViewer()"></i>
            
            <div class="vline"></div>
            
            <i id="ws-close-button" class="sw sw-close-doc i24 button" title="Close current document" 
                onclick="app.closeActiveDoc()"></i>
            <i id="ws-close-button" class="sw sw-close-all i24 button" title="Close all documents" 
                onclick="app.closeAll()"></i>
        </td>
    </tr>
    <tr>
        <td id="doc-space"></td>
    </tr>
</table>
`;