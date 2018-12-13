import React, { Component } from 'react';
import { SPRITE_SIZE } from '../constants'

import PlayerImg from "../assets/player.png"
import mapJson from '../POWLevel1.json'
import { connect } from 'react-redux'
import { collectItem, digTile } from '../actions/map'
import { updatePlayer, addBean, addRuby } from '../actions/players'


class Player extends Component {
  constructor() {
    super()
    this.state = {
      inInventory: false
    }
  }
  handleKeyDown = (e) => {
    if (!this.state.inInventory) {
      switch(e.keyCode) {
        // left key
        case 37:
          return this.props.handleMovement(this.props.player, { left: this.props.player.left - SPRITE_SIZE, top: this.props.player.top })
        // up key
        case 38:
          return this.props.handleMovement(this.props.player, { top: this.props.player.top - SPRITE_SIZE, left: this.props.player.left  })
        // right key
        case 39:
          return this.props.handleMovement(this.props.player, { left: this.props.player.left + SPRITE_SIZE, top: this.props.player.top  })
        // down key
        case 40:
          return this.props.handleMovement(this.props.player, { top: this.props.player.top + SPRITE_SIZE, left: this.props.player.left  })
        case 69:
          console.log(this.props);
          return this.attemptDig(this.props.player.left, this.props.player.top)
        case 73:
          this.setState({inInventory: true})
          return this.props.handlePopupInventory()
        default:
          console.log(e.keyCode);
      }
    } else {
        return this.inventoryHandleKeyDown(e)
    }
  }

  inventoryHandleKeyDown(e) {
    switch(e.keyCode) {
      case 73:
        this.setState({inInventory: false})
        return this.props.closeModal()
      default:
        console.log(e.keyCode);
      }
    }
  digDatDing = (x, y) => {
    var dug = document.createElement("div")
    dug.setAttribute('class', 'dug-up-tile')
    dug.setAttribute('style', `left:${x}px; top:${y}px` )

    document.getElementsByClassName('tiled-map')[0].appendChild(dug)
  }

  attemptDig = (x, y) => {
    // check if diggable and
      const tile = this.props.map.minable.filter((object) => object.x === x && object.y === y)[0]
      if (tile.visible === false) {
        console.log('you can dig');
        this.props.digTile(tile)
        this.digDatDing(x, y)
      } else {
        console.log('no digging!');
      }
    // find collectable

    const item = this.props.map.collectables.filter((object) => object.x === x && object.y === y)[0]
    if (item !== undefined) {
      console.log(item.type)
      this.props.collectItem(item)

      switch (item.type) {
        case 'ruby':
          return this.props.addRuby(item)
        case 'bean':
          return this.props.addBean(item)
        default:
          return
      }
    }
    // dig
  }

  componentDidMount() {
    window.addEventListener('keydown', (e) => {
      e.preventDefault()
      this.handleKeyDown(e)
    })
  }

  render() {
    return (
      <div id={this.props.player.name}
        style={{
          position: 'absolute',
          width: '16px',
          top: this.props.player.top,
          left: this.props.player.left,
          height: '16px',
          backgroundPosition: 'center',
          backgroundImage: `url(${PlayerImg})`,
          zIndex: 1
        }}
      >
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  map: state.map
})

const mapDispatchToProps = (dispatch) => ({
  collectItem: (item) => dispatch(collectItem(item)),
  digTile: (tile) => dispatch(digTile(tile)),
  updatePlayer: (player, updates) => dispatch(updatePlayer(player, updates))
  addRuby: (item) => dispatch(addRuby(item))
  addBean: (item) => dispatch(addBean(item))
})

export default connect(mapStateToProps, mapDispatchToProps)(Player);
