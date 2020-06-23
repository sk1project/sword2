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

DOC_CHANGED = [];
NODE_SELECTED = [];
HEX_SELECTED = [];

function connect(channel, callback) {
    channel.push(callback);
}

function emit(channel) {
    console.log('SIGNAL!');
    channel.forEach(function (callback) {
        setTimeout(callback);
    });
}

exports.DOC_CHANGED = DOC_CHANGED;
exports.NODE_SELECTED = NODE_SELECTED;
exports.HEX_SELECTED = HEX_SELECTED;
exports.connect = connect;
exports.emit = emit;
