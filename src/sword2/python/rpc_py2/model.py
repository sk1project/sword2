# -*- coding: utf-8 -*-
#
#   UC2 for SWord 2.x (Python 2)
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

import os

import uc2
from uc2.formats import get_loader

app = uc2.uc2_init()

DOCS = {}

CD = []


def _parse_model(el):
    childs = [_parse_model(child) for child in el.childs]
    el_id = hex(id(el))
    CD[0].indexes[el_id] = el
    json_dict = {'id': el_id}
    data = el.resolve()
    info = None
    if len(data) == 4:
        icon, title, info, sz = data
    else:
        icon, title, sz = data
    json_dict['name'] = title
    json_dict['node'] = False
    if childs:
        json_dict['marker'] = str(len(childs))
        json_dict['node'] = True
        json_dict['childs'] = childs
    if icon and childs:
        json_dict['icon'] = 'folder'
    if info is not None:
        json_dict['info'] = info
        CD[0].json_model['info_column'] = True
    return json_dict


def load(doc_file=''):
    if not doc_file:
        raise ValueError('Empty doc_file path')
    elif not os.path.exists(doc_file) or not os.path.isfile(doc_file):
        ValueError('doc_file "%s" not found' % doc_file)

    loader = get_loader(doc_file, True)
    if loader is None:
        raise IOError('Unknown file format for %s' % doc_file)

    doc = loader(app.appdata, doc_file, translate=False, convert=False)
    doc.update(True)
    doc_id = hex(id(doc))
    DOCS[doc_id] = doc
    doc.indexes = {}
    CD.append(doc)

    name = '%s document model' % doc.cid.upper()
    doc.json_model = {'id': doc_id,
                      'name': name,
                      'info_column': False,
                      'root': _parse_model(doc.model),
                      'fileName': os.path.basename(doc_file),
                      'filePath': doc_file.replace(os.path.expanduser('~'), '~')}
    CD.remove(doc)
    return [doc_file, doc.json_model]


def split_string(string, length):
    return [string[i:i + length] for i in range(0, len(string), length)]


def insert_string(string, position, substring):
    return '{}{}{}'.format(string[:position], substring, string[position:])


def get_char(char):
    if 32 < ord(char) < 127:
        return char
    elif ord(char) < 33:
        return '<span class="color00">.</span>'
    elif ord(char) in (141, 144, 157, 160):
        return ''
    else:
        return '&#{}'.format(ord(char))


def chunk(doc_id, el_id):
    formatted_chunk = ''
    ascii_chunk = b''
    num_str = ''
    index = 0
    if doc_id in DOCS and el_id in DOCS[doc_id].indexes:
        el = DOCS[doc_id].indexes[el_id]

        raw_chunk = el.chunk.encode('hex')
        for line in split_string(raw_chunk, 32):
            formatted_chunk += ' '.join(split_string(line, 8)) + '\n'
            ascii_chunk += bytes(''.join([get_char(char) for char in line.decode('hex')]) + "\n")

            major, minor = split_string('%08x' % index, 4)
            num_str += '%s:%s\n' % (major, minor)
            index += 16

        formatted_chunk = formatted_chunk.strip()

        index = 1
        insertions = []
        for item in el.cache_fields:
            start = item[0]
            end = item[0] + item[1]
            start_shift = start // 4
            end_shift = end // 4
            start = start * 2 + start_shift
            if start < len(formatted_chunk):
                end = end * 2 + end_shift
                end -= 1 if len(formatted_chunk) < end else 0
                insertions.append((start, '<span class="color0{}">'.format(index)))
                insertions.append((end, '</span>'))
            index = index + 1 if index < 7 else 1
        for position, substring in reversed(insertions):
            formatted_chunk = insert_string(formatted_chunk, position, substring)

        formatted_chunk += '\n\n'
        index = 1
        for item in el.cache_fields:
            name = item[2] if len(item) > 2 else ''
            formatted_chunk += '<span class="color0{}">xxxx</span> - {}\n'.format(index, name)
            index = index + 1 if index < 7 else 1

    return [{'chunkHex': formatted_chunk, 'chunkAscii': ascii_chunk.strip(), 'chunkNums': num_str.strip()}]


def close(doc_id):
    if doc_id in DOCS:
        DOCS.pop(doc_id).close()
    return [{'result': 'done'}]
