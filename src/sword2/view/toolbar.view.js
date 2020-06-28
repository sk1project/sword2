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
<div id="toolbar-logo-expander">
    <i id="tb-files-button" title="File browser"></i>
    <i id="tb-convert-button" title="Data type converter"></i>
    <i id="tb-log-button" class="sw sw-log i32 app-toolbar-button" onclick="app.showLogs()"  title="UniConvertor logs"></i>
    <i id="tb-prefs-button" class="sw sw-prefs i32 app-toolbar-button" onclick="app.showMsgDlg('test')"  title="Preferences"></i>
    <i id="tb-exit-button" class="sw sw-exit i32 app-toolbar-button" onclick="app.exit()" title="Quit"></i>
</div>
<br>
<div>
    <div id="toolbar-logo">SWord 2.0</div>
</div>
`;