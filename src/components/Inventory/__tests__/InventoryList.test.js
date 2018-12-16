import React from 'react';
import { shallow } from 'enzyme'
import InventoryList from '../InventoryList'
import player from '../../../test/fixtures/playerWithInventory'

let wrapper


beforeEach(function() {
  const inventory = player.inventory
  wrapper = shallow(
    <InventoryList
      inventory={inventory}
    />
  )
});

test('it renders InventoryListItems', () => {
  const renderer = new ShallowRenderer()
  const inventory = {
    ruby: ['ruby1'],
    bean: [],
    key: [],
    miscellaneous: []
  }


test('it renders InventoryList', () => {
  expect(wrapper).toMatchSnapshot();
})
