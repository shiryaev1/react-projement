import React, { Component } from 'react';
import axios from 'axios';

import 'whatwg-fetch';

class ProjectUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
             additional_hour_design: "0.00",
             additional_hour_development: "0.00",
             additional_hour_testing: "0.00"
        };
    }

    changeHandler = e => {
      this.setState({[e.target.name]: e.target.value});
    };

    handleSubmit = event => {
        event.preventDefault();
        const {additional_hour_design, additional_hour_development, additional_hour_testing} = this.state;
        const body = {additional_hour_design, additional_hour_development, additional_hour_testing};
        this.setState({
            additional_hour_design: "0.00",
            additional_hour_development: "0.00",
            additional_hour_testing: "0.00"
        });

        axios
            .put(`http://127.0.0.1:8000/api/project/${this.props.match.params.id}/update/`, body)
            .then(res => {
                console.log(res);
                console.log(this.state);

            });

    };
    render() {
        const {additional_hour_design, additional_hour_development, additional_hour_testing} = this.state;
        return (

            <div className="card card-body mt-4 mb-4">
            <h2>Update project</h2>
            <form onSubmit={this.handleSubmit}>

              <div className="form-group">
                <label>additional_hour_design</label>
                <input
                  className="form-control"
                  type="number"
                  name="additional_hour_design"
                  onChange={this.changeHandler}
                  value={additional_hour_design}
                />
              </div>
              <div className="form-group">
                <label>additional_hour_development</label>
                <input
                  className="form-control"
                  type="number"
                  name="additional_hour_development"
                  onChange={this.changeHandler}
                  value={additional_hour_development}
                />
              </div>
              <div className="form-group">
                <label>additional_hour_testing</label>
                <input
                  className="form-control"
                  type="number"
                  name="additional_hour_testing"
                  onChange={this.onChange}
                  value={additional_hour_testing}
                />
              </div>


              <div className="form-group">
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </form>
            </div>
        )
    }
}

export default ProjectUpdate;