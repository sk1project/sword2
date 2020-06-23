#
#   ZeroRPC server for SWord 2.x (Python 2)
#
# 	Copyright (C) 2020 by Ihor E. Novikov
#
# 	This program is free software: you can redistribute it and/or modify
# 	it under the terms of the GNU General Public License as published by
# 	the Free Software Foundation, either version 3 of the License, or
# 	(at your option) any later version.
#
# 	This program is distributed in the hope that it will be useful,
# 	but WITHOUT ANY WARRANTY; without even the implied warranty of
# 	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# 	GNU General Public License for more details.
#
# 	You should have received a copy of the GNU General Public License
# 	along with this program.  If not, see <https://www.gnu.org/licenses/>.

"""
RPC accepts JSON dict like:
{
    'command': 'quit',
    'args': [],
}

Returns JSON list:
[arg0, arg1...]
"""
import json
import logging
import os
import sys

UC2PATH = sys.argv[1].strip()
sys.path.insert(0, UC2PATH)
config = json.load(open(os.path.expanduser('~/.config/sword2/config.json'), 'r'))

import rpc_py2

logging.basicConfig(
    format='%(asctime)s | %(levelname)-7s | %(name)s | %(message)s',
    level=logging.DEBUG,
    filename=os.path.expanduser('~/.config/sword2/py2log.log'),
    filemode='w',
    stream=sys.stderr, )
LOG = logging.getLogger(__name__)

LOG.info('Python 2 bridge started')

MAXLEN = 1000 ** 2

ret = ''
while True:
    cmd = sys.stdin.readline()
    LOG.debug('Received %s', cmd.strip())
    try:
        cmd = json.loads(cmd)
    except ValueError as e:
        ret = json.dumps({
            "error": "Wrong JSON command: %s " % cmd,
            "error details": str(e),
        })
    else:
        if cmd['command'] == 'quit':
            sys.exit(0)
        elif cmd['command'] == 'noop':
            continue
        elif cmd['command'] == 'next':
            pass
        else:
            try:
                command = getattr(rpc_py2, cmd['command'])
                ret = json.dumps(command(*cmd['args']))
            except Exception as e:
                LOG.exception('Error running %s', cmd)
                ret = json.dumps({
                    "error": "Error executing command: %s%s" % (cmd['command'], str(cmd['args'])),
                    "error details": str(e),
                })
    if len(ret) > MAXLEN:
        sys.stdout.write(ret[:MAXLEN])
        ret = ret[MAXLEN:]
    else:
        sys.stdout.write(ret + '\n')
        ret = ''
    sys.stdout.flush()
