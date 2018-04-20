//author @huntbao
'use strict'
import './reqbuilderurlparams.styl'
import React from 'react'
import classNames from 'classnames'
import KeyValue from '../keyvalue/keyvalue.jsx'
import ReqURLParamsAction from '../../actions/requrlparamsaction'
import ReqTabAction from '../../actions/reqtabaction'

class ReqBuilderURLParams extends React.Component {

  render() {
    let className = classNames({
      hide: this.props.builders.activeTabName !== 'URL Params'
    })
    let modClass = 'mod-reqbuilder-urlparams ' + (this.props.modClass || '')
    let urlParams
    if (this.props.builders.paramKVs.length) {
      let kvProps = {
        kvs: this.props.builders.paramKVs,
        toggleKV: (rowIndex) => {
          this.toggleURLParamsKV(rowIndex)
        },
        addKV: () => {
          this.addURLParamsKV()
        },
        removeKV: (rowIndex) => {
          this.removeURLParamsKV(rowIndex)
        },
        changeKVKey: (rowIndex, value) => {
          this.changeURLParamsKVKey(rowIndex, value)
        },
        changeKVValue: (rowIndex, value) => {
          this.changeURLParamsKVValue(rowIndex, value)
        }
      }
      urlParams = <KeyValue {...kvProps}/>
    } else {
      urlParams = (
        <div>
          <em className="glyphicon glyphicon-exclamation-sign"></em>
          <span>This request url has no parameters.</span>
        </div>
      )
    }
    return (
      <div className={className}>
        <div className={modClass}>
          {urlParams}
        </div>
      </div>
    )
  }

  toggleURLParamsKV(rowIndex) {
    ReqURLParamsAction.toggleURLParamsKV(rowIndex)
  }

  addURLParamsKV() {
    ReqURLParamsAction.addURLParamsKV()
  }

  removeURLParamsKV(rowIndex) {
    ReqURLParamsAction.removeURLParamsKV(rowIndex)
  }

  changeURLParamsKVKey(rowIndex, value) {
    ReqURLParamsAction.changeURLParamsKVKey(rowIndex, value)
    ReqTabAction.setDirtyTab()
  }

  changeURLParamsKVValue(rowIndex, value) {
    ReqURLParamsAction.changeURLParamsKVValue(rowIndex, value)
    ReqTabAction.setDirtyTab()
  }

}


export default ReqBuilderURLParams
