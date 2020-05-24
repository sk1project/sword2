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
const CONFIG_DIR = path.join(HOME, '.config', 'sword2');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// TODO: portable version

config = {
    current_path: HOME,

    save: function () {
        !fs.existsSync(CONFIG_DIR) ? fs.mkdirSync(CONFIG_DIR, {recursive: true}) : null;
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(this));
    },
    load: function () {
        if (!fs.existsSync(CONFIG_FILE)) {
            this.save();
        } else {
            Object.assign(this, JSON.parse(fs.readFileSync(CONFIG_FILE)));
        }
    }
};

exports.config = config;