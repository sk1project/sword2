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

const {exec, execSync, spawn} = require("child_process");
const path = require("path");
const utils = require("../widgets/utils.js");

let UC2PATH = null;
let rpc = null;

class UC2RpcClient {
    constructor() {
        this.path = __dirname;
        this.pyexec = path.join(__dirname, 'uc2-zerorpc.py');
        this.proc = spawn('python2', [this.pyexec, UC2PATH]);
        this.proc.stdout.on('data', this._stdoutListener.bind(this))
        this.callback = null;
        this.queue = [];
        this.buffer = '';
    }

    _execute() {
        if (this.queue.length) {
            this._send(...this.queue.shift());
        }
    }

    _send(cmd = 'noop', args = {}, callback = null) {
        this.buffer = cmd === 'next' ? this.buffer : '';
        this.callback = callback;
        let chunk = `${cmd}${args !== {} ? ' ' + JSON.stringify(args) : ''}\n`;
        this.proc.stdin.write(chunk);
    }

    isEol(txt) {
        return txt.substr(txt.length - 1) === '\n';
    }

    _stdoutListener(data) {
        this.buffer += data;
        if (this.isEol(this.buffer)) {
            if (this.callback !== null) {
                let args = JSON.parse(this.buffer);
                let clbk = null;
                [clbk, this.callback] = [this.callback, clbk];
                clbk(...args);
                this._execute();
            }
        } else {
            this._send('next', {}, this.callback);
        }
    }

    call(cmd = 'noop', args = {}, callback = null) {
        this.queue.push([cmd, args, callback]);
        if (this.callback === null) this._execute();
    }

    quit() {
        this.call('quit');
    }
}


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
        rpc = new UC2RpcClient();
        console.log(rpc);
    });
}

exports.convertHex = function (hexstring, bigEndian=false) {
    bigEndian = bigEndian ? 'yes': 'no';
    return JSON.parse(execSync(path.join(__dirname, `convert.py ${bigEndian} ${hexstring}`)).toString('utf-8'));
}

exports.load = function (filePath) {
    rpc.call('test', {}, console.log);
    let minPath = filePath.startsWith(utils.HOME) ? filePath.replace(utils.HOME, '~'): filePath;
    return {...{'fileName': utils.fileName(filePath), 'filePath': minPath}, ...require('../data.js').model()};
}

exports.quit = function () {
    rpc.quit();
}

exports.call = function (cmd='noop', args={}, calback=null) {
    rpc.call(cmd, args, calback);
}