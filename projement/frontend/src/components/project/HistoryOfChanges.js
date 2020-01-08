import React, { Component } from 'react';
import {Link} from "react-router-dom";

const headers = () => {
  const h = new Headers();
  h.append('Content-Type', 'application/json');
  h.append("Authorization", localStorage.token);
  return h;
};

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
            }
        };
      const res = await fetch('http://127.0.0.1:8000/api/project/history/', config
      );
      console.log(res);
      const history = await res.json();
      this.setState({
        history
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
                    <th width="12%">Change time</th>
                    <th width="12%">Changes</th>
                </tr>
                </thead>
                <tbody>
                {this.state.history.map(item => (
                    <tr>
                        <td>
                            <a href="">{item.project}</a>
                        </td>
                        <td>{'admin'}</td>
                        <td>{item.change_time}</td>
                        <td><Link to={`/project/${item.id}/history`}>view changes</Link></td>
                    </tr>
                 ))}
                </tbody>
            </table>

        </div>
    );
  }
}

export default HistoryOfChanges;
