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

const {exec, execSync} = require("child_process");
const path = require("path");
const utils = require("../widgets/utils.js");

let UC2PATH = null;

exports.init = function () {
    exec("uc2 --package-dir", (error, stdout, stderr) => {
        if (error) {
            console.log(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`Stderr: ${stderr}`);
            return;
        }
        UC2PATH = stdout;
    });
}

exports.convertHex = function (hexstring, bigEndian=false) {
    bigEndian = bigEndian ? 'yes': 'no';
    console.log(execSync(path.join(__dirname, `convert.py ${bigEndian} ${hexstring}`)).toString('utf-8'));
}

exports.load = function (filePath) {
    return {...{'fileName': utils.fileName(filePath)}, ...require('../data.js').model()};
}