var bib = {
    mefassan: {
        type: 'book',
        author: {
            cite: 'ASSAN',
            online: 'Assan'
        },
        year: 2003
    },
    hist_courant: {
        type: 'book',
        author: {
            cite: 'COURANT; ROBBINS',
        },
        year: 1996
    },
    calcvar: {
        type: 'mastersthesis',
        author: {
            cite: 'LIMA',
            online: 'Lima'
        },
        year: 2004
    },
    calcvar_campos: {
        type: 'mastersthesis',
        author: {
            cite: 'CAMPOS',
            online: 'Campos'
        },
        year: 2017
    },
    deep_ritz: {
        type: 'article',
        author: {
            cite: 'E; YU',
            online: 'E e YU'
        },
        year: 2018
    },
    MRR_Deflex: {
        type: 'article',
        author: {
            cite: 'RODRIGUES; RODRIGUES; HAUSER',
            online: 'Rodrigues, Rodrigues e Hauser'
        },
        year: 2014
    },
    RRM_Applications: {
        type: 'inbook',
        author: {
            cite: 'ILANKO; MONTERRUBIO; MOCHIDA',
            online: 'Ilanko, Monterrubio e Mochida'
        },
        year: 2014
    },
    boyer: {
        type: 'book',
        author: {
            cite: 'BOYER',
            online: 'Boyer'
        },
        year: 1996
    },
    hist_still: {
        type: 'book',
        author: {
            cite: 'STILLWELL',
            online: 'Stillwell'
        },
        year: 2010
    },
    LEISSA_2005: {
        type: 'article',
        author: {
            cite: 'LEISSA',
            online: 'Leissa'
        },
        year: 2005
    },
    Python_history: {
        type: 'online',
        author: {
            cite: 'ROSSUM',
            online: 'Rossun'
        },
        year: 2001
    },
    NumPy: {
        type: 'manual',
        author: {
            cite: 'NUMPY COMMUNITY',
            online: 'NumPy Community'
        },
        year: 2019
    },
    SciPy: {
        type: 'manual',
        author: {
            cite: 'SCIPY COMMUNITY',
            online: 'SciPy Community'
        },
        year: 2019
    },
    Matplotlib: {
        type: 'manual',
        author: {
            cite: 'HUNTER et al.',
            online: 'Hunter et. al.'
        },
        year: 2019
    },
    SymPy: {
        type: 'manual',
        author: {
            cite: 'SYMPY DEVELOPMENT TEAM',
            online: 'SymPy Development Team'
        },
        year: 2019
    },
    Vasquez2015: {
        type: 'article',
        author: {
            cite: 'BOLINA et al.',
            online: 'Bolina et al.',
        },
        year: 2015
    },
    mrr_beams: {
        type: 'article',
        author: {
            cite: 'MAZANOGLU',
            online: 'Mazanoglu',
        },
        year: 2015
    },
    GROSSI_2001: {
        type: 'article',
        author: {
            cite: 'GROSSI; ALBARRACIN',
            online: 'Grossi e Albarracin'
        },
        year: 2001
    }
}

function cite(name, page) {
    if (bib.hasOwnProperty(name)) {
        var obj = bib[name];
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
    if (bib.hasOwnProperty(name)) {
        var obj = bib[name];
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

function searchCitations(html, command, callback) {
    var citeReg = RegExp('\\\\' + command + '\\{(.*?)\\}', 'ig');
    while ((match = citeReg.exec(html)) !== null) {
        console.log(match);
        var before = html.substr(0, match.index);
        var after = html.substr(citeReg.lastIndex, html.length - citeReg.lastIndex);
        var citation = callback(match[1], null);
        console.log("parsing: " + match[1] + ' as result ' + citation);
        if (citation != '') {
            html = before + citation + after;
        } else {
            console.log("Reference not found (" + command + "): " + match[1]);
        }
    }
    var citeRegPaged = RegExp('\\\\' + command + '\\[(.*?)\\]\\{(.*?)\\}', 'ig');
    while ((match = citeRegPaged.exec(html)) !== null) {
        var before = html.substr(0, match.index);
        var after = html.substr(citeRegPaged.lastIndex, html.length - citeRegPaged.lastIndex);
        var citation = callback(match[2], match[1]);
        if (citation != '') {
            html = before + citation + after;
        } else {
            console.log("Reference not found (" + command + "): " + match[2]);
        }
    }
    return html;
}