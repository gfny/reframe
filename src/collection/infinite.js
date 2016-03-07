import React from 'react'
import ReactDOM from 'react-dom'
import Collection from './index.js'
import LoadingContainer, { LoadingState, PresentState, EmptyState } from 'snax/lib/containers/loading'
import InfiniteContainer from '../containers/infinite'
import { uid } from '../utils/random'
import FilterContext from '../utils/filter_context'
import FilterContextHelper from '../utils/filter_context_helper'
import {clientFactory} from '../api'

export default class InfiniteCollection extends React.Component {
  static contextTypes = {
    store: React.PropTypes.object
  }

  static defaultProps = {
    id: uid(),
    client: clientFactory()
  }

  constructor(props) {
    super(props)
    this.state = {
      view: 'table',
      sort: props.sort || { key: 'id', order: 'asc' },
      filters: {},
      showFilters: false
    }
  }

  render() {
    return (
      <InfiniteContainer ref="container" {...this.getContainerOptions()}>
        <LoadingCollection {...this.getCollectionProps()} />
      </InfiniteContainer>
    )
  }

  getContainerOptions() {
    return {
      endpoint: this.props.endpoint,
      endpointOptions: this.getQuery(),
      client: this.props.client,
      injectAs: "records"
    }
  }

  getCollectionProps() {
    return {
      ...this.props,
      ...this.getCallbacks(),
      collectionActions: [
        { key: 'refresh', icon: 'refresh', label: 'Refresh', handler: this.refresh.bind(this) },
        ...this.props.collectionActions
      ],
      sort: this.state.sort,
      filterValues: this.state.filters,
      showFilters: this.state.showFilters
    }
  }

  getCallbacks() {
    return {
      onClickColumnHeader: col => {
        if(col === this.state.sort.key) {
          const order = this.state.sort.order === 'asc' ? 'desc' : 'asc'
          const key = this.state.sort.key
          this.setState({sort: {key, order}})
        }
        else {
          const order = 'asc'
          const key = col
          this.setState({sort: {key, order}})
        }
        _.defer(()=>this.refs.container.reset())
      },
      onFilterChange: filters => {
        this.setState({filters})
        _.defer(()=>this.refs.container.reset())
      },
      onShowFilters: () => this.setState({showFilters: true}),
      onHideFilters: () => this.setState({showFilters: false})
    }
  }

  getQuery() {
    const sort = {[this.state.sort.key]: this.state.sort.order}
    const query = this.state.filters
    const parameters = FilterContextHelper.toQueryParams(new FilterContext({sort, query}))
    return parameters
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  refresh() {
    _.defer(()=>this.refs.container.reset())
  }
}

const LoadingCollection = props => {
  return (
    <LoadingContainer content={props.status === 'ready' ? props.records : undefined} isLoading={props.status === 'awaiting'}>
      <LoadingState>
        <div>
          <Collection {...props} records={[]} empty="Loading..." />
          <div className="ui active centered inline loader"></div>
        </div>
      </LoadingState>
      <EmptyState>
        <Collection {...props} records={[]} empty="There are no records." />
      </EmptyState>
      <PresentState>
        <div>
          <Collection {...props} />
          { !props.isAtEnd ? <div className="ui active centered inline loader"></div> : null }
        </div>
      </PresentState>
    </LoadingContainer>
  )
}