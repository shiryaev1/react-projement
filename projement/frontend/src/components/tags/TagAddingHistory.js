import React, { Component, Fragment } from 'react';
import {Link} from "react-router-dom";


class TagAddingHistory extends Component {
  state = {
    history: []
  };

  async componentDidMount() {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/tags/history/');
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
        <Fragment>
        <h2>Tags History</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>TAG</th>
              <th>PROJECT</th>
              <th>TIME TO ADD</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.state.history.map(item => (
              <tr key={item.id}>
                <td>{item.tag}</td>
                <td>{item.project}</td>
                <td>{item.time_to_add}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fragment>
    );
  }
}

export default TagAddingHistory;