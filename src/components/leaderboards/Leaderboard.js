import React, { Component } from 'react';
import { connect } from 'react-redux'
import database from '../../firebase/firebase'
import PlayersList from './PlayersList'
import './leaderboards.css'

export class Leaderboard extends Component {

  state = {
    players: [],
    connection: undefined
  }

  componentDidMount() {
    this.setState({
      connection: database.ref(`players`).on('value', (snapshot) => {
                  var players = []
                  Object.keys(snapshot.val()).forEach((playerKey) => {
                  players.push(snapshot.val()[playerKey])
                  })
                  this.setState({
                    players
                  })
      })
    })
  }

  componentWillUnmount() {
    database.ref(`players`).off("value", this.state.connection);
  }

  render() {
    return (
      <div id="leaderboard-container">
        <h3>Leaderboard</h3>
        <PlayersList players={this.state.players} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  opponents: state.opponents
})

export default connect(mapStateToProps)(Leaderboard);
