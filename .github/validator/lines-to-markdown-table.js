function isHandlebarsOptions(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      Object.prototype.hasOwnProperty.call(value, 'hash')
  )
}

function getOption(value, fallback) {
  return typeof value === 'string' && value.trim() !== ''
    ? value.trim()
    : fallback
}

function getRows(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === 'string')
  }

  if (typeof value === 'string') {
    return value.split(/\r?\n/)
  }

  return []
}

function escapeTableCell(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('\\', '\\\\')
    .replaceAll('|', '\\|')
}

export default function linesToMarkdownTable(value, ...args) {
  const maybeOptions = args[args.length - 1]
  const parameters = isHandlebarsOptions(maybeOptions)
    ? args.slice(0, -1)
    : args

  const header = getOption(parameters[0], 'Value')
  const emptyState = getOption(parameters[1], '_None_')
  const rows = getRows(value)
    .map((row) => row.trim())
    .filter((row) => row !== '')

  if (rows.length === 0) {
    return emptyState
  }

  return [
    `| ${escapeTableCell(header)} |`,
    '| --- |',
    ...rows.map((row) => `| ${escapeTableCell(row)} |`)
  ].join('\n')
}
