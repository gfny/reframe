"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.swallow = swallow;
function swallow(event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
}