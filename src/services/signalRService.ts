import * as SignalR from '@microsoft/signalr';
import { ConversationConfig } from '../config/conversation';
import { ls } from './localStorage';
import { AuthConfig } from '../config/auth';

let connection = new SignalR.HubConnectionBuilder()
    .withUrl(ConversationConfig.endpoint, { accessTokenFactory: () => String(ls.get(AuthConfig.TOKEN_NAME)) })
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
        return await connection.send("joinGroup", groupName)
    },
    leaveGroup: async (groupName: string) => {
        await waitIfNotConnected();
        return connection.send("leaveGroup", groupName)
    },
    on: connection.on.bind(connection),
    off: connection.off.bind(connection)
}