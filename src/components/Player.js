import React, { Component } from 'react';
import { SPRITE_SIZE } from '../constants'
import PlayerImg from "../assets/player.png"
import PickImg from "../assets/pick.png"
import { connect } from 'react-redux'
import { collectItem, digTile, unDigTile } from '../actions/map'
import { startAddInventoryItem, startUpdatePlayer, startCreditPlayer } from '../actions/auth'
import { startSendNewsfeedMessage } from '../actions/newsfeed'
import SpinningCoin from '../assets/spinning_coin_16px.gif'


export class Player extends Component {

  constructor(props) {
    super(props)
    this.state = {
      inInventory: false,
      level: this.getPlayerLevel(props)
    }
  }

  getPlayerLevel = () => {
    var questions = 0

    if (this.props.player.questions !== undefined ) {
      questions = Object.keys(this.props.player.questions).length
    }

    var sessionQuestions = this.props.player.sessionQuestions.length
    var level =  (questions + sessionQuestions) / 5
    return Math.floor(level)
  }

  updatePlayerLevel = () => {
    var currentLevel = this.props.player.level
    var newLevel = this.getPlayerLevel()
    if (newLevel > currentLevel) {
      this.props.startUpdatePlayer({ level: newLevel} )
      this.props.startSendNewsfeedMessage(
        `has levelled up!!`
      )
    }
  }

  handleKeyDown = (e) => {
    if (!this.state.inInventory && !this.props.notOnMap) {
      switch(e.keyCode) {
        // left key
        case 37:
          return this.props.handleMovement({ left: this.props.player.left - SPRITE_SIZE, top: this.props.player.top })
        // up key
        case 38:
          return this.props.handleMovement({ top: this.props.player.top - SPRITE_SIZE, left: this.props.player.left  })
        // right key
        case 39:
          return this.props.handleMovement({ left: this.props.player.left + SPRITE_SIZE, top: this.props.player.top  })
        // down key
        case 40:
          this.updatePlayerLevel()
          return this.props.handleMovement({ top: this.props.player.top + SPRITE_SIZE, left: this.props.player.left  })
        case 69:
          return this.attemptDig(this.props.player.left, this.props.player.top)
        case 73:
          return this.props.handlePopupInventory()
        case 81:
          return this.props.checkSign(this.props.player.left, this.props.player.top)
        case 88:
          return this.props.handlePopupInstructions()
        case 84:
          return document.getElementById('messagebox').focus()
        default:
          console.log(e.keyCode);
      }
    } else {
        return this.popUpHandleKeyDown(e)
    }
  }

  popUpHandleKeyDown(e) {
    if (this.state.inInventory ) {
      switch(e.keyCode) {
        case 73:
          this.setState({ inInventory: false })
          return this.props.closeModal()
        default:
          console.log(e.keyCode);
      }
    }
  }

  coinAnimation = () => {
    var timeout = 2;
    this.setState({coinCollected: true})
    setTimeout(this.hideAnimation, 1600)
  }

  hideAnimation = () => {
    this.setState({coinCollected: false})
  }

  possibleCash(chance = Math.random()) {
    var coinCount = 0
    if (chance < 0.01) {
      coinCount += 25
    } else if (chance < 0.1) {
      coinCount += 5
    } else if (chance < 0.25) {
      coinCount += 1
    }
    if (coinCount !== 0) {
      this.props.startCreditPlayer(coinCount)
      this.coinAnimation()
    }
  }

  digDatDing = (x, y) => {
    this.possibleCash()

    var dug = document.createElement("div")
    dug.setAttribute('class', 'dug-up-tile')
    dug.setAttribute('id', x+y)
    dug.setAttribute('style', `left:${x}px; top:${y}px` )
    document.getElementsByClassName("map")[0].appendChild(dug)
    setTimeout(this.unDigDatDing, 5000, x, y)
  }

  unDigDatDing = (x, y) => {
    const tile = this.props.map.minable.filter((object) => object.x === x && object.y === y)[0]
    const element = document.getElementById(x+y)
    element.parentNode.removeChild(element)
    this.props.unDigTile(tile)
  }

  attemptDig = (x, y) => {
    const tile = this.props.map.minable.filter((object) => object.x === x && object.y === y)[0]
    if (tile.visible === false) {
      console.log('you can dig');
      this.props.digTile(tile)
      this.digDatDing(x, y)
    } else {
      console.log('no digging!');
    }

    const item = this.props.map.collectables.filter((object) => object.x === x && object.y === y)[0]
    this.checkItem(item)
  }

  checkItem(item) {
    if (item !== undefined) {
      this.props.collectItem(item)
      this.props.startAddInventoryItem(item.type, item)
      this.setState({inPopUp: true})
      this.props.startSendNewsfeedMessage(`found a ${item.type}!`)
      this.props.handlePopupMessage(`You found a ${item.type}!`, item)
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', (e) => {
      if(!this.props.onFocus){
        e.preventDefault()
        this.handleKeyDown(e)
      }
    })
  }

  render() {
      if (this.state.coinCollected) {
        var button = <div id="coinContainer"
                  style={{
                    position: 'absolute',
                    width: '16px',
                    height: '16px',
                    backgroundImage: `url(${SpinningCoin})`,
                    backgroundPosition: 'center',
                    zIndex: 1,
                    top: this.props.player.top - 16,
                    left: this.props.player.left
                  }}
                 >
        </div>
      } else { var button = undefined }

      return (
      <div>

      {button}
      <div id="player_pick"
        style={{
          position: 'absolute',
          width: '16px',
          top: this.props.player.top,
          left: this.props.player.left + 8,
          height: '16px',
          backgroundPosition: 'center',
          rotate: 90,
          backgroundImage: `url(${PickImg})`
        }}
      >
      </div>
      <div id="player"
        style={{
          position: 'absolute',
          width: '16px',
          top: this.props.player.top,
          left: this.props.player.left,
          height: '16px',
          backgroundPosition: 'center',
          backgroundImage: `url(${PlayerImg})`
        }}
      >
      </div>

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  map: state.map,
  player: state.auth
})

const mapDispatchToProps = (dispatch) => ({
  collectItem: (item) => dispatch(collectItem(item)),
  digTile: (tile) => dispatch(digTile(tile)),
  unDigTile: (tile) => dispatch(unDigTile(tile)),
  startUpdatePlayer: (updates) => dispatch(startUpdatePlayer(updates)),
  startAddInventoryItem: (itemRef, item) => dispatch(startAddInventoryItem(itemRef, item)),
  startSendNewsfeedMessage: (message) => dispatch(startSendNewsfeedMessage(message)),
  startCreditPlayer: (amount) => dispatch(startCreditPlayer(amount)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Player);
