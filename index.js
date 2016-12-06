var path = require("path");

var options = { style: "ansi" };

var writeLine = function (line) {
    if (arguments.length === 0) {
        line = "";
    }
    console.log(line);
};
var hasProp = Object.prototype.hasOwnProperty;

function repeat(len, str) {
    var ret = "";
    while (ret.length < len) {
        ret += str;
    }
    return ret;
}

function PathFormatter() {

}
PathFormatter.prototype = Object.create({
    name: "tslint-msbuild-path",
    getName: function () {
        return this.name;
    },
    format: function (failures) {
        var output = "";

        var files = {};
        var data = [];

        var codeMaxLen = 0;

        failures.forEach(function (failure) {
            var fileName = failure.getFileName();
            var res;
            if (hasProp.call(files, fileName)) {
                res = files[fileName];
            }
            else {
                files[fileName] = res = {
                    file: failure.getFileName(),
                    errors: []
                };
                data.push(res);
            }
            var lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
            var item = {
                reason: failure.getFailure(),
                line: lineAndCharacter.line + 1,
                character: lineAndCharacter.character + 1,
                code: (failure.getRuleName ? failure.getRuleName() : '')
            };
            res.errors.push(item);
            codeMaxLen = item.code ? Math.max(item.code.length, codeMaxLen) : codeMaxLen;
        });

        data.forEach(function (res) {
            var errors = res.errors;
            var file;
            if (res.file) {
                file = path.resolve(res.file);
            }
            if (!file) {
                file = "<unknown file>";
            }
            var head = "File \'" + res.file + "\'";
            if (!errors || errors.length === 0) {
                
            } else {
                errors.sort(function (a, b) {
                    if (a && !b) {
                        return -1;
                    }
                    else if (!a && b) {
                        return 1;
                    }
                    if (a.line < b.line) {
                        return -1;
                    }
                    else if (a.line > b.line) {
                        return 1;
                    }
                    if (a.character < b.character) {
                        return -1;
                    }
                    else if (a.character > b.character) {
                        return 1;
                    }
                    return 0;
                });

                errors.forEach(function (error) {
                    var line = "";
                    if (!error) {
                        return;
                    }

                    line += file + "(" + error.line + "," + error.character + "): error: ";

                    if (error.code) {
                        line += "[" + error.code + "]" + repeat(codeMaxLen + 1 - error.code.length, " ");
                    }

                    line += error.reason ? error.reason : "<undefined reason>";
                    if (typeof error.evidence !== "undefined") {
                        line += "\n" + error.evidence;
                    }
                    writeLine(line);
                });
                writeLine("");
            }
        });

        return output;
    }
});
module.exports = {
    Formatter: PathFormatter,
    options: options,
    color: function (enable) {
        options.style = enable ? "ansi" : false;
    }
};
