import React from 'react'
import ReactDOM from 'react-dom'
import Breadcrumb from './breadcrumb.js'

class Breadcrumbs extends React.Component {

  static propTypes = {
    breadcrumbs: React.PropTypes.array
  }

  static defaultProps = {
  }

  render() {
    return (
      <div className="breadcrumbs">
        <div className="ui small breadcrumb">
          { this.props.breadcrumbs.map((item, index) => {
            return <Breadcrumb item={item} key={`breadcrumb_${index}`} />
          })}
        </div>
      </div>
    )
  }

}

export default Breadcrumbs
