import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";

import { GET_TAGS, DELETE_TAG, ADD_TAG } from "./types";

export const getTags = () => (dispatch, getState) => {
  axios
    .get("http://127.0.0.1:8000/api/tags/", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TAGS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const deleteTag = id => (dispatch, getState) => {
  axios
    .delete(`http://127.0.0.1:8000/api/tag/${id}/delete/`, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage({ deleteObj: "Tag Deleted" }));
      dispatch({
        type: DELETE_TAG,
        payload: id
      });
    })
    .catch(err => console.log(err));
};

export const addTag = tag => (dispatch, getState) => {
  axios
    .post("http://127.0.0.1:8000/api/tag/create/", tag, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage({ addObj: "Tag Added" }));
      dispatch({
        type: ADD_TAG,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
