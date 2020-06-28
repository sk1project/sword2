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

import logging
import os

import uc2
from uc2 import uc2const
from uc2.formats import get_loader
from uc2.formats.generic import GENERIC_TAGS, ModelObject
from uc2.utils.config import XmlConfigParser

LOG = logging.getLogger(__name__)

app = uc2.uc2_init()
app.init_mngrs()

DOCS = {}

CD = []


def _safe_str(txt):
    txt = str(txt)
    if '<' in txt:
        txt = txt.replace('<', '&lt;')
    if '>' in txt:
        txt = txt.replace('>', '&gt;')
    return txt


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
    json_dict['name'] = _safe_str(title)
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
    doc.json_model = dict(id=doc_id,
                          name=name,
                          info_column=False,
                          binary=doc.model_type == uc2const.BINARY_MODEL,
                          root=None,
                          fileName=os.path.basename(doc_file),
                          filePath=doc_file.replace(os.path.expanduser('~'), '~'))

    doc.json_model['root'] = _parse_model(doc.model)
    CD.remove(doc)
    return [doc_file, doc.json_model]


def split_string(string, length):
    return [string[i:i + length] for i in range(0, len(string), length)]


def insert_string(string, position, substring):
    return '{}{}{}'.format(string[:position], substring, string[position:])


def get_char(char):
    if ord(char) == 0:
        return '<span class="color00">&curren;</span>'
    elif 31 < ord(char) < 127:
        return '&#{};'.format(ord(char))
    elif ord(char) < 32:
        return '<span class="color00">.</span>'
    elif ord(char) in (141, 144, 157, 160):
        return ''
    else:
        return '&#{}'.format(ord(char))


def get_binary_chunk(el):
    formatted_chunk = ''
    ascii_chunk = ''
    num_str = ''
    index = 0
    raw_chunk = el.chunk.encode('hex')
    for line in split_string(raw_chunk, 32):
        formatted_chunk += ' '.join(split_string(line, 8)) + '\n'
        ascii_chunk += ''.join([get_char(char) for char in line.decode('hex')]) + '\n'

        major, minor = split_string('%08x' % index, 4)
        num_str += '%s:%s\n' % (major, minor)
        index += 16

    formatted_chunk = formatted_chunk.strip()

    index = 1
    insertions = []
    LOG.debug(el.cache_fields)
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
        else:
            break
        index = index + 1 if index < 7 else 1
    for position, substring in reversed(insertions):
        formatted_chunk = insert_string(formatted_chunk, position, substring)

    formatted_chunk += '\n\n'
    index = 1
    for item in el.cache_fields:
        name = item[2] if len(item) > 2 else ''
        formatted_chunk += '<span class="color0{}">xxxx</span> - {}\n'.format(index, name)
        index = index + 1 if index < 7 else 1

    return formatted_chunk, ascii_chunk.strip(), num_str.strip()


def rpr(val):
    if isinstance(val, str) or isinstance(val, unicode):
        res = val[:20] if len(val) > 20 else val
        try:
            val = res.encode('utf-8') + ('...' if len(val) > 20 else '')
        except:
            val = res.encode('hex') + ('...' if len(val) > 20 else '')
        return '<span class="color01">%s</span>' % _safe_str(repr(val))
    elif isinstance(val, ModelObject):
        return '<span class="violet">%s</span>' % _safe_str(repr(val))
    elif isinstance(val, XmlConfigParser):
        return _safe_str(repr(val))
    elif isinstance(val, int):
        return '<span class="blue">%s</span>' % repr(val)
    return _safe_str(repr(val))


def create_repr(value):
    if isinstance(value, list):
        return '[%s]' % ',<br> '.join([create_repr(val) for val in value])
    elif isinstance(value, tuple):
        return '(%s)' % ', '.join([create_repr(val) for val in value])
    elif isinstance(value, dict):
        return '{%s}' % ',<br> '.join(['<span class="lightgray">%s</span>: %s' % (repr(key), create_repr(val))
                                       for key, val in value.items()])
    else:
        return rpr(value)


def get_chunk_report(el):
    html = '<h2 class="white">Object <i class="yellow">{}</i></h2>'.format(_safe_str(el.resolve()[1]))
    html += '<b class="midbrown">{}</b><br><br>'.format(_safe_str(str(el)))
    if el.__doc__:
        html += '<ul class="gray">{}</ul>'.format(_safe_str(el.__doc__).replace('\n', '<br>'))

    generic_fields = []
    obj_fields = []
    cache_fields = []

    items = el.__dict__.items()

    for item in items:
        key, value = item
        if key in GENERIC_TAGS:
            generic_fields.append(key)
        elif key.startswith('cache_'):
            cache_fields.append(key)
        else:
            obj_fields.append(key)

    html += '<b>Object generic fields:</b><br>'
    html += '<table class="info-table"><tr><th class="white">Field</th><th class="white">Value</th></tr>'
    for tag in generic_fields:
        html += '<tr><td>{}</td><td>{}</td></tr>'.format(tag, create_repr(el.__dict__[tag]))
    html += '</table><br>'

    if obj_fields:
        html += '<b>Object regular fields:</b><br>'
        html += '<table class="info-table"><tr><th class="white">Field</th><th class="white">Value</th></tr>'
        for tag in obj_fields:
            val = el.__dict__[tag]
            if tag == 'chunk':
                v = (val[:20] if len(val) > 20 else val).encode('hex')
                val = '<span class="green">%s</span>' % repr(v + ('...' if val > 20 else ''))
            else:
                val = create_repr(val)
            html += '<tr><td>{}</td><td>{}</td></tr>'.format(tag, val)
        html += '</table><br>'

    if cache_fields:
        html += '<b>Object caching fields:</b><br>'
        html += '<table class="info-table"><tr><th class="white">Field</th><th class="white">Value</th></tr>'
        for tag in cache_fields:
            html += '<tr><td>{}</td><td>{}</td></tr>'.format(tag, create_repr(el.__dict__[tag]))
        html += '</table><br>'
    return html


def chunk(doc_id, el_id):
    formatted_chunk = ''
    ascii_chunk = ''
    num_str = ''
    report = ''
    if doc_id in DOCS and el_id in DOCS[doc_id].indexes:
        el = DOCS[doc_id].indexes[el_id]
        if DOCS[doc_id].model_type == uc2const.BINARY_MODEL:
            formatted_chunk, ascii_chunk, num_str = get_binary_chunk(el)
        report = get_chunk_report(el)

    return [{'chunkHex': formatted_chunk, 'chunkAscii': ascii_chunk, 'chunkNums': num_str, 'report': report}]


def close(doc_id):
    if doc_id in DOCS:
        DOCS.pop(doc_id).close()
    return [{'result': 'done'}]
