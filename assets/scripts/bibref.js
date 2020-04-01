var notFoundRef = [];

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

function getNextCitation(reg, html, labelIndex) {
    var match = reg.exec(html);
    if (match == null) {
        match = reg.exec(html);
        if (match != null && labelIndex != null && labelIndex != undefined) {
            if (notFoundRef.hasOwnProperty(match[labelIndex])) {
                return null;
            }
        }
    }
    return match;
}

function searchCitations(html, command, callback) {
    var citeReg = RegExp('\\\\' + command + '\\{(.*?)\\}', 'ig');
    var match = getNextCitation(citeReg, html, 1);
    while (match != null) {
        var before = html.substr(0, match.index);
        var after = html.substr(citeReg.lastIndex, html.length - citeReg.lastIndex);
        var citation = callback(match[1], null);
        if (citation != '') {
            html = before + citation + after;
        } else {
            console.log("Reference not found (" + command + "): " + match[1]);
            notFoundRef[match[1]] = {
                notFoundOn: command
            };
        }
        match = getNextCitation(citeReg, html, 1);
    }
    var citeRegPaged = RegExp('\\\\' + command + '\\[(.*?)\\]\\{(.*?)\\}', 'ig');
    match = getNextCitation(citeRegPaged, html, 2);
    while (match !== null) {
        var before = html.substr(0, match.index);
        var after = html.substr(citeRegPaged.lastIndex, html.length - citeRegPaged.lastIndex);
        var citation = callback(match[2], match[1]);
        if (citation != '') {
            html = before + citation + after;
        } else {
            console.log("Reference not found (" + command + "): " + match[2]);
            notFoundRef[match[2]] = {
                notFoundOn: command
            };
        }
        match = getNextCitation(citeRegPaged, html, 2);
    }
    return html;
}