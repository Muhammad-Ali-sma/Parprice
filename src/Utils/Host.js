import LocalStorage from "./LocalStorage";
const url = 'https://portal.parprice.io/';
//export const host = "https://handyman.loca.lt/api/index.php";
export const host = `${url}api/index.php`;
export const demoImgUrl = `${url}assets/images/`;
export const pdfHost = `${url}`;
export let imgUrl;
export const getUrl = () => {
    LocalStorage.GetData('CompanyId').then(res => {
        imgUrl = `${url}assets/uploads/company_${res}/`;
    })
}


