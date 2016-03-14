import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import LoadingContainer, {LoadingState, PresentState, ErrorState} from 'snax/lib/containers/loading'
import CoreForm from './core.js'
import API from '../api'
import when from 'when'
import whenKeys from 'when/keys'
import whenSequence from 'when/sequence'
import {uid} from '../utils/random'

const isAsync = f => f.async || _.has(f, 'endpoint')

export default class OmniForm extends React.Component {
  static propTypes = {
    endpoint: React.PropTypes.string,
    action: React.PropTypes.string.constructor,
    mode: React.PropTypes.oneOf('post', 'put', 'patch', 'get')
  }

  static defaultProps = {
    mode: 'get',
    onSubmit: _.noop,
    onFieldChange: _.noop
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      submitting: false,
      error: false,
      errors: [],
      message: null,
      pendingData: {},
      asyncFieldOptions: {}
    }
    this.api = new API()
    this.id = this.props.id || uid()
  }

  render() {
    return (
      <CoreForm ref="innerForm" {...this.applyProps()} {...this.attachCallbacks()} />
    )
  }

  componentDidMount() {
    this.setState({loading: true})
    const initPromise = whenSequence([
      this.loadFieldOptions.bind(this),
      this.loadEndpointData.bind(this)
    ])
    initPromise
      .then(() => this.forceUpdate())
      .catch(e => this.showLoadError(e))
      .finally(() => this.setState({loading: false}))
  }

  loadEndpointData() {
    if(!this.props.endpoint) return when({})
    return this.api.loadJSON(this.props.endpoint)
      .then(data => this.fill(data))
  }

  loadFieldOptions() {
    return this.getAsyncFields()
      .tap(console.log.bind(console))
      .then(opts => this.setState({asyncFieldOptions: opts}))
  }

  showLoadError(e) {
    console.error(e)
    this.setState({
      error: true,
      message: {
        messageType: 'error',
        messageTitle: 'There was a problem loading this form.',
        message: "Some data required to display this form could not be loaded right now."
      }
    })
  }

  attachCallbacks() {
    const self = this;
    return {
      onSubmit(data) {
        if(self.props.action) {
          self.setState({submitting: true, pendingData: _.cloneDeep(data)})
          self.api[self.props.mode](self.props.action, data)
            .then(response => self.handleAPIResponse(response))
            .catch(errResponse => self.handleAPIError(errResponse))
            .finally(() => self.setState({submitting: false, pendingData: {}}))
        }
        else {
          self.props.onSubmit(data)
        }
      },
      onFieldChange(...args) {
        self.props.onFieldChange(...args)
      }
    }
  }

  handleAPIResponse(repsonse) {
    this.props.onSubmit(this.state.pendingData)
  }

  handleAPIError(errResponse) {
    const {status: {code}, entity: {errors, message}} = errResponse
    let formMessage;
    switch (code) {
      case 422:
        formMessage = {
          messageType: 'warning',
          messageTitle: 'There were problems with your input.',
          message
        }
        this.setState({error: true, errors, message: formMessage})
        break;

      default:
        formMessage = {
          messageType: 'error',
          messageTitle: 'There was an error while processing your submission.',
          message
        }
        this.setState({error: true, message: formMessage})
    }

    this.props.onError({code, errors, message})
  }

  applyProps() {
    return {
      loading: this.state.loading || this.state.submitting,
      externalErrors: this.state.errors,
      sections: this.mapSections(),
      ...this.state.message,
      ..._.omit(this.props, ['mode', 'action', 'endpoint', 'onSubmit', 'onFieldChange'])
    }
  }

  mapSections() {
    const asyncProps = this.state.asyncFieldOptions
    const transformFields = ({fields}) => {
      return _.map(fields, f => {
        if(f.fields) return {fields: transformFields(f), ...f}
        if(!isAsync(f)) return f
        f.options = asyncProps[f.code]
        return f
      })
    }
    return _.map(this.props.sections, transformFields)
  }

  fill(data) {
    this.refs.innerForm.fill(data)
  }

  clear() {
    this.refs.innerForm.onClear(this.id)
  }

  submit() {
    this.refs.innerForm.doSubmit(this.id)
  }

  getAsyncFields(fields) {
    // Look for fields that are marked Async
    let asyncFieldsPromises = _(this.props.sections)
      .chain()
      .map('fields')
      .flatten()
      .map(f => f.fields || f)
      .flatten()
      .filter(isAsync)
      .transform((acc, f) => {
        acc[f.code] = this.api.loadJSON(f.endpoint)
          .then(({records}) => {
            return _.map(records, r => {
              return {key: r[f.value], value: r[f.text]}
            })
          })
      }, {})

      .value()

    return whenKeys.all(asyncFieldsPromises)
  }


}