#
#   Data type conversion command for SWord 2.x (Python 3.x)
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

import struct


def convert(data, big_endian=False):
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

    endian = '>' if big_endian else '<'
    values['hex'] = data.upper() or '--'

    if not len(data) & 1:
        bytes_ = bytearray.fromhex(data)
        if len(bytes_) == 1:
            values['char'] = str(struct.unpack('b', bytes_)[0])
            values['uchar'] = str(struct.unpack('B', bytes_)[0])
        elif len(bytes_) == 2:
            values['short'] = str(struct.unpack(endian + 'h', bytes_)[0])
            values['ushort'] = str(struct.unpack(endian + 'H', bytes_)[0])
        elif len(bytes_) == 4:
            values['Int'] = str(struct.unpack(endian + 'i', bytes_)[0])
            values['UInt'] = str(struct.unpack(endian + 'I', bytes_)[0])
            values['Long'] = str(struct.unpack(endian + 'l', bytes_)[0])
            values['ULong'] = str(struct.unpack(endian + 'L', bytes_)[0])
            values['Float'] = str(struct.unpack(endian + 'f', bytes_)[0])
        elif len(bytes_) == 8:
            values['LongLong'] = str(struct.unpack(endian + 'q', bytes_)[0])
            values['ULongLong'] = str(struct.unpack(endian + 'Q', bytes_)[0])
            values['Double'] = str(struct.unpack(endian + 'd', bytes_)[0])

    return [data, values]
