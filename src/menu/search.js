import React from 'react'
import Typeahead from '../ui/typeahead'
import Config from '../utils/config'

export default class Search extends React.Component {

  static propTypes = {
    endpoint:      React.PropTypes.string,
    resultField:   React.PropTypes.string,
    query:         React.PropTypes.string,
    itemComponent: React.PropTypes.element,
    placeholder:   React.PropTypes.string
  }

  static defaultProps = {
    placeholder: 'Search'
  }

  static contextTypes = {
    history: React.PropTypes.object
  }

  constructor(props) {
    super(props)

    this.endpoint = props.endpoint || Config.get('menu.search.p', '/search')
    this.resultField = props.resultField || Config.get('menu.search.resultField', 'results')
    this.query    = props.query || Config.get('menu.search.queryParam', 'q')
  }

  render() {
    return (
      <div className="ui search item">
        <Typeahead
          ref="input"
          categories
          endpoint={this.endpoint}
          query={this.query}
          resultField={this.resultField}
          placeholder={this.props.placeholder}
          onChooseResult={this.chooseResult.bind(this)}
          itemComponent={this.props.itemComponent}
        />
      </div>
    )
  }

  chooseResult(result) {

  }
}
