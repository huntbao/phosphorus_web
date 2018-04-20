//author @huntbao
'use strict'

import AppConstants from '../constants/constants'
import AppDispatcher from '../dispatcher/dispatcher'

class ModalAction {

  static closeModal() {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_CLOSE
    })
  }

  static openModal() {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_OPEN
    })
  }

  static openEditCollHostModal(collection) {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_EDIT_COLL_HOST,
      collection: collection
    })
  }

  static openAddFolderModal(collection) {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_CREATE_FOLDER,
      collection: collection
    })
  }

  static openEditCollModal(collection) {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_EDIT_COLLECTION,
      collection: collection
    })
  }

  static openSyncCollModal(collection) {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_SYNC_COLLECTION,
      collection: collection
    })
  }

  static openRunCollModal(collection) {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_RUN_COLLECTION,
      collection: collection
    })
  }

  static openDeleteCollModal(collection) {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_DELETE_COLLECTION,
      collection: collection
    })
  }

  static openEditFolderHostModal(folder) {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_EDIT_FOLDER_HOST,
      folder: folder
    })
  }

  static openSavingBlankURLTip() {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_SAVE_BLANK_URL_TIP
    })
  }

  static openSavingNewURL(tab) {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_SAVE_NEW_REQUEST,
      tab: tab
    })
  }

  static openLeavingDirtyTab(data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_LEAVING_DIRTY_TAB,
      data: data
    })
  }

  static openCreateCollModal() {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_CREATE_COLLECTION
    })
  }

  static openImportCollModal() {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_IMPORT_COLLECTION
    })
  }

  static openClearLocalStorageModal() {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_CLEAR_LOCAL_STORAGE
    })
  }

  static openEditFolderModal(folder) {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_EDIT_FOLDER,
      folder: folder
    })
  }

  static openDeleteFolderModal(folder) {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_DELETE_FOLDER,
      folder: folder
    })
  }

  static openEditReqModal(req) {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_EDIT_REQUEST,
      req: req
    })
  }

  static openMoveReqModal(req) {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_MOVE_REQUEST,
      req: req
    })
  }

  static openDeleteReqModal(req) {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_DELETE_REQUEST,
      req: req
    })
  }

  static openClosingDirtyTab(data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_CLOSING_DIRTY_TAB,
      data: data
    })
  }

  static openRunCollectionReport(data) {
    AppDispatcher.dispatch({
      actionType: AppConstants.MODAL_RUN_COLLECTION_REPORT,
      data: data
    })
  }

}

export default ModalAction
