import Ajv from 'ajv'
import { incomingMessageSchema } from './incoming-message'

const ajv = new Ajv({ strictTuples: false })

export const IncomingMessageValidate = ajv.compile(incomingMessageSchema)
