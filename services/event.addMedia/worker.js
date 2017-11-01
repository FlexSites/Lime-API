exports.worker = async (db, amqp) => {
  amqp.name('event.addMedia.service')
}
