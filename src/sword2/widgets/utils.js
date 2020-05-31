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

const newId = () => (~~(Math.random() * 1e8)).toString(16);

function formatFileSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['bytes', 'kb', 'Mb', 'Gb'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function parentDir(dir) {
    return path.dirname(dir);
}

function isRoot(dir) {
    return parentDir(dir) === dir;
}

function isHome(dir) {
    return dir === HOME;
}

function isParentHome(dir) {
    return isHome(parentDir(dir));
}

function deleteFile(filePath) {
    fs.unlinkSync(filePath);
}

function fileExt(filePath) {
    return path.extname(filePath);
}

function readFile(filePath) {
    return fs.readFileSync(filePath).toString('utf-8');
}

function expandUser(filePath) {
    return filePath.startsWith('~') ? filePath.replace('~', HOME) : filePath;
}

function fileName(filePath) {
    return path.basename(filePath);
}


function scanDir(dir = HOME) {
    dir = expandUser(dir || HOME);
    let dirs = isRoot(dir) ? [] : [{name:'..', path:path.dirname(dir), size: null}];
    let files = [];
    fs.readdirSync(dir, 'utf-8').filter((name) => !name.startsWith('.')).map((name) => {
        const itemPath = path.join(dir, name),
            stats = function (itemPath) {
                try {
                    let fInfo = fs.statSync(itemPath);
                    return fInfo.isDirectory() ? null : formatFileSize(fInfo['size']);
                } catch (e) {
                    return null;
                }
            }(itemPath);
        let info = {name:name, path:itemPath, size: stats};
        stats ? files.push(info) : dirs.push(info);
    });
    return dirs.concat(files);
}

exports.newId = newId;
exports.formatFileSize = formatFileSize;
exports.parentDir = parentDir;
exports.isRoot = isRoot;
exports.isHome = isHome;
exports.isParentHome = isParentHome;
exports.deleteFile = deleteFile;
exports.fileExt = fileExt;
exports.readFile = readFile;
exports.expandUser = expandUser;
exports.fileName = fileName;
exports.scanDir = scanDir;
