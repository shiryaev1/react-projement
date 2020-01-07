import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getProjects } from "../../actions/projects";
import {Link, Redirect} from "react-router-dom";

export class Projects extends Component {
  static propTypes = {
    projects: PropTypes.array.isRequired,
    getProjects: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getProjects();
  }

  render() {
    return (
      <Fragment>
        <h2>Projects</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>TITLE</th>
              <th>COMPANY</th>
              <th>ESTIMATED</th>
              <th>ACTUAL</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.props.projects.map(project => (
              <tr key={project.id}>
                <td>{project.id}</td>
                <td><Link to={`/project/${project.id}/update`}>{project.title}</Link></td>
                <td>{project.company}</td>
                <td>{project.estimated}</td>
                <td>{project.actual}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to="/project/history">
            <input type="button" value="Project history"/>
        </Link>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  projects: state.projects.projects
});

export default connect(
  mapStateToProps,
  { getProjects}
)(Projects);
