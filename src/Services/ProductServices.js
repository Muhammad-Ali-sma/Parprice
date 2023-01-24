import { host } from "../Utils/Host"
import RestClient from "../Utils/RestClient"

const getProductsByCategoryId = (id) => {
    return RestClient.Get(host + `/product/productByCategoryid?id=${id}`)
}
const addProduct = (productName, image, uid, catid, price, productDescription) => {
    var data = new FormData();
    let filename = image?.uri?.split('/')?.pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    data.append('thumb', image?.uri !== undefined ? { uri: image?.uri, name: filename, type } : '');
    data.append('title', productName);
    data.append('price', price);
    data.append('catid', catid);
    data.append('isPrivate', uid);
    data.append('description', productDescription);
    return RestClient.Post(host + '/product/createPrivate', data)
}
export default { getProductsByCategoryId, addProduct }