import { host } from '../Utils/Host'
import RestClient from '../Utils/RestClient'


const GetUserByClientId = (id) => {
    return RestClient.Get(host + `/user/userbyclientid?id=${id}`)
}
const GetReviews = (id) => {
    return RestClient.Get(host + `/review/userReview?uid=${id}`)
}
const GetUsers = () => {
    return RestClient.Get(host + `/user/getEmployees`)
}
const GetManagers = () => {
    return RestClient.Get(host + `/user/getManagers`)
}
const CreateReview = (uid, review, rating, name) => {
    var data = new FormData();
    data.append('uid', uid);
    data.append('review', review);
    data.append('rating', rating);
    data.append('name', name);

    return RestClient.Post(host + `/review/create`, data)
}
const updateExpoToken = (id, expoToken) => {
    var data = new FormData();
    data.append('expoToken', expoToken);
    data.append('id', id);
    return RestClient.Post(host + `/user/updateExpoToken`, data)
}
const updateSettings = (id, msgstatus) => {
    var data = new FormData();
    data.append('msgstatus', msgstatus);
    data.append('id', id);
    return RestClient.Post(host + `/user/updateUserSetting`, data)
}

const buyLead = (lid, uid, cid, cost) => {
    var data = new FormData();
    data.append('lid', lid);
    data.append('uid', uid);
    data.append('cid', cid);
    data.append('cost', cost);
    return RestClient.Post(host + `/user/buyLead`, data)
}

const getUserBudget = (id) => {
    return RestClient.Get(host + `/user/getUserBudget?uid=${id}`)
}

const UpdateUserInfo = (id, email, phNo, image) => {

    var data = new FormData();
    let filename = image?.uri?.split('/')?.pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    if (image) {
        data.append('avatar', image?.uri !== undefined ? { uri: image?.uri, name: filename, type } : '');
    }
    data.append('id', id);
    data.append('email', email);
    data.append('phonenumber', phNo);

    return RestClient.Post(host + `/employee/updateInfo`, data)
}


export default { GetUserByClientId, updateExpoToken, GetReviews, GetManagers, CreateReview, GetUsers, buyLead, getUserBudget, updateSettings, UpdateUserInfo }
