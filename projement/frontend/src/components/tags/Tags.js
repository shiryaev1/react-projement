import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getTags, deleteTag } from "../../actions/tags";
import {Link} from "react-router-dom";

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
            {this.props.tags.map(tag => (
              <tr key={tag.id}>
                <td>{tag.id}</td>
                <td><Link to={`tag/${tag.id}/${tag.title}/update`}>{tag.title}</Link></td>
                <td>
                  <button
                    onClick={this.props.deleteTag.bind(this, tag.id)}
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
        <Link to="/tags/history">
            <input type="button" value="Tags history"/>
        </Link>
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
