import { GET_LEADS, DELETE_LEAD, ADD_LEAD, CLEAR_LEADS } from "../actions/types.js";

const initialState = {
  tags: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_LEADS:
      return {
        ...state,
        tags: action.payload
      };
    case DELETE_LEAD:
      return {
        ...state,
        tags: state.tags.filter(lead => lead.id !== action.payload)
      };
    case ADD_LEAD:
      return {
        ...state,
        tags: [...state.tags, action.payload]
      };
    case CLEAR_LEADS:
      return {
        ...state,
        tags: []
      };
    default:
      return state;
  }
}
