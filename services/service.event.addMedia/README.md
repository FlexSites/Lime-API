# Event Media Service

>Add media to an event

### Consumes

This service consumes ...

`action.event.addMedia.v1`

Schema
```graphql
enum TYPE {
  image
  video
}
type Input {
  id: ID! # Event ID
  url: Url! # URL to the media resource
  type: TYPE! # Type of media
}
```

An example message:

```json
{
  "id": "RXZlbnQ6MmQ5YmQ5YTktZTI1Mi00YjFmLWEwZWMtN2FkY2ViZTI0Nzc0",
  "url": "https://d2ykm7e3p913e.cloudfront.net/107496/300/450",
  "type": "image"
}
```

### Publishes

This service publishes ...

`event.event.addMedia.v1`

Matches the input message
