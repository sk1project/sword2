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

exports.view = function (msg, details='', icon='exclam', iconColor='midred') {
    return `
<div id="msg-dialog">
    <div id="msg-dialog-icon"><i class="sw-stack sw-${icon} before-${iconColor} white i48">q</i> </div>
    <div id="msg-dialog-body">        
        <b>${msg}</b><br><br>
        ${details}
    </div>
    <a class="dlg-button" onclick="app.hideOverlay()">OK</a> 
</div>
`
}
