import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'

class Emailfield extends React.Component {

  static propTypes = {
    code: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    placeholder: React.PropTypes.string,
    defaultValue: React.PropTypes.string,
    trim: React.PropTypes.bool
  }

  static defaultProps = {
    code         : null,
    disabled     : false,
    placeholder  : '',
    defaultValue : '',
    trim         : true,
    onChange     : () => {}
  }

  constructor(props) {
    super(props)
    let value = _.toString(props.defaultValue)
    this.state = { value: this.formatValue(value) }
  }

  render() {
    return (
      <input
        value={this.state.value}
        ref="control"
        type="text"
        onBlur={this.handleBlur.bind(this)}
        onChange={this.handleChange.bind(this)}
        name={this.props.code}
        id={this.props.code}
        placeholder={this.props.placeholder}/>
    )
  }

  handleChange(event) {
    this.setState({value: event.target.value})
    this.props.onChange(this.props.code, event.target.value)
  }

  handleBlur(event) {
    this.setValue(event.target.value)
    this.props.onChange(this.props.code, event.target.value)
  }

  getValue() {
    return this.refs.control.value || null;
  }

  setValue(value) {
    this.setState({value: this.formatValue(value)})
  }

  clearField() {
    this.setState({value: null})
  }

  getReference() {
    return {[this.props.code]: this}
  }

  formatValue(value) {
    if(!_.isEmpty(value)) {
      if(this.props.trim) { value = value.trim() }
    }
    return value
  }

}

export default Emailfield
