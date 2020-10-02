"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAngularInterpolation = exports.isAngularDirective = exports.isAngularAction = exports.isAngularBinding = void 0;
function isAngularBinding(name) {
    return name.length >= 3 && name[0] === '[' && name[name.length - 1] === ']';
}
exports.isAngularBinding = isAngularBinding;
function isAngularAction(name) {
    return name.length >= 3 && name[0] === '(' && name[name.length - 1] === ')';
}
exports.isAngularAction = isAngularAction;
function isAngularDirective(name) {
    return name.length >= 2 && name[0] === '*';
}
exports.isAngularDirective = isAngularDirective;
function isAngularInterpolation(val) {
    return (val.length >= 5 &&
        ((val[0] === '"' && val[val.length - 1] === '"') || (val[0] === "'" && val[val.length - 1] === "'")) &&
        val[1] === '{' &&
        val[2] === '{' &&
        val[val.length - 2] === '}' &&
        val[val.length - 3] === '}' &&
        !val.includes('{{', 3));
}
exports.isAngularInterpolation = isAngularInterpolation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9hbmd1bGFyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQWdCQSxTQUFnQixnQkFBZ0IsQ0FBQyxJQUFZO0lBQzVDLE9BQU8sSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUM7QUFDN0UsQ0FBQztBQUZELDRDQUVDO0FBa0JELFNBQWdCLGVBQWUsQ0FBQyxJQUFZO0lBQzNDLE9BQU8sSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUM7QUFDN0UsQ0FBQztBQUZELDBDQUVDO0FBa0JELFNBQWdCLGtCQUFrQixDQUFDLElBQVk7SUFDOUMsT0FBTyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDO0FBQzVDLENBQUM7QUFGRCxnREFFQztBQWtCRCxTQUFnQixzQkFBc0IsQ0FBQyxHQUFXO0lBQ2pELE9BQU8sQ0FDTixHQUFHLENBQUMsTUFBTSxJQUFJLENBQUM7UUFDZixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDcEcsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUc7UUFDZCxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRztRQUNkLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUc7UUFDM0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRztRQUMzQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUN0QixDQUFDO0FBQ0gsQ0FBQztBQVZELHdEQVVDIn0=