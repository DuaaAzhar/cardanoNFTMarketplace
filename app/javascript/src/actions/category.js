import { UPDATE_SELECTED_CATEGORY } from "./types";

export const updateSelectedCategory = (selectedCategory) => {
    return {
        type: UPDATE_SELECTED_CATEGORY,
        payload: selectedCategory,
    };
};