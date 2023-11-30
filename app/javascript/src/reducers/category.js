import { UPDATE_SELECTED_CATEGORY } from "../actions/types";

const initialState = {
    selectedCategory: "All",
};

export const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_SELECTED_CATEGORY:
        return {
            ...state,
            selectedCategory: action.payload,
        };
        default:
        return state;
    }
};