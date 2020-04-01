if (!window.references) {
    window.references = [];
}
if (!window.chapter) {
    window.chapter = "";
}

function initialize(query, comp, options) {
    var elems = document.querySelectorAll(query);
    comp.init(elems, options);
}

function copyText(str) {
    var input = document.getElementById('temp-copy');
    input.value = str;
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand('copy');
    M.toast({html: 'Link copiado para a área de transferência!'})
}

function makeHeadingCopyLinks() {
    var elems = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
    for (var i = 0; i < elems.length; i++) {
        var hash = '#' + elems[i].getAttribute('id');
        var html = '<span class="share-link" data-hash="' + hash + '">#</span>';
        elems[i].innerHTML += html;
    }
    elems = document.querySelectorAll('.share-link[data-hash]');
    for (var i = 0; i < elems.length; i++) {
        elems[i].addEventListener('click', function(e) {
            var hash = e.target.getAttribute('data-hash');
            var url = window.location.href.split('#')[0];
            url = url + hash;
            copyText(url);
        });
    }
}

function makeCitations() {
    var html = document.querySelector('main').innerHTML;
    html = searchCitations(html, 'cite', cite);
    html = searchCitations(html, 'citeonline', citeonline);
    document.querySelector('main').innerHTML = html;
}

function makeNumbers(query, options) {
    var objs = document.querySelectorAll(query);
    var id = 1;
    for (var i = 0; i < objs.length; i++) {
        if (options.type == 'lema' || options.type == 'example') {
            var label = objs[i].getAttribute('data-label');
            var titleObj = objs[i].querySelector(options.titleQuery);
            var title = options.titlePrefix + id;
            id++;
            titleObj.innerHTML = title;
            window.references[label] = {
                type: options.type,
                value: title
            };
        } else if (options.type == 'equation') {
            var eq = objs[i];
            var label = eq.getAttribute('data-label');
            if (label == null || label == undefined) {
                continue;
            }
            var numBox = eq.querySelector('.docs-equation-num');
            if (numBox == null || numBox == undefined) {
                continue;
            }
            numBox.innerHTML = '(' + window.chapter + '.' + id + ')';
            window.references[label] = {
                type: 'equation',
                value: window.chapter + '.' + id
            }
            id++;
        }
    }
}

function makeNumbersRef(command, callback) {
    var refs = document.querySelectorAll('[' + command + ']');
    for(var i = 0; i < refs.length; i++) {
        var label = refs[i].getAttribute(command);
        if (window.references.hasOwnProperty(label)) {
            var html = callback(label, window.references[label]);
            refs[i].innerHTML = html;
        } else {
            console.log(command + " not found: " + label);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initialize('.sidenav', M.Sidenav, {});
    initialize('.collapsible', M.Collapsible, {});
    initialize('#search-bar-input', M.Autocomplete, {
        data: {
            'Microsoft': null,
            'Apple': null,
            'Apple Data': null,
            'Apple Tools': null,
            'Apple Microsoft': null,
            'Google': null,
        }
    });
    makeCitations();
    // lemas
    makeNumbers('.docs-lema', {
        type: 'lema',
        titleQuery: '.docs-lema-title',
        titlePrefix: 'Lema ' + window.chapter + '.'
    });
    // examples
    makeNumbers('.docs-example', {
        type: 'example',
        titleQuery: '.docs-example-title',
        titlePrefix: 'Exemplo ' + window.chapter + '.'
    });
    // equations
    makeNumbers('.docs-equation', {
        type: 'equation'
    });
    // eqref's
    makeNumbersRef('eqref', function(label, data){
        if (data.type === 'equation') {
            return '(' + data.value + ')';
        }
    });
    // ref's
    makeNumbersRef('ref', function(label, data){
        var link = '#' + label;
        if (data.extLink != null
            && data.extLink != undefined) {
            link = data.extLink;
        }
        return '<a href="' + link + '">' + data.value + '</a>';
    });
    // heading copy links
    makeHeadingCopyLinks();
    // katex math
    renderMathInElement(document.body, {});
});