//author @huntbao
'use strict'

import async from 'async'
import _ from 'lodash'
import URL from 'url'
import Util from '../../libs/util'
import ReqTabStore from '../../stores/reqtabstore'
import ReqConTabStore from '../../stores/reqtabconstore'
import ModalAction from '../../actions/modalaction'
import SideTabAction from '../../actions/sidtabaction'

let Requester = {

  fetch(callback) {
    let tabState = ReqTabStore.getAll().reqTab
    let tabConState = ReqConTabStore.getAll().reqTabCon
    let tabIndex = tabState.activeIndex
    let tab = tabState.tabs[tabIndex]
    let tabCon = tabConState.reqCons[tabIndex]
    let method = tab.method
    let url = tab.rurl
    let headers = {}
    tabCon.builders.headerKVs.map((kv) => {
      if (kv.key && kv.value) {
        headers[kv.key] = kv.value
      }
    })
    let fetchOptions = {
      credentials: 'include',
      method: method,
      headers: headers
    }
    // deal form-data
    let bodyType = tabCon.builders.bodyType
    if (method !== 'GET') {
      switch (bodyType.type) {
        case 'form-data':
          let fd = new FormData()
          tabCon.builders.bodyFormDataKVs.map((kv) => {
            if (kv.key) {
              if (kv.valueType === 'text' && kv.value) {
                fd.append(kv.key, kv.value)
              } else if (kv.valueType === 'file' && kv.fileInput && kv.fileInput.files[0]) {
                fd.append(kv.key, kv.fileInput.files[0])
              }
            }
          })
          fetchOptions.body = fd
          break
        case 'x-www-form-urlencoded':
          fetchOptions.body = Util.serializeXFormData(tabCon.builders.bodyXFormKVs)
          break
        case 'raw':
          if (bodyType.value === 'application/json') {
            fetchOptions.body = this.__getJSON(tabCon.builders.bodyRawJSONKVs, bodyType.jsonType)
          } else {
            fetchOptions.body = tabCon.builders.bodyRawData
          }
          break
        case 'binary':
          let binaryFileInput = tabCon.builders.bodyBinaryFileInput
          if (binaryFileInput && binaryFileInput.files.length === 1) {
            let reader = new FileReader()
            reader.onload = (e) => {
              fetchOptions.body = reader.result
              this.__fetch(url, fetchOptions, callback)
            }
            reader.readAsBinaryString(binaryFileInput.files[0])
            return
          }
          break
        default:
          break
      }
    }
    this.__fetch(url, fetchOptions, callback)
  },

  __fetch(url, options, callback) {
    // let res
    // let startTime = Date.now()
    // fetch(url, options)
    //   .then((response) => {
    //     res = response
    //     res.time = Date.now() - startTime
    //     return response.text()
    //   })
    //   .then((data) => {
    //     callback(res, data)
    //   })
    //   .catch((err) => {
    //     callback(res, err)
    //   })
    const sendId = Date.now()
    // request data
    let data = {
      sendId,
      url,
      data: options.body ? JSON.parse(options.body) : {},
      headers: options.headers,
      method: options.method
    }
    // add response listener
    document.addEventListener('sendto-xhrpt-ext-res', function (e) {
      if (!e.detail || !e.detail.reqData || e.detail.reqData.sendId !== sendId) return;
      // e.detail.reqData is request data
      // e.detail.resData is response data
      console.log(e.detail)
      callback(e.detail, e.detail.resData)
    }, false)
    // send to extension
    document.dispatchEvent(new CustomEvent('sendto-xhrpt-ext', {detail: data}))
  },

  __getJSON(bodyRawJSONKVs, jsonType) {
    let json
    let getData = (kvs, container) => {
      kvs.forEach((kv) => {
        if (kv.key) {
          if (kv.valueType === 'object') {
            container[kv.key] = {}
            getData(kv.values, container[kv.key])
          } else if (kv.valueType === 'array') {
            container[kv.key] = []
            if (kv.childValueType === 'object') {
              kv.values.forEach((skv, index) => {
                container[kv.key][index] = {}
                getData(skv.values, container[kv.key][index])
              })
            } else {
              kv.values.forEach((skv) => {
                if (skv.checked && skv.value !== '') {
                  container[kv.key].push(Util.getValueByType(skv.value, kv.childValueType))
                }
              })
            }
          } else {
            let value = Util.getValueByType(kv.value, kv.valueType)
            if (Array.isArray(container)) {
              let item = {}
              item[kv.key] = value
              container.push(item)
            } else {
              container[kv.key] = value
            }
          }
        }
      })
    }
    if (jsonType === 'object') {
      json = {}
      getData(bodyRawJSONKVs, json)
    } else {
      if (bodyRawJSONKVs === null) {
        json = null
      } else {
        let item = bodyRawJSONKVs[0]
        if (jsonType === 'array') {
          json = []
          let arrIndex = 0
          if (item.childValueType === 'object') {
            item.values.forEach((kv) => {
              if (kv.checked) {
                json[arrIndex] = {}
                getData(kv.values, json[arrIndex])
                arrIndex++
              }
            })
          } else {
            item.values.forEach((kv) => {
              if (kv.checked) {
                json.push(Util.getValueByType(kv.value, kv.valueType))
              }
            })
          }
        } else {
          json = Util.getValueByType(item.value, item.valueType)
        }
      }
    }
    return JSON.stringify(json)
  },

  runCollection(collection, stores, callback) {
    let totalReqsNum = collection.requests.length
    let cancelledReqsNum = 0
    let succeedReqsNum = 0
    let failedReqsNum = 0
    collection.requests.forEach((req) => {
      req.reqStatus = 'waiting'
    })
    let getResStatus = (req, savedRequest, jsonData) => {
      let result
      if (req.isNEI) {
        if (!req.outputs.length) {
          result = true
        }
      } else {
        if (!savedRequest['res_checker_data'].length) {
          result = true
        }
      }
      if (!result) {
        let resCheckerKVs = Util.convertNEIOutputsToJSON(req, collection)
        let checkedKVs = (kvs) => {
          kvs.forEach((kv) => {
            kv.checked = true
            checkedKVs(kv.values)
          })
        }
        checkedKVs(resCheckerKVs)
        let paramsInfo = Util.getNEIParamsInfo(req.outputs, collection)
        result = Util.checkResponseResult(resCheckerKVs, paramsInfo.valueType, jsonData) === true
      }
      if (result) {
        succeedReqsNum++
        return 'succeed'
      } else {
        failedReqsNum++
        return 'failed'
      }
    }
    let sendReq = (req, cb) => {
      req.reqStatus = 'fetching'
      callback() // update status
      let savedRequest = _.find(stores.requests, (r) => {
        return r.id === req.id
      })
      savedRequest = savedRequest || {}
      let fetchUrl = this.__getFetchUrl(req, savedRequest, collection, stores)
      let fetchOptions = this.__getFetchOptions(req, savedRequest, collection, stores)
      this.__fetch(fetchUrl, fetchOptions, (res, data) => {
        if (!res || !res.ok) {
          req.reqStatus = 'failed'
          failedReqsNum++
        } else {
          try {
            // res checker
            req.reqStatus = getResStatus(req, savedRequest, JSON.parse(data))
          } catch (err) {
            req.reqStatus = 'failed'
            failedReqsNum++
          }
        }
        callback() // update status
        cb()
      })
    }
    let index = 0
    async.eachSeries(collection.requests, (req, cb) => {
      index++
      if (req.reqStatus) {
        req.reqStatus = 'fetching'
        SideTabAction.setLoadingTip({
          show: true,
          text: `Send request ${index}...`
        })
        // every request has 500ms delayed
        setTimeout(() => {
          sendReq(req, cb)
        }, 500)
      } else {
        cancelledReqsNum++
        cb()
      }
    }, (err) => {
      // all requests are done
      // show report
      SideTabAction.setLoadingTip({
        show: false
      })
      ModalAction.openRunCollectionReport({
        total: totalReqsNum,
        cancelled: cancelledReqsNum,
        succeed: succeedReqsNum,
        failed: failedReqsNum
      })
    })
  },

  __getFetchUrl(req, savedRequest, collection, stores) {
    let url
    let savedURLParams = savedRequest['url_params']
    if (req.isNEI) {
      let path = req.path
      if (Util.isNoBodyMethod(req.method)) {
        let urlParams = []
        let savedParam
        req.inputs.forEach((input) => {
          savedParam = _.find(savedURLParams, (p) => {
            return !p.is_pv && p.key === input.name
          })
          urlParams.push({
            checked: true,
            key: input.name,
            value: savedParam && savedParam.value || ''
          })
        })
        url = Util.getURLByQueryParams(path, urlParams)
      } else {
        url = path
      }
    } else {
      url = savedRequest.url
    }
    let urlParams = Util.getUrlParams(url)
    let savedPV
    urlParams.forEach((urlParam) => {
      if (urlParam.isPV) {
        savedPV = _.find(savedURLParams, (p) => {
          return p.is_pv && p.key === urlParam.key
        })
        url = url.replace(':' + urlParam.key, savedPV && savedPV.value)
      }
    })
    let result = URL.parse(url)
    if (result.host) {
      return url
    }
    let hosts = stores.hosts || {}
    return (hosts.folders[req.folderId] || hosts.collections[req.collectionId] || '') + url
  },

  __getFetchOptions(req, savedRequest, collection, stores) {
    let options = {
      credentials: 'include',
      method: req.method,
      headers: {}
    }
    let getNEIBodyRawJSON = () => {
      let bodyRawJSONKVs = Util.convertNEIInputsToJSON(req, collection, savedRequest['body_raw_json'], {
        checked: true,
        key: '',
        value: '',
        valueType: 'string',
        childValueType: 'string'
      })
      return this.__getJSON(bodyRawJSONKVs, Util.getNEIParamsInfo(req.inputs, collection).valueType)
    }
    let getNEIXFormData = () => {
      let savedXFormData = savedRequest['body_x_form_data'] || {}
      let paramArr = []
      _.forEach(req.inputs, (input, index) => {
        let savedField = _.find(savedXFormData, (kv) => {
          return kv.key === input.name
        })
        paramArr.push(encodeURIComponent(input.name) + '=' + encodeURIComponent(savedField && savedField.value || ''))
      })
      return paramArr.join('&')
    }
    let getBodyRawJSON = () => {
      let savedBodyRawJSONKVs = savedRequest['body_raw_json'] || []
      return this.__getJSON(savedBodyRawJSONKVs, {
        jsonType: savedRequest['body_type']['json_type']
      })
    }
    let getXFormData = () => {
      let savedXFormData = savedRequest['body_x_form_data'] || {}
      return Util.serializeXFormData(savedXFormData)
    }
    let getFormData = () => {
      let savedFormData = savedRequest['body_form_data'] || {}
      let fd = new FormData()
      _.forEach(savedFormData, (kv) => {
        if (kv.checked && kv.key) {
          fd.append(kv.key, kv.value)
        }
      })
      return fd
    }
    if (!Util.isNoBodyMethod(req.method)) {
      if (req.isNEI) {
        if (req.isRest) {
          options.headers['Content-Type'] = 'application/json'
          options.body = getNEIBodyRawJSON()
        } else {
          options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
          options.body = getNEIXFormData()
        }
        req.headers && req.headers.forEach((header) => {
          options.headers[header.name] = header.defaultValue
        })
      } else {
        // deal request body
        let bodyType = savedRequest['body_type']
        // while bat running collection's requests, binary type is not taken into account
        switch (bodyType.type) {
          case 'raw':
            if (bodyType.value === 'application/json') {
              options.body = getBodyRawJSON()
            } else {
              options.body = savedRequest['body_raw_data']
            }
            break

          case 'x-www-form-urlencoded':
            options.body = getXFormData()
            break

          case 'form-data':
            options.body = getFormData()
            break

          default:
            break
        }
      }
    }
    if (!req.isNEI) {
      // deal not nei request's headers
      let savedHeaders = savedRequest['headers']
      savedHeaders.forEach((header) => {
        if (header.checked && header.key) {
          options.headers[header.key] = header.value
        }
      })
    }
    return options
  }
}

export default Requester
