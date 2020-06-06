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
 <table id="dc-table" class="plugin-table" style="display: none">
     <tr><td id="dc-table-header" class="plugin-header">Data Converter</td></tr>
     <tr><td id="dc-td-panel" class="plugin-panel">Hex: <span id="dc-span-hex"></span></td></tr>     
     <tr>
        <td id="dc-td-view">
            <table id="dc-values-table">                
            </table>
        </td>
     </tr>
     <tr>
        <td class="plugin-panel">
            <a id="big-endian-check" class="checkbutton" href="#"><i id="big-endian-check-icon" 
            class="sw-stack sw-unchecked before-border-color bg-color">q</i>Big Endian values</a>
        </td>
     </tr>
     <tr><td height="100%"></td></tr>
 </table>
`;