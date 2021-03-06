import React, { Component } from 'react';
import { connect } from 'react-redux'
import { startAddInventoryItem, startDebitPlayer } from '../../actions/auth'
import './shop.css'

import ShopList from './ShopList'
import ShopMessage from './ShopMessage'

export class Shop extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selected: undefined
    }
  }


  handlePurchase = () => {
      this.props.startAddInventoryItem(this.state.selected.type, this.state.selected)
      this.props.startDebitPlayer(this.state.selected.properties[0].price)
  }

  handleSelect = (item) => {
    this.setState({
      properties: item.properties,
      selected: item,
      buttonDisplay: ''
    })
  }

  render() {
    return (
      <div id="muxworthys-bonanza">
        <div className="popup-header">Welcome to Muxworthy's General Store!</div>
        <ShopList inventory={this.props.shop.inventory} handleSelect={this.handleSelect}/>
        <ShopMessage item={this.state.selected} cash={this.props.player.cash} handlePurchase={this.handlePurchase}/>
      </div>
    );
  }

}

export const mapDispatchToProps = (dispatch) => ({
  startAddInventoryItem: (itemRef, item) => dispatch(startAddInventoryItem(itemRef,item)),
  startDebitPlayer: (cash) => dispatch(startDebitPlayer(cash))
})

export const mapStateToProps = (state) => ({
  player: state.auth,
  shop: state.shop
})

export default connect(mapStateToProps, mapDispatchToProps)(Shop)
