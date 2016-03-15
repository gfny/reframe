'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Exporter = function (_React$Component) {
  _inherits(Exporter, _React$Component);

  function Exporter(props) {
    _classCallCheck(this, Exporter);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Exporter).call(this, props));

    _this.state = {
      selectedColumns: _lodash2.default.map(props.availableColumns, function (col) {
        return col.key;
      })
    };
    return _this;
  }

  _createClass(Exporter, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: 'left menu' },
        _react2.default.createElement(
          'div',
          { className: 'header' },
          _react2.default.createElement('i', { className: 'upload icon' }),
          'Column Name'
        ),
        _react2.default.createElement(
          'div',
          { className: 'scrolling menu' },
          _lodash2.default.map(this.props.availableColumns, function (col, i) {
            return _react2.default.createElement(
              'div',
              { className: 'item', onClick: function onClick(e) {
                  return _this2.chooseColumn(e, i, !_this2.isColumnVisible(i));
                } },
              _react2.default.createElement('input', { className: 'ui inline left floated checkbox', type: 'checkbox', checked: _this2.isColumnVisible(i) }),
              col.label
            );
          })
        )
      );
    }
  }, {
    key: 'isColumnVisible',
    value: function isColumnVisible(index) {
      return _lodash2.default.includes(this.props.visibleColumns, index);
    }
  }, {
    key: 'chooseColumn',
    value: function chooseColumn(e, key, visible) {
      e.preventDefault();
      e.stopPropagation();
      console.log(key, visible);
      this.props.onChooseColumn(key, visible);
    }
  }, {
    key: 'onChangeSearch',
    value: function onChangeSearch(e) {
      this.setState({ searchString: e.target.value });
    }
  }, {
    key: 'getAvailableColumns',
    value: function getAvailableColumns() {}
  }]);

  return Exporter;
}(_react2.default.Component);

Exporter.propTypes = {
  availableColumns: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.object).isRequired,
  exportUrl: _react2.default.PropTypes.string.isRequired
};
exports.default = Exporter;