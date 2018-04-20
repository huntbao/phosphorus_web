//author @huntbao
'use strict'
import './sidetab.styl'
import React from 'react'
import SideTabAction from '../../actions/sidtabaction'
import classNames from 'classnames'

class SideTab extends React.Component {

  render() {
    let historyClass = classNames({
      active: this.props.tabs.activeTabName === 'History'
    })
    let collectionsClass = classNames({
      active: this.props.tabs.activeTabName === 'Collections'
    })
    return (
      <div className="mod-tab">
        <ol className="clr" onClick={(e) => {
          this.clickHandler(e)
        }}>
          <li className={collectionsClass} data-name="Collections">Collections</li>
        </ol>
      </div>
    )
  }

  clickHandler(evt) {
    if (evt.target.classList.contains('active')) return
    let activeTabName = evt.target.dataset.name
    SideTabAction.switchTab(activeTabName)
  }

}


export default SideTab
