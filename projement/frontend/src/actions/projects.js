import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";

import { GET_PROJECTS, ADD_PROJECT } from "./types";

export const getProjects = () => (dispatch, getState) => {
  axios
    .get("http://127.0.0.1:8000/api/dashboard/", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_PROJECTS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const addProject = project => (dispatch, getState) => {
  axios
    .post("http://127.0.0.1:8000/api/project/create/", project, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage({ addLead: "Projects Added" }));
      dispatch({
        type: ADD_PROJECT,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
