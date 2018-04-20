//author @huntbao

const lsKey = 'phosphorus_web_ls_key'
const getLocalStorage = () => {
  return localStorage[lsKey] || '{}'
}
const clearLocalStorage = () => {
  localStorage[lsKey] = '{}'
}

class StorageArea {

  static get(keys, callback) {
    const result = {}
    const localData = JSON.parse(getLocalStorage())
    if (typeof keys === 'string') {
      result[keys] = localData[keys]
    } else if (Array.isArray(keys)) {
      keys.forEach(key => {
        result[key] = localData[key]
      })
    }
    callback(result)
  }

  static set(data, callback) {
    let localData = JSON.parse(getLocalStorage())
    Object.keys(data).forEach(key => {
      localData[key] = data[key]
    })
    localStorage[lsKey] = JSON.stringify(localData)
    callback && callback()
  }

  static clear(callback) {
    clearLocalStorage()
    callback && callback()
  }

}

/**
 * saved data structure
 * {
 *      hosts: {
 *          collections: {
 *              collection_id: xxx,
 *              ...
 *          },
 *          folders: {
 *              folder_id: xxx
 *              ...
 *          },
 *      },
 *
 *      // this is request data, request's meta data is in the collections
 *      requests: {
 *          request_id: {
 *              // it's fields are declared in request_data_map.js
 *          }
 *      },
 *
 *      collections: {
 *          // it's fields are declared in sidetabstore.js@DEFAULT_COLLECTION
 *      }
 * }
 *
 *
 */


export default StorageArea
