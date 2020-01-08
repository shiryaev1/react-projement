import React, { Component } from 'react';
import axios from 'axios';

import 'whatwg-fetch';

class TagUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.match.params.title,
        };
    }

    changeHandler = e => {
      this.setState({[e.target.name]: e.target.value});
    };

    handleSubmit = event => {
        event.preventDefault();
        const tags = {
            title: this.state.title
        };
        this.setState({
           title: ""
        });
        axios
            .put(`http://127.0.0.1:8000/api/tag/${this.props.match.params.id}/update/`, tags, {headers:{
                    'Authorization': `Token ${localStorage.token}`
                }})
            .then(res => {
                console.log(res);
            });
    };
    render() {
        const {title} = this.state;
        return (
            <div className="card card-body mt-4 mb-4">
                <h2>Update tags</h2>
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      onChange={this.changeHandler}
                      value={title}
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

export default TagUpdate;