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

const os = require('os');
const fs = require('fs');
const path = require('path');


const HOME = os.homedir();


function formatFileSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['bytes', 'kb', 'Mb', 'Gb'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


function scanDir(dir = HOME) {
    dir = dir || HOME;
    dir = dir.startsWith('~') ? dir.replace('~', HOME) : dir;
    let dirs = path.dirname(dir) === dir ? [] : [['..', path.dirname(dir), '']];
    let files = [];
    fs.readdirSync(dir, 'utf-8').filter((name) => !name.startsWith('.')).map((name) => {
        const itemPath = path.join(dir, name),
            stats = function (itemPath) {
                try {
                    let fInfo = fs.statSync(itemPath);
                    return fInfo.isDirectory() ? false : formatFileSize(fInfo['size']);
                } catch (e) {
                    return false;
                }
            }(itemPath);
        stats ? files.push([name, itemPath, stats]) : dirs.push([name, itemPath, '']);
    });
    return dirs.concat(files);
}

exports.formatFileSize = formatFileSize;
exports.scanDir = scanDir
