import { host } from '../Utils/Host'
import RestClient from '../Utils/RestClient'


const GetClientsByUserId = (id) => {
    return RestClient.Get(host + `/client/clientbyuserid?id=${id}`)
}
const GetClientsList = () => {
    return RestClient.Get(host + `/client/list`)
}
const GetClientById = (id) => {
    return RestClient.Get(host + `/client/info?id=${id}`)
}
const AddNewClient = (firstName, lastName, address, email, number, notes) => {
    var data = new FormData();
    data.append('firstname', firstName);
    data.append('lastname', lastName);
    data.append('address', address);
    data.append('phonenumber', number);
    data.append('extension', '');
    data.append('email', email);
    data.append('notes', notes);
    data.append('password', '12345');
    data.append('avatar', '');
    return RestClient.Post(host + `/client/create`, data)
}
const EditClient = (firstName, lastName, address, email, number, notes, clientId) => {
    var data = new FormData();
    data.append('firstname', firstName);
    data.append('lastname', lastName);
    data.append('address', address);
    data.append('phonenumber', number);
    data.append('password', '');
    data.append('extension', '');
    data.append('email', email);
    data.append('notes', notes);
    data.append('id', clientId);
    data.append('avatar', '');
    return RestClient.Post(host + `/client/update`, data)
}

export default { GetClientsByUserId, GetClientsList, AddNewClient, EditClient, GetClientById }