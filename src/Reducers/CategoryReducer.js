import { GET_CATEGORIES } from "../Actions/ActionTypes";

const initialState={
    categories:[],
}


const CategoryReducer = (state=initialState,action) => {
    switch (action.type) {
        
        case GET_CATEGORIES:
            return{
                ...state,
                categories:action.categories
            }            
        default:
            return  state
    }
}

export default CategoryReducer