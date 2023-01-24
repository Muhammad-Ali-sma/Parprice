import { host } from '../Utils/Host'
import RestClient from '../Utils/RestClient'


const LoginUser = (email, password) => {
    var data = new FormData();
    data.append('usernameoremail', email);
    data.append('password', password);
    return RestClient.Post(host + `/user/loginuser`, data)
}
const changePassword = (oldPassword,oldPasswordHash,password) => {
    var data = new FormData();
    data.append('oldPassword', oldPassword);
    data.append('oldPasswordHash', oldPasswordHash);
    data.append('password', password);
    return RestClient.Post(host + `/user/changepassword`, data)
}
const UserNotifications = (id) => {
    return RestClient.Get(host + `/notification/getNotificationByUserId?id=${id}`)
}

export default { LoginUser,changePassword,UserNotifications }