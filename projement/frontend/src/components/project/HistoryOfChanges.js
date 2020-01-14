import React, { Component } from 'react';
import {Link} from "react-router-dom";
import PropTypes from "prop-types";



class HistoryOfChanges extends Component {

  state = {
    history: []
  };

  async componentDidMount() {
    try {
        const config = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.token}`
            }, responseType: 'json'
        };
      const response = await fetch(`http://127.0.0.1:8000/api/hist/${this.props.match.params.id}/`, config
      );
      const history = await response.json();
      this.setState({
        history: history.history
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {

    return (
        <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover">
                <thead>
                <tr>
                    <th width="12%">Project</th>
                    <th width="12%">Owner</th>
                    <th width="12%">Changes</th>
                    <th width="12%">Actual design</th>
                    <th width="12%">Actual development</th>
                    <th width="12%">Actual testing</th>
                    <th width="12%">Detail</th>
                </tr>
                </thead>
                <tbody>
                {this.state.history.map(item => (

                    <tr>
                        <td>
                            <a href="">{item.title}</a>
                        </td>
                        <td>{item.changed_by}</td>
                        <td>{item.history_date}</td>
                        <td>{item.actual_design}</td>
                        <td>{item.actual_development}</td>
                        <td>{item.actual_testing}</td>
                        <td><Link to={`/project/${item.id}/initial-data`}>initial data</Link></td>
                    </tr>
                 ))}
                </tbody>
            </table>

        </div>
    );
  }
}

export default HistoryOfChanges;