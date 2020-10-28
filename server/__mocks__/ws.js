const WebSocket = jest.createMockFromModule('ws');

WebSocket.Server = (function() {
    return function() {        
        return {
            on: function(event, callback) {
                console.log('event: ', event);
            },
        }
    }    
}());

module.exports = WebSocket;