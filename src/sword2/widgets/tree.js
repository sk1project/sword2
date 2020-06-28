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

const {HtmlElement, el} = require('./base.js');

class wTree extends HtmlElement {
    static defaultOptions = {
        callbackPrefix: 'app.tree',
        selectCallback: null,
    }

    constructor(id, opt = {}) {
        super(id, {...wTree.defaultOptions, ...opt});
        this.model = {};
        this.html = '';
        this.selected = null;
        this.root = null;
        this.nodes = [];
        this.mapping = {};
        this.history = {'back': [], 'forward': []};
        this.forwarded = false;
    }

    goBack() {
        if(this.history.back.length) {
            let item =  this.history.back.pop();
            this.history.forward.push(this.selected);
            let fw = this.history.forward;
            this.forwarded = true;
            this.nodeSelected(item)
            this.history.forward = fw;
            this.forwarded = false;
        }
    }

    goForward() {
        if(this.history.forward.length) {
            let item =  this.history.forward.pop();
            let fw = this.history.forward;
            this.forwarded = true;
            this.nodeSelected(item)
            this.history.forward = fw;
            this.forwarded = false;
        }
    }

    setModel(model = {}) {
        this.model = model;
        this.refresh();
    }

    selectRoot() {
        this.nodeSelected(this.root);
    }

    refresh() {
        this.clear();
        this.render();
        this.collapseAll();
        if (this.model.hasOwnProperty('root') && this.model.root.hasOwnProperty('childs'))
            wTree.expand(this.root);
        this.selectRoot();
    }

    clear() {
        this.setHtml();
    }

    static expand(nodeId) {
        el('grp' + nodeId).display(true);
        el('tree-ocl-' + nodeId).el.className = 'sw sw-vtri black';
        let icon = el('tree-icon-' + nodeId);
        icon.el.className = icon.el.className.replace('sw-folder ','sw-folder-open ');
        console.log('expanded', nodeId);
    }

    static collapse(nodeId) {
        el('grp' + nodeId).display(false);
        el('tree-ocl-' + nodeId).el.className = 'sw sw-htri black';
        let icon = el('tree-icon-' + nodeId);
        icon.el.className = icon.el.className.replace('sw-folder-open ','sw-folder ');
        console.log('collapsed', nodeId);
    }

    expandAll() {
        this.nodes.forEach(function (item) {
            wTree.expand(item);
        }, this)
    }

    collapseAll() {
        this.nodes.forEach(function (item) {
            wTree.collapse(item);
        }, this)
    }

    render() {
        if (this.model.hasOwnProperty('root')) {
            this.root = this.model['root']['id'];
            this.mapping = {};
            this.nodes = [];
            this.setHtml('<div class="div-scroll"><div class="stripped"><div class="tree-root">' +
                this.parseObj(this.model['root']) + '</div></div></div>');
        }
    }

    parseObj(obj) {
        let html = '';

        if (obj['node']) {
            for (let i = 0; i < obj['childs'].length; i++) {
                html += this.parseObj(obj['childs'][i]);
            }
        }

        let marker = obj.hasOwnProperty('marker') ?
            `<span id="tree-marker-${obj['id']}" class="tree-marker gray"> (${obj['marker']})</span>` : '';
        let _p = this.opt.callbackPrefix;
        let _id = obj['id'];
        let info = '';
        if (this.model['info_column']) {
            info = `<div id="tree-info-${obj['id']}" class="tree-info gray">${obj.hasOwnProperty('info') ?
                obj['info'] : '&nbsp;'}</div>`;
        }
        let click_clbk = `onclick="${_p}.nodeSelected('${obj['id']}')"`;
        let ocl_clbk = `onclick="event.stopPropagation();${_p}.oclClicked('${obj['id']}');"`;

        this.mapping[_id] = obj;

        if (html.length > 0) {
            this.nodes.push(_id);
            click_clbk += `ondblclick="${_p}.oclClicked('${obj['id']}')"`;
            let icon = `sw sw-${obj.hasOwnProperty('icon') ? obj['icon'] : 'folder'}`;
            icon = `${icon} ${obj.hasOwnProperty('icon-color') ? obj['icon-color'] : 'orange'}`;
            html = `<div id="tree-bg-${_id}" class="tree-row-bg" ${click_clbk}>&nbsp;</div>` +  // background
                `<div id="tree-item-${_id}" class="tree-node" ${click_clbk}>` +                 // tree item
                `<i id="tree-ocl-${_id}" class="sw sw-vtri black" ${ocl_clbk}></i>` +           // ocl
                `<span id="tree-label-${_id}" class="tree-node-text">` +                        // item span
                `<i id="tree-icon-${_id}" class="${icon}"></i>` +                               // item icon
                `${obj['name']}${marker}</span>${info}</div>` +                                 // text, marker, info
                `<div id="grp${_id}" class="tree-group">` + html + '</div>';                    // inner container
        } else {
            let icon = `sw sw-${obj.hasOwnProperty('icon') ? obj['icon'] : 'file'}`;
            icon = `${icon} ${obj.hasOwnProperty('icon-color') ? obj['icon-color'] : 'gray'}`;
            html = `<div id="tree-bg-${_id}" class="tree-row-bg" ${click_clbk}>&nbsp;</div>` +  // background
                `<div id="tree-item-${_id}" class="tree-leaf" ${click_clbk}>` +                 // tree item
                `<div class="tree-leaf-ocl"></div>` +                                           // ocl stub
                `<span id="tree-label-${_id}" class="tree-node-text">` +                        // item span
                `<i id="tree-icon-${_id}" class="${icon}"></i>` +                               // item icon
                `${obj['name']}${marker}</span>${info}</div>`;                                  // text, marker, info
        }
        return html;
    }

    oclClicked(nodeId) {
        el('grp' + nodeId).switchDisplay();
        let ocl = el('tree-ocl-' + nodeId);
        ocl.el.className = ocl.el.className.includes('-vtri') ? 'sw sw-htri black' : 'sw sw-vtri black';
        let icon = el('tree-icon-' + nodeId);
        let icon_class = icon.el.className;
        if(icon_class.includes('sw-folder ')) {
            icon.el.className = icon_class.replace('sw-folder ','sw-folder-open ');
        } else if(icon_class.includes('sw-folder-open ')) {
            icon.el.className = icon_class.replace('sw-folder-open ','sw-folder ');
        }
    }

    nodeSelected(node_id = null) {
        let arr = ['bg', 'item', 'ocl', 'icon', 'label', 'marker', 'info'];

        if (this.selected !== null) {
            arr.forEach(function (item) {
                let id = `tree-${item}-${this.selected}`;
                el(id) ? el(id).removeClass('selected') : null;
            }, this);

            if(this.selected !== this.history.forward[this.history.forward.length - 1])
                this.history.back.push(this.selected);
        }
        this.selected = node_id;
        if (!this.forwarded) this.history.forward = [];
        if (this.selected !== null) {
            arr.forEach(function (item) {
                let id = `tree-${item}-${this.selected}`;
                el(id) ? el(id).addClass('selected') : null;
            }, this);
            if (this.opt.selectCallback) this.opt.selectCallback(this.mapping[node_id]);
        }
    }
}

exports.wTree = wTree;