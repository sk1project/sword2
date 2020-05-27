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
 <table id="fb-table">
     <tr><td id="fb-table-header" class="plugin-header">File Browser</td></tr>
     <tr>
         <td id="fb-td-panel" class="plugin-panel">
             <i id="fb-backward-button"></i>
             <i id="fb-forward-button"></i>
             <i id="fb-up-button"></i>
             <div class="vline"></div>
             <i id="fb-home-button"></i>
             <i id="fb-refresh-button"></i>
             <div class="vline"></div>
             <i id="fb-delete-button"></i>
         </td>
     </tr>
     <tr><td id="fb-td-view-header"></td></tr>
     <tr><td id="fb-td-view"></td></tr>
 </table>
`;