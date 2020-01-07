import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addProject } from "../../actions/projects";

export class Form extends Component {
  state = {
    title: "",
    start_date: null,
    end_date: null,
    estimated_design: null,
    actual_design: null,
    estimated_development: null,
    actual_development: null,
    estimated_testing: null,
    actual_testing: null,
    company: null,
    tags: null,
    companies: [],
    tagList: [],


  };

  static propTypes = {
    addProject: PropTypes.func.isRequired
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();
    const {
        title,
        start_date,
        end_date,
        estimated_design,
        actual_design,
        estimated_development,
        actual_development,
        estimated_testing,
        actual_testing,
        company,
        tags,
    } = this.state;
    const project = {
                title,
                start_date,
                end_date,
                estimated_design,
                actual_design,
                estimated_development,
                actual_development,
                estimated_testing,
                actual_testing,
                company,
                tags,
    };
    this.props.addProject(project);
    this.setState({
      title: "",
      start_date: null,
      end_date: null,
      estimated_design: null,
      actual_design: null,
      estimated_development: null,
      actual_development: null,
      estimated_testing: null,
      actual_testing: null,
      company: null,
      tags: null,
    });
  };
  async componentDidMount() {
    try {
      const responseCompanies = await fetch('http://127.0.0.1:8000/api/company/create/');
      const companies = await responseCompanies.json();
      const responseTagList = await fetch('http://127.0.0.1:8000/api/tag/create/');
      const tagList = await responseTagList.json();
      this.setState({
        companies,
        tagList,
      });
      console.log(this.state);
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const {
        title,
        start_date,
        end_date,
        estimated_design,
        actual_design,
        estimated_development,
        actual_development,
        estimated_testing,
        actual_testing,
        company,
        tags
    } = this.state;
    return (
      <div className="card card-body mt-4 mb-4">
        <h2>Add project</h2>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Project company</label>
            <select name="company"  className="select form-control"
                   id="company"  onChange={this.onChange} required='required'>
                <option value="" selected="">---------</option>
                {this.state.companies.map(item => (
                    <option value={item.id}>{item.name}</option>
                ))}

            </select>
          </div>
          <div className="form-group">
            <label>Title</label>
            <input
              className="form-control"
              type="text"
              name="title"
              onChange={this.onChange}
              value={title}
              placeholder='title'
            />
          </div>
          <div className="form-group">
            <label>Start date</label>
            <input
              className="form-control"
              type="data"
              name="start_date"
              onChange={this.onChange}
              value={start_date}
              required='required'
            />
          </div>
          <div className="form-group">
            <label>End date</label>
            <input
              className="form-control"
              type="data"
              name="end_date"
              onChange={this.onChange}
              value={end_date}
            />
          </div>
          <div className="form-group">
            <label>estimated_design</label>
            <input
              className="form-control"
              type="number"
              name="estimated_design"
              onChange={this.onChange}
              value={estimated_design}
              placeholder='0'
              required='required'
            />
          </div>
          <div className="form-group">
            <label>actual_design</label>
            <input
              className="form-control"
              type="number"
              name="actual_design"
              onChange={this.onChange}
              value={actual_design}
              placeholder='0'
              required='required'
            />
          </div>
          <div className="form-group">
            <label>estimated_development</label>
            <input
              className="form-control"
              type="number"
              name="estimated_development"
              onChange={this.onChange}
              value={estimated_development}
              placeholder='0'
              required='required'
            />
          </div>
          <div className="form-group">
            <label>actual_development</label>
            <input
              className="form-control"
              type="number"
              name="actual_development"
              onChange={this.onChange}
              value={actual_development}
              placeholder='0'
              required='required'
            />
          </div>
          <div className="form-group">
            <label>estimated_testing</label>
            <input
              className="form-control"
              type="number"
              name="estimated_testing"
              onChange={this.onChange}
              value={estimated_testing}
              placeholder='0'
              required='required'
            />
          </div>
          <div className="form-group">
            <label>actual_testing</label>
            <input
              className="form-control"
              type="number"
              name="actual_testing"
              onChange={this.onChange}
              value={actual_testing}
              placeholder='0'
              required='required'
            />
          </div>
            <div className="form-group">
            <label>Tags</label>
            <select name="tags"  className="select form-control"
                   id="tags"  onChange={this.onChange}>
                <option value="" selected="">---------</option>
                {this.state.tagList.map(item => (
                    <option value={[item.id]}>{item.title}</option>
                ))}

            </select>
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
  { addProject }
)(Form);
