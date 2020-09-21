import * as SignalR from '@microsoft/signalr';
import { HubConnectionState } from '@microsoft/signalr';
import { ConversationConfig } from '../config/conversation';
import { ls } from './localStorage';
import { AuthConfig } from '../config/auth';

let connection = new SignalR.HubConnectionBuilder()
  .withUrl(ConversationConfig.endpoint, { accessTokenFactory: () => String(ls.get(AuthConfig.TOKEN_NAME)) })
  .withAutomaticReconnect()
  .build();

async function start() {
  try {
    await connection.start();
  } catch (err) {
    setTimeout(() => start(), 5000);
  }
}
let waitIfNotConnected =  () => {
  if (connection.state !== HubConnectionState.Connected) {
    return new Promise(resolve => setTimeout(() => {
      resolve(waitIfNotConnected())
    }, 500))
  }
  return  Promise.resolve();
}

let groupJoined = false;
export default {
  joinGroup: async (groupName: string) => {
    await waitIfNotConnected();
    const c = await connection.send('joinGroup', groupName);
    groupJoined = true;
    return c;
  },
  leaveGroup: async (groupName: string) => {
    if (!groupJoined) return;
    await waitIfNotConnected();
    const c = connection.send('leaveGroup', groupName);
    groupJoined = false;
    return c;
  },
  on: connection.on.bind(connection),
  off: connection.off.bind(connection),
  start,
  stop: async () => {
    if (connection.state !== HubConnectionState.Connected) return;
    await connection.stop();
  },
};