(function(root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.ds = factory();
    }
}(this, function() {
    var exports = {};

    exports.VERSION = '0.1.1';

    return exports;
}));
