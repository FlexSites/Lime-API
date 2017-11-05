const faker = require('faker')
const uuid = require('uuid')
const { toGlobalId } = require('graphql-relay')

exports.ID = faker.random.uuid
exports.DateTime = () => faker.date.future().toISOString()
exports.Meta = () => ({
  title: faker.name.title(),
  description: faker.lorem.paragraph(),
  image: faker.image.people(),
})
exports.Address = () => ({
  address1: faker.address.streetAddress(),
  address2: faker.address.secondaryAddress(),
  region: faker.address.state(),
  locality: faker.address.city(),
  postalCode: faker.address.zipCode(),
  longitude: faker.address.longitude(),
  latitude: faker.address.latitude(),
  timezone: '-07:00',
})
