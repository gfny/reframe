export function swallow(event) {
  event.preventDefault()
  event.stopPropagation()
  return false
}
