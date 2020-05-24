
const newId = () => (~~(Math.random() * 1e8)).toString(16);

const  mdl = {
    'name': 'CDRX document model',
    'info_column': true,
    'root': {
        'id': newId(),
        'name': 'CMX1',
        'marker': '4',
        'info': '0x352',
        'node': true,
        'fields': {},
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
                'childs': [
                    {
                        'id': newId(),
                        'name': 'rolf',
                        'info': '0x352',
                        'node': false,
                        'icon': 'image',
                        'icon-color': 'red',
                        'fields': {}
                    },
                    {
                        'id': newId(),
                        'name': 'rotl',
                        'marker': '56',
                        'info': '0x352',
                        'node': false,
                        'fields': {}
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
                'fields': {}
            },
            {
                'id': newId(),
                'name': 'xssb',
                'marker': '5',
                'info': '0x352',
                'node': false,
                'fields': {}
            },
        ]
    }
};

module.exports.mdl = mdl;