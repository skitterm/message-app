import Socket from './socket';


test('Socket initially has no clients', () => {
    const socket = new Socket();    
    expect(socket.getClients()).toEqual([]);
});

