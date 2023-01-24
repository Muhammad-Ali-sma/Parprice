import { host } from '../Utils/Host'
import RestClient from '../Utils/RestClient'


const CreateAppointment = (uid, cid, date, time, title, description) => {
    var data = new FormData();
    data.append('createdby', uid);
    data.append('createdfor', cid);
    data.append('date', date);
    data.append('time', time);
    data.append('description', description);
    data.append('title', title);
    return RestClient.Post(host + `/appointment/create`, data);
}

const UpdateAppointment = (id, uid, cid, date, time, title, description, uid2) => {
    var data = new FormData();

    data.append('id', id);
    data.append('createdby', uid);
    data.append('createdbysecond', uid2);
    data.append('createdfor', cid);
    data.append('date', date);
    data.append('time', time);
    data.append('description', description);
    data.append('title', title);
    return RestClient.Post(host + `/appointment/update`, data);
}

const GetAppointmentByUserId = (id) => RestClient.Get(host + `/appointment/getAppointmentsByUserId?id=${id}`);

const GetAppointmentByClientId = (id) => RestClient.Get(host + `/appointment/getAppointmentsByClientId?id=${id}`);

const GetAppointmentList = (id) => RestClient.Get(host + `/appointment/list`);


export default { CreateAppointment, GetAppointmentByUserId, GetAppointmentByClientId, UpdateAppointment, GetAppointmentList }