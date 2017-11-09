exports.__resolveType = (source) => {
  try {
    const { type } = fromGlobalId(source.id || source._id)
    return type
  } catch (ex) {
    return 'Event'
  }
}
