import { GET_TAGS, DELETE_TAG, ADD_TAG, CLEAR_TAGS } from "../actions/types.js";

const initialState = {
  tags: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_TAGS:
      return {
        ...state,
        tags: action.payload
      };
    case DELETE_TAG:
      return {
        ...state,
        tags: state.tags.filter(lead => lead.id !== action.payload)
      };
    case ADD_TAG:
      return {
        ...state,
        tags: [...state.tags, action.payload]
      };
    case CLEAR_TAGS:
      return {
        ...state,
        tags: []
      };
    default:
      return state;
  }
}
