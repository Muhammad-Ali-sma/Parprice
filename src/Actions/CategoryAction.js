import CategoryServices from "../Services/CategoryServices"
import { GET_CATEGORIES } from "./ActionTypes"

export const allCategories = () => {
    return (dispatch, getState) => {
        CategoryServices.getCategories().then(res => {
            dispatch({
                type: GET_CATEGORIES,
                categories: res
            })
        })
    }
}