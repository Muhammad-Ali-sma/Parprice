import { host } from "../Utils/Host"
import RestClient from "../Utils/RestClient"

const getChats = (clientId, userId, pageIndex) => {
    return RestClient.Get(host + `/chat/getChatsByIds?sent_to=${clientId}&sent_from=${userId}&pageIndex=${pageIndex}&limit=20`)
}
const createChat = (clientId, userId, message) => {
    var data = new FormData();
    data.append('sent_to', clientId);
    data.append('sent_from', userId);
    data.append('message', message);
    return RestClient.Post(host + '/chat/create', data)
}
const seenChats = (from_id, sent_id) => {
    var data = new FormData();
    data.append('from_id', from_id);
    data.append('sent_id', sent_id);
    return RestClient.Post(host + '/chat/readAllMessages', data)
}
export default { getChats, createChat, seenChats }