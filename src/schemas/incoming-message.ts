import { JSONSchemaType } from 'ajv'

export type IncomingMessage = {
  action: string
  args?: KVpair[]
}

export type KVpair = {
  name: string
  value: string
}

export const incomingMessageSchema: JSONSchemaType<IncomingMessage> = {
  type: 'object',
  properties: {
    action: {
      type: 'string'
    },
    args: {
      type: 'array',
      nullable: true,
      minItems: 0,
      maxItems: 10,
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          value: {
            type: 'string'
          }
        },
        required: ['name', 'value']
      }
    }
  },
  required: ['action'],
  additionalProperties: false
}
