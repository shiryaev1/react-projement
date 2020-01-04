import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getTags, deleteTag } from "../../actions/tags";

export class Tags extends Component {
  static propTypes = {
    tags: PropTypes.array.isRequired,
    getTags: PropTypes.func.isRequired,
    deleteTag: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getTags();
  }

  render() {
    return (
      <Fragment>
        <h2>Tags</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>TITLE</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.props.tags.map(lead => (
              <tr key={lead.id}>
                <td>{lead.id}</td>
                <td>{lead.title}</td>
                <td>
                  <button
                    onClick={this.props.deleteTag.bind(this, lead.id)}
                    className="btn btn-danger btn-sm"
                  >
                    {" "}
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  tags: state.tags.tags
});

export default connect(
  mapStateToProps,
  { getTags, deleteTag }
)(Tags);
