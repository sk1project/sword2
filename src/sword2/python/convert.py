#!/usr/bin/env python3
#
#   Data type conversion script for SWord 2.x
#
# 	Copyright (C) 2013-2018 by Ihor E. Novikov
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

import json
import struct
import sys

values = {
    'hex': '--',
    'char': '--',
    'uchar': '--',
    'short': '--',
    'ushort': '--',
    'Int': '--',
    'UInt': '--',
    'Long': '--',
    'LongLong': '--',
    'ULongLong': '--',
    'Float': '--',
    'Double': '--',
}

if len(sys.argv)>2:
    data = sys.argv[2]

    endian = '>' if sys.argv[1] == 'yes' else '<'
    values['hex'] = data.upper() or '--'

    if not len(data) & 1:
        data = bytearray.fromhex(data)
        if len(data) == 1:
            values['char'] = str(struct.unpack('b', data)[0])
            values['uchar'] = str(struct.unpack('B', data)[0])
        elif len(data) == 2:
            values['short'] = str(struct.unpack(endian + 'h', data)[0])
            values['ushort'] = str(struct.unpack(endian + 'H', data)[0])
        elif len(data) == 4:
            values['Int'] = str(struct.unpack(endian + 'i', data)[0])
            values['UInt'] = str(struct.unpack(endian + 'I', data)[0])
            values['Long'] = str(struct.unpack(endian + 'l', data)[0])
            values['ULong'] = str(struct.unpack(endian + 'L', data)[0])
            values['Float'] = str(struct.unpack(endian + 'f', data)[0])
        elif len(data) == 8:
            values['LongLong'] = str(struct.unpack(endian + 'q', data)[0])
            values['ULongLong'] = str(struct.unpack(endian + 'Q', data)[0])
            values['Double'] = str(struct.unpack(endian + 'd', data)[0])

print(json.dumps(values))
