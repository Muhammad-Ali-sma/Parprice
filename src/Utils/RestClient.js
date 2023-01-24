import axios from 'axios';
import LocalStorage from '../Utils/LocalStorage';



const Get = async (host) => {
    const Token = await LocalStorage.GetData("Token")
    return axios.get(host, { headers: { 'Authorization': 'Bearer ' + (Token != '' ? Token : '') } })
        .then(({ data }) => {
            return data;
        })
        .catch(async (error) => {
            return null;
        });
}

const Post = async (host, data) => {
    const Token = await LocalStorage.GetData("Token")
    return axios.post(host, data, { headers: { "Content-Type": "multipart/form-data", 'Authorization': 'Bearer ' + (Token != '' ? Token : '') } })
        .then(({ data }) => {
            return data;
        })
        .catch((error) => {
            return {
                success: false,
                error
            };
        });
}


export default { Get, Post };