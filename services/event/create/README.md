# Event Create Service

>Create a new event

### Consumes

This service consumes `create` events on the `event` exchange.

An example message:

```json
{
  "id": "61af46cc-4948-4b2b-bf41-4661f2c9fa40"
}
```

### Publishes

>This service creates new event aggregates

This service publishes `created` events on the `event` exchange and writes to the `event_source` collection
