const WS = require('./ws')

module.exports = function() {
	if (window._ws) return
	WS()
}


