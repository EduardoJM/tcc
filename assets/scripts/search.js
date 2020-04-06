function stripMain(docText) {
    var reg = /<main>([\s\S]*?)<\/main>/gim;
    var match = docText.match(reg);
    if (match != null && match != undefined) {
        var text = match[0];
        var strip = getSearchable(text);
        return strip;
    }
    return null;
}

function deleteNodes(el, query) {
    var nodes = el.querySelectorAll(query);
    for(var i = 0; i < nodes.length; i++) {
        nodes[i].remove();
    }
}

function deleteAttribute(el, attr, onElement) {
    var q = '[' + attr + ']';
    if (onElement != null && onElement != undefined) {
        q = onElement + q;
    }
    var nodes = el.querySelectorAll(q);
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].removeAttribute(attr);
    }
}

function removeClass(el, cl) {
    var nodes = el.querySelectorAll('.' + cl);
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].classList.remove(cl);
    }
}

function getSearchable(main) {
    var div = document.createElement('div');
    div.innerHTML = main;
    deleteAttribute(div, 'data-label');
    removeClass(div, 'language-python');
    deleteNodes(div, 'div.picture');
    deleteNodes(div, 'a.anchor');
    deleteNodes(div, 'span[eqref]');
    deleteNodes(div, 'span[ref]');
    return div.innerHTML;
}

function getPageTitle(docText) {
    var reg = /<h1[^>]*class="title light">([\s\S]*?)<\/h1>/gi;
    var match = docText.match(reg);
    if (match != null && match != undefined) {
        var text = match[0];
        text = text.replace(/<h1[^>]*class="title light">/, '');
        text = text.replace(/<\/h1>/, '');
        text = text.trim();
        return text;
    }
    return null;
}

function peekTagBefore(tag, main, index) {
    var peek = '';
    var i = index - 1;
    var peeking = false;
    var found = false;
    while (peek != tag) {
        var c = main[i];
        i--;
        if (i <= 0) {
            return -1;
        }
        if (c == '>'){
            peeking = true;
        }
        if (peeking) {
            peek = c + peek;
        }
        if (c == '<') {
            peeking = false;
            if (peek == tag) {
                found = true;
                break;
            } else {
                peek = '';
            }
        }
    }
    if (found) {
        return i;
    }
    return -1;
}

function peekTagAfter(tag, main, index) {
    var peek = '';
    var i = index;
    var peeking = false;
    var found = false;
    while (peek != tag) {
        var c = main[i];
        i++;
        if (i > main.length) {
            return -1;
        }
        if (c == '<'){
            peeking = true;
        }
        if (peeking) {
            peek += c;
        }
        if (c == '>') {
            peeking = false;
            if (peek == tag) {
                found = true;
                break;
            } else {
                peek = '';
            }
        }
    }
    if (found) {
        return i;
    }
    return -1;
}

function getParagraph(main, query, findIndex) {
    var pBefore = peekTagBefore('<p>', main, findIndex);
    var pAfter = peekTagAfter('</p>', main, findIndex + query.length);
    if (pBefore == -1 || pAfter == -1) {
        return null;
    }
    var length = pAfter - pBefore;
    var p = main.substr(pBefore, length);
    p = p.trim();
    p = p.replace(/<img .*?>/g, '');
    return p;
}

function makeSearch(doc, docText, query) {
    var main = stripMain(docText);
    if (main == null) {
        return;
    }
    var pageTitle = getPageTitle(docText);
    if (pageTitle == null) {
        pageTitle = 'Página sem título aparente';
    }
    var searchs = [];
    var reg = new RegExp(query, 'gi');
    var matches = main.matchAll(reg);
    var arr = Array.from(matches);
    for(var i = 0; i < arr.length; i++) {
        var p = getParagraph(main, query, arr[i].index);
        if (p == null) {
            continue;
        }
        if (searchs.includes(p)) {
            continue;
        }
        searchs.push(p);
    }
    var result = {
        page: doc,
        query: query,
        title: pageTitle,
        result: searchs
    };
    return result;
}

function beginSearch(doc, callback) {
    var http = new XMLHttpRequest();
    http.open('GET', doc, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            callback(doc, http.responseText);
        }
    }
    http.send();
}

function writeResult(result) {
    if (result.result.length == 0) {
        return;
    }
    var html = '<ul data-page="' + result.page + '" class="collection with-header">';
    html += '<li class="collection-header"><h4>' + result.title + '</h4></li>';
    for (var i = 0; i < result.result.length; i++) {
        var r = result.result[i];
        html += '<li class="collection-item">' + r + '</li>';
    }
    html += '</ul>';
    var sr = document.getElementById('search-result');
    var inner = sr.innerHTML;
    sr.innerHTML = inner + html;
}

function makeHighlight(query){
    var main = document.querySelector('main');
    var html = main.innerHTML;
    html = html.replace(new RegExp(query, 'gi'), "<span class='highlight'>$&</span>");
    main.innerHTML = html;
}

function makeFolow(query) {
    var col = document.querySelectorAll("#search-result .collection");
    for(var i = 0; i < col.length; i++) {
        var p = col[i];
        var page = p.getAttribute('data-page');
        var html = p.innerHTML;
        html += '<li class="collection-item footer-item">';
        html += '<a href="' + page + '">Ver página</a>'
        html += '</li>';
        p.innerHTML = html;
    }
}

function searchPostProcess(query) {
    makeHighlight(query);
    makeFolow(query);
    // katex math
    renderMathInElement(document.body, {});
}

function execSearch(query) {
    var pages = [
        'part0.html',
        'part1.html',
        'part2.html',
        'part3.html',
        'part4.html',
        'part5.html',
        'resumo.html',
        'apendA.html',
        'apendB.html',
        'apendC.html',
    ];
    var searchs = pages.length;
    for (var i = 0; i < pages.length; i++){
        var p = pages[i];
        beginSearch(p, function(page, docText) {
            var results = makeSearch(page, docText, query);
            writeResult(results);
            searchs--;
            if (searchs == 0) {
                searchPostProcess(query);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var search = window.location.search;
    if (search == null || search == null || search == '') {
        return;
    }
    search = search.substr(1, search.length - 1); // remove ?
    var splited = search.split('&');
    for (var i = 0; i < splited.length; i++) {
        if (splited[i].startsWith('q=')) {
            var query = splited[i].substr(2, splited[i].length - 2);
            query = decodeURI(query.replace(/\+/g, ' '));
            execSearch(query);
        }
    }
})