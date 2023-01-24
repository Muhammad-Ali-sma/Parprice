import { SET_CHATS, CLEAR_CHATS, UPDATE_CHATS, APPEND_CHATS, CHAT_COUNT, REMOVE_CLIENT_MSG_COUNT, REMOVE_USER_MSG_COUNT, USER_MSG_COUNT, CLIENT_MSG_COUNT, UPDATE_CLIENT_MSG_COUNT, SEEN_USER_MSG_COUNT, SEEN_CLIENT_MSG_COUNT, UPDATE_USER_MSG_COUNT,SET_USER_LAST_MESSAGE,SET_CLIENT_LAST_MESSAGE } from "../Actions/ActionTypes"

const initialState = {
    chat: [],
    msgCount: 0,
    userMsgCount: {
        userCount: 0,
        ids: []
    },
    clientMsgCount: {
        clientCount: 0,
        ids: []
    },
    seenUserMsgCount: [],
    seenClientMsgCount: [],
    lastUserMessage: [],
    lastClientMessage: []
}

const ChatReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CHATS:
            return {
                ...state,
                chat: action.data
            }
        case UPDATE_CHATS:
            return {
                ...state,
                chat: [...state.chat, action.data]
            }
        case APPEND_CHATS:
            return {
                ...state,
                chat: [...action.data, ...state.chat]
            }
        case CHAT_COUNT:
            return {
                ...state,
                msgCount: action.data
            }
        case USER_MSG_COUNT:
            return {
                ...state,
                userMsgCount: {
                    userCount: action.data.count,
                    ids: action.data.ids
                }
            }
        case CLIENT_MSG_COUNT:
            return {
                ...state,
                clientMsgCount: {
                    clientCount: action.data.count,
                    ids: action.data.ids
                }
            }
        case SEEN_USER_MSG_COUNT:
            return {
                ...state,
                seenUserMsgCount: [...state.seenUserMsgCount, action.data],
            }
        case UPDATE_USER_MSG_COUNT:
            return {
                ...state,
                seenUserMsgCount: JSON.parse(JSON.stringify(state.seenUserMsgCount.filter(x => { if (x.id == action.data.id) { x.count += 1 } return x; })))
            }
        case REMOVE_USER_MSG_COUNT:
            return {
                ...state,
                seenUserMsgCount: state.seenUserMsgCount.filter(x => x.id != action.data.id)
            }
        case SEEN_CLIENT_MSG_COUNT:
            return {
                ...state,
                seenClientMsgCount: [...state.seenClientMsgCount, action.data],
            }
        case UPDATE_CLIENT_MSG_COUNT:
            return {
                ...state,
                seenClientMsgCount: JSON.parse(JSON.stringify(state.seenClientMsgCount.filter(x => { if (x.id == action.data.id) { x.count += 1 } return x; })))
            }
        case REMOVE_CLIENT_MSG_COUNT:
            return {
                ...state,
                seenClientMsgCount: state.seenClientMsgCount.filter(x => x.id != action.data.id)
            }
        case SET_USER_LAST_MESSAGE:
            return {
                ...state,
                lastUserMessage: [...state.lastUserMessage, action.data],
            }
            case SET_CLIENT_LAST_MESSAGE:
                return {
                    ...state,
                    lastClientMessage: [...state.lastClientMessage, action.data],
                }
        case CLEAR_CHATS:
            return {
                ...state,
                chat: []
            }

        default:
            return state;
    }
}

export default ChatReducer
