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

exports.view = function (msg, icon='exclam', iconColor='midred') {
    return `
<div id="prefs-dialog">
    <div id="msg-dialog-icon"><i class="sw sw-${icon} ${iconColor} i32"></i></div>
    <div id="msg-dialog-body">        
        <b>${msg}</b><br>
        <table id="table-dlg-body">
            <tr>
                <td>Log viewer:</td>
                <td><input type="text" size="30" class="text-field"></td>
            </tr>
            <tr>
                <td>Backend:</td>
                <td>
                    <select id="backend" class="text-field" style="width:100%">
                      <option value="py2">Python 2</option>
                      <option value="py3">Python 3</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: center">
                    <b>Application window options</b>
                </td>
            </tr>
            <tr>
                <td>Width:</td>
                <td><input type="number" step="10" class="text-field" style="width: 100px"> px</td>
            </tr>
            <tr>
                <td>Height:</td>
                <td><input type="number" step="10" class="text-field" style="width: 100px"> px</td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <a id="big-endian-check" class="checkbutton" href="#">
                    <i id="big-endian-check-icon" class="sw-stack sw-unchecked before-border-color bg-color">q</i>
                    Maximize application window</a>
                </td>
            </tr>
        </table>
    </div>
    <table>
        <tr>
            <td style="width: 50%"><a class="dlg-button" onclick="app.dlg.close()">OK</a></td>
            <td style="width: 50%"><a class="dlg-button not-first" onclick="app.dlg.close()">Cancel</a></td>
        </tr>
    </table>
</div>
`
}
