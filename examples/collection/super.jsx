import React from 'react'
import ReactDOM from 'react-dom'
import SuperCollection from 'collection/super'
import Logger from 'utils/logger'

const Actions = {
  reload: () => {Logger.log("Clicked Reload")},
  export: () => {Logger.log("Clicked Export")},
  delete: id => {Logger.log("Clicked Delete", id)},
  edit: id => {Logger.log("Clicked Edit", id)}
}

export default class SuperCollectionExamples extends React.Component {
  render() {
    return (
      <div>
        <h1>Super Collection</h1>
        <SuperCollection {...this.getCollection()} />
      </div>
    )
  }

  getTable() {
    return {
      columns: [
        { label: 'ID', key: 'id', primary: false, visible: false, cell: 'id' },
        { label: 'First Name', key: 'first_name', primary: true, visible: true },
        { label: 'Last Name', key: 'last_name', primary: true, visible: true }
      ],
      records: this.getSortedRecords(),
      sort: this.state.table.sort,
      collectionActions: [
        { key: 'refresh', icon: 'refresh', label: 'Refresh', handler: Actions.reload },
        { key: 'export', icon: 'download', label: 'Export', handler: Actions.export }
      ],
      recordActions: [
        { key: 'delete', icon: 'times', label: 'delete', handler: Actions.delete },
        { key: 'edit', icon: 'times', label: 'edit', handler: Actions.edit }
      ],
    }
  }
}