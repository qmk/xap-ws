import Ajv from 'ajv'
import { incomingMessageSchema } from './incoming-message'

const ajv = new Ajv()

export const IncomingMessageValidate = ajv.compile(incomingMessageSchema)
