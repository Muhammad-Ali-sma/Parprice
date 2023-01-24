import moment from 'moment'
import { host } from '../Utils/Host'
import RestClient from '../Utils/RestClient'


const GetQuotes = (cliendId) => {
    return RestClient.Get(host + `/job/jobbyclientid?id=${cliendId}`)
}
const GetQuotesByUserId = (userId) => {
    return RestClient.Get(host + `/job/jobbyuserid?id=${userId}`)
}
const GetQuoteById = (jobId) => {
    return RestClient.Get(host + `/job/info?id=${jobId}`)
}
const GetActivityByUserId = (uid) => {
    return RestClient.Get(host + `/activity/getUserActivityById?uid=${uid}`)
}
const createQuoteMessage = (jid, sms, email, message) => {
    var data = new FormData();
    data.append('jid', jid);
    data.append('sms', sms.toString());
    data.append('email', email.toString());
    data.append('message', message);
    return RestClient.Post(host + '/user/sendQuoteToClient', data)
}
const createReviewMessage = (uid, sms, message) => {
    var data = new FormData();
    data.append('sms', sms.toString());
    data.append('message', message);
    data.append('uid', uid);

    return RestClient.Post(host + '/user/sendSMSFromApp', data)
}

const CreateJob = (uid, cid, pid, title, subtotal, discount, manualDiscount, deposit) => {
    var data = new FormData();
    data.append('uid', uid.toString());
    data.append('clientid', cid.toString());
    data.append('pid', pid);
    data.append('title', title);
    data.append('subtotal', subtotal.toString());
    data.append('discount', discount.toString());
    data.append('manualDiscount', manualDiscount.toString());
    data.append('deposit', deposit.toString());
    data.append('status', 'quote');
    data.append('startDate', '0000-00-00');
    data.append('startTime', '00:00:00');
    return RestClient.Post(host + `/job/create`, data);
}

const UpdateJob = (id, uid, cid, pid, title, subtotal, discount, manualDiscount, deposit) => {
    var data = new FormData();
    data.append('id', id.toString());
    data.append('uid', uid.toString());
    data.append('clientid', cid.toString());
    data.append('pid', pid);
    data.append('title', title);
    data.append('subtotal', subtotal.toString());
    data.append('discount', discount.toString());
    data.append('manualDiscount', manualDiscount.toString());
    data.append('deposit', deposit.toString());
    data.append('status', 'quote');
    data.append('startDate', '0000-00-00');
    data.append('startTime', '00:00:00');
    return RestClient.Post(host + `/job/update`, data);
}

const ChangeJobStatus = (id, pid, status) => {
    var data = new FormData();
    data.append('id', id);
    data.append('pid', pid);
    data.append('status', status);
    data.append('startDate', moment(Date.now()).format('YYYY-MM-DD'));
    data.append('startTime', moment(Date.now()).format('hh:mm:ss'));
    return RestClient.Post(host + `/job/changestatus`, data)
}

const CreateJobNote = (jid, note, created_by) => {
    var data = new FormData();
    data.append('jid', jid);
    data.append('note', note);
    data.append('created_by', created_by);

    return RestClient.Post(host + `/jobNote/create`, data)
}
const GetJobNote = (jid) => {
    return RestClient.Get(host + `/jobNote/getNotesByJobId?id=${jid}`)
}
const UpdateJobCustomer = (client_id, jid, fullname, title, address) => {
    var data = new FormData();
    data.append('client_id', client_id);
    data.append('jid', jid);
    data.append('fullname', fullname);
    data.append('title', title);
    data.append('address', address);
    return RestClient.Post(host + `/job/updateJobAndClientDetail`, data)
}
const GetLeaderBoards = (month, year) => {
    return RestClient.Get(host + `/job/leaderBoard?month=${month}&year=${year}`);
}
const GetStatusBoard = (month, uid) => {
    return RestClient.Get(host + `/job/statusBoard?uid=${uid}&month=${month}`);
}
export default { CreateJob, GetStatusBoard, GetLeaderBoards, ChangeJobStatus, GetQuotes, GetQuoteById, GetActivityByUserId, GetQuotesByUserId, CreateJobNote, GetJobNote, UpdateJob, UpdateJobCustomer, createQuoteMessage, createReviewMessage }