function cite(name, page) {
    if (window.bib == null || window.bib == undefined) {
        return '';
    }
    if (window.bib.hasOwnProperty(name)) {
        var obj = window.bib[name];
        if (obj.author.hasOwnProperty('cite')) {
            var name = obj.author.cite;
            var year = obj.year;
            if (page != null && page != undefined) {
                return '(' + name + ', ' + year + ', ' + page + ')';
            }
            return '(' + name + ', ' + year + ')';
        }
    }
    return '';
}

function citeonline(name, page) {
    if (window.bib == null || window.bib == undefined) {
        return '';
    }
    if (window.bib.hasOwnProperty(name)) {
        var obj = window.bib[name];
        if (obj.author.hasOwnProperty('online')) {
            var name = obj.author.online;
            var year = obj.year;
            if (page != null && page != undefined) {
                return name + ' (' + year + ', ' + page + ')';
            }
            return name + ' (' + year + ')';
        }
    }
    return '';
}

function getNextCitation(reg, html) {
    var match = reg.exec(html);
    if (match == null) {
        match = reg.exec(html);
    }
    return match;
}

function searchCitations(html, command, callback) {
    var citeReg = RegExp('\\\\' + command + '\\{(.*?)\\}', 'ig');
    var match = getNextCitation(citeReg, html);
    while (match != null) {
        var before = html.substr(0, match.index);
        var after = html.substr(citeReg.lastIndex, html.length - citeReg.lastIndex);
        var citation = callback(match[1], null);
        if (citation != '') {
            html = before + citation + after;
        } else {
            console.log("Reference not found (" + command + "): " + match[1]);
        }
        match = getNextCitation(citeReg, html);
    }
    var citeRegPaged = RegExp('\\\\' + command + '\\[(.*?)\\]\\{(.*?)\\}', 'ig');
    match = getNextCitation(citeRegPaged, html);
    while (match !== null) {
        var before = html.substr(0, match.index);
        var after = html.substr(citeRegPaged.lastIndex, html.length - citeRegPaged.lastIndex);
        var citation = callback(match[2], match[1]);
        if (citation != '') {
            html = before + citation + after;
        } else {
            console.log("Reference not found (" + command + "): " + match[2]);
        }
        match = getNextCitation(citeRegPaged, html);
    }
    return html;
}