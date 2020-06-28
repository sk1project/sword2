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

const {exec, spawn} = require("child_process");
const path = require("path");

let UC2PATH = null;
let rpc = null;

class UC2RpcClient {
    proc = null;

    constructor(app) {
        this.app = app;
        this.path = __dirname;
        this.pyexec = path.join(__dirname, 'uc2-py2.py');
        this._init()
    }

    _init() {
        if (this.proc !== null) {
            this.proc.stdout.removeAllListeners('data');
            this.proc.kill();
        }
        this.callback = null;
        this.queue = [];
        this.buffer = '';
        this.proc = spawn('python2', [this.pyexec, UC2PATH]);
        this.proc.stdout.on('data', this._stdoutListener.bind(this));
    }

    _execute() {
        if (this.queue.length) {
            this._send(...this.queue.shift());
            console.log('command sent');
        }
    }

    _send(cmd = 'noop', args = [], callback = null) {
        this.buffer = cmd === 'next' ? this.buffer : '';
        this.callback = callback;
        console.log(JSON.stringify({command:cmd, args:args}));
        this.proc.stdin.write(JSON.stringify({command:cmd, args:args}) + '\n');
    }

    _isEol(txt) {
        return txt.substr(txt.length - 1) === '\n';
    }

    _stdoutListener(data) {
        this.buffer += data;
        console.log('got response', data);
        if (this._isEol(this.buffer)) {
            if (this.callback !== null) {
                let callback = this.callback;
                this.callback = null;
                let response = JSON.parse(this.buffer);
                if(!Array.isArray(response)) {
                    console.log(this.buffer);
                    this.app.showMsgDlg(response.error, response['error details']);
                } else {
                    callback(...response);
                    this._execute();
                }
            }
        } else if (this.callback !== null) {
            this._send('next', [], this.callback);
        }
    }

    call(cmd = 'noop', args = [], callback = null) {
        this.queue.push([cmd, args, callback]);
        if (this.callback === null) this._execute();
    }

    quit() {
        this.call('quit');
        this.proc.stdout.removeAllListeners('data');
        this.proc.kill();
    }
}


exports.init = function (app) {
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
        rpc = new UC2RpcClient(app);
    });
}

exports.convertHex = function (hexstring, bigEndian = false, callback=null) {
    rpc.call('convert', [hexstring, bigEndian], callback);
}

exports.load = function (filePath, callback=null) {
    rpc.call('load', [filePath], callback);
}

exports.chunk = function (docId, chunkId, callback=null) {
    rpc.call('chunk', [docId, chunkId], callback);
}

exports.close = function (docId, callback=null) {
    rpc.call('close', [docId], callback);
}

exports.quit = function () {
    rpc.quit();
}

exports.call = function (cmd = 'noop', args = [], calback = null) {
    rpc.call(cmd, args, calback);
}