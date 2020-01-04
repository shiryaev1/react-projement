import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";

import { GET_LEADS, DELETE_LEAD, ADD_LEAD } from "./types";

export const getLeads = () => (dispatch, getState) => {
  axios
    .get("http://127.0.0.1:8000/api/tag/create/", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_LEADS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const deleteLead = id => (dispatch, getState) => {
  axios
    .delete(`http://127.0.0.1:8000/api/tag/${id}/delete/`, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage({ deleteLead: "Lead Deleted" }));
      dispatch({
        type: DELETE_LEAD,
        payload: id
      });
    })
    .catch(err => console.log(err));
};

export const addLead = lead => (dispatch, getState) => {
  axios
    .post("http://127.0.0.1:8000/api/tag/create/", lead, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage({ addLead: "Lead Added" }));
      dispatch({
        type: ADD_LEAD,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
