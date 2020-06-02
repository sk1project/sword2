const newId = () => (~~(Math.random() * 1e8)).toString(16);
const newLongId = () => newId() + newId();

exports.model = () => ({
    'id': newId(),
    'name': 'CDRX document model',
    'info_column': true,
    'root': {
        'id': newId(),
        'name': 'CMX1',
        'marker': '4',
        'info': '0x352',
        'node': true,
        'fields': {},
        'chunkHex': 'f9d0004a',
        'chunkAscii': '...J',
        'childs': [
            {
                'id': newId(),
                'name': 'oort',
                'marker': '2',
                'info': '0x352',
                'node': true,
                'icon': 'folder',
                'icon-color': 'orange',
                'fields': {},
                'chunkHex': 'f9d0004a',
                'chunkAscii': '...J',
                'childs': [
                    {
                        'id': newId(),
                        'name': 'rolf',
                        'info': '0x352',
                        'node': false,
                        'icon': 'image',
                        'icon-color': 'red',
                        'fields': {},
                        'chunkHex': '2e004300 01010001 00010005 00eb004a\nf9d0004a f9b6004a f980004a f9eb004a',
                        'chunkAscii': '..C............J\n...J...J...J...J',
                    },
                    {
                        'id': newId(),
                        'name': 'rotl',
                        'marker': '56',
                        'info': '0x352',
                        'node': false,
                        'fields': {},
                        'chunkHex': 'f9d0004a f9b6004a f980004a f9eb004a\nf90c4444 444c8000 4af9eb00 4af9',
                        'chunkAscii': '...J...J...J...J\n..DDDL..J...J.',
                    },
                ]
            },
            {
                'id': newId(),
                'name': 'xxsa',
                'marker': '1',
                'info': '0x352',
                'node': false,
                'icon-color': 'green',
                'fields': {},
                'chunkHex': '2e004300 01010001 00010005 00eb004a',
                'chunkAscii': '..C............J',
            },
            {
                'id': newId(),
                'name': 'xssb',
                'marker': '5',
                'info': '0x352',
                'node': false,
                'fields': {},
                'chunkHex': 'f90c4444 444c8000 4af9eb00 4af9',
                'chunkAscii': '..DDDL..J...J.',
            },
        ]
    }
});
