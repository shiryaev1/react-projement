import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addTag } from "../../actions/tags";

export class Form extends Component {
  state = {
    title: "",
  };

  static propTypes = {
    addTag: PropTypes.func.isRequired
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();
    const title = this.state;
    this.props.addTag(title);
    this.setState({
      title: "",
    });
  };

  render() {
    const {title} = this.state;
    return (
      <div className="card card-body mt-4 mb-4">
        <h2>Add tags</h2>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              className="form-control"
              type="text"
              name="title"
              onChange={this.onChange}
              value={title}
            />
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(
  null,
  { addTag }
)(Form);
