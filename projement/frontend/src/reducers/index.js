import { combineReducers } from "redux";
import tags from "./tags";
import errors from "./errors";
import messages from "./messages";
import auth from "./auth";
import projects from "./projects";

export default combineReducers({
  projects,
  tags,
  errors,
  messages,
  auth
});
