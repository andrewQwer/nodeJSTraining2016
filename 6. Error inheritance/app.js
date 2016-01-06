var util = require('util');

function PhraseError(message) {
    this.message = message;
    Error.captureStackTrace(this);
}
util.inherits(PhraseError, Error);
PhraseError.prototype.name = "PhraseError";


function HttpError(status, message) {
    this.message = message;
    this.status = status;
    Error.captureStackTrace(this);
}
util.inherits(HttpError, Error);
HttpError.prototype.name = "HttpError";

var phrases = {
    "Hello": "Привет",
    "World": "мир"
};

function getPhrase(name) {
    if (!phrases[name]) {
        throw new PhraseError("Нет такой фразы: " + name);
    }
    return phrases[name];
}

function makePage(url) {
    if (url != 'index.html') {
        throw new HttpError(404, "нет такой страницы");
    }
    return util.format("%s, %s!", getPhrase("Helldo"), getPhrase("World"));
}
try {
    var page = makePage('index.html');
    console.log(page);
} catch (e) {
    if (e instanceof HttpError) {
        console.log(e.status, e.message);
    } else {
        console.error("Ошибка %s\n Сообщение: %s\n стек: %s", e.name, e.message, e.stack)
    }
}

