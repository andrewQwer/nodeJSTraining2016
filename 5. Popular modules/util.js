/**
 * Created by andrey.karavaychik on 06.01.2016.
 */
var util = require('util');

var obj = {
    a: 5,
    b: 6
}

obj.self = obj;

var str = util.format("My %s %d %j", "string", 123, {test: 'obj'});

console.log(util.inspect(obj));
console.log(str);