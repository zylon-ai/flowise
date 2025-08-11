import { INodeParams, INodeCredential } from '../src'

class ZylonApi implements INodeCredential {
    label: string
    name: string
    version: number
    description: string
    inputs: INodeParams[]

    constructor() {
        this.label = 'Zylon API'
        this.name = 'zylonApi'
        this.version = 1.0
        this.description =
            'Refer to <a target="_blank" href="https://docs.zylon.ai/api-reference/zylon-gpt-api">official guide</a> on how to get accessToken for Zylon'
        this.inputs = [
            {
                label: 'API Key',
                name: 'zylonApiKey',
                type: 'password',
                placeholder: '<ZYLON_API_KEY>'
            }
        ]
    }
}

module.exports = { credClass: ZylonApi }
