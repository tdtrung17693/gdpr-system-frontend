import * as SignalR from '@microsoft/signalr';
import { ConversationConfig } from '../config/conversation';

let connection = new SignalR.HubConnectionBuilder()
    .withUrl(ConversationConfig.endpoint)
    .build();

let isConnected = false;

connection.start()
    .then(() => {
        isConnected = true;
    })

let waitIfNotConnected =  () => {
    if (!isConnected) {
        return new Promise(resolve => setTimeout(() => {
            resolve(waitIfNotConnected())
        }, 500))
    }
    return  Promise.resolve();
}

export default {
    joinGroup: async (groupName: string) => {
        await waitIfNotConnected()
        console.log(groupName)
        return await connection.send("joinGroup", groupName)
    },
    leaveGroup: async (groupName: string) => {
        await waitIfNotConnected();
        return connection.send("leaveGroup", groupName)
    },
    on: connection.on.bind(connection),
    off: connection.off.bind(connection)
}