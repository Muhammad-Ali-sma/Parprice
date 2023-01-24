import { host } from "../Utils/Host"
import RestClient from "../Utils/RestClient"

const getAllLeads = () => {
    return RestClient.Get(host + '/lead/list')
}
const getLeads = () => {
    return RestClient.Get(host + '/lead/list?limit=8')
}
const getPlanById = (id) => {
    return RestClient.Get(host + `/plan/getplanbyid?id=${id}`)
}
export default { getAllLeads, getLeads, getPlanById }