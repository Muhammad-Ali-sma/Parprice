import { Platform } from "react-native"
import { host } from "../Utils/Host"
import RestClient from "../Utils/RestClient"

const getCategories = () => {
    return RestClient.Get(host + '/category/list')
}

export default { getCategories }