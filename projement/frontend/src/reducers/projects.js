import { GET_PROJECTS, ADD_PROJECT, CLEAR_PROJECTS } from "../actions/types.js";

const initialState = {
  projects: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_PROJECTS:
      return {
        ...state,
        projects: action.payload
      };
    case ADD_PROJECT:
      return {
        ...state,
        projects: [...state.projects, action.payload]
      };
    case CLEAR_PROJECTS:
      return {
        ...state,
        projects: []
      };
    default:
      return state;
  }
}
