import { AnthropicInput, ChatAnthropic as LangchainChatAnthropic } from '@langchain/anthropic'
import { BaseLLMParams } from '@langchain/core/language_models/llms'
import { ICommonObject, INode, INodeData, INodeParams } from '../../../src'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src'

const ZYLON_HOST = process.env.ZYLON_HOST || 'http://localhost:8001'

class ChatAnthropic_ChatModels implements INode {
    label: string
    name: string
    version: number
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    credential: INodeParams
    inputs: INodeParams[]

    constructor() {
        this.label = 'chatZylon'
        this.name = 'chatZylon'
        this.version = 8.0
        this.type = 'chatZylon'
        this.icon = 'zylon.svg'
        this.category = 'Chat Models'
        this.description = 'Wrapper around Zylon'
        this.baseClasses = [this.type, ...getBaseClasses(LangchainChatAnthropic)]
        this.credential = {
            label: 'Connect Credential',
            name: 'credential',
            type: 'credential',
            credentialNames: ['zylonApi']
        }
        this.inputs = [
            {
                label: 'Temperature',
                name: 'temperature',
                type: 'number',
                step: 0.1,
                default: 0.9,
                optional: true
            },
            {
                label: 'Streaming',
                name: 'streaming',
                type: 'boolean',
                default: true,
                optional: true,
                additionalParams: true
            },
            {
                label: 'Max Tokens',
                name: 'maxTokensToSample',
                type: 'number',
                step: 1,
                optional: true,
                additionalParams: true
            },
            {
                label: 'Top P',
                name: 'topP',
                type: 'number',
                step: 0.1,
                optional: true,
                additionalParams: true
            },
            {
                label: 'Top K',
                name: 'topK',
                type: 'number',
                step: 0.1,
                optional: true,
                additionalParams: true
            },
            {
                label: 'Extended Thinking',
                name: 'extendedThinking',
                type: 'boolean',
                description: 'Enable extended thinking for reasoning model such as Claude Sonnet 3.7',
                optional: true,
                additionalParams: true
            },
            {
                label: 'Budget Tokens',
                name: 'budgetTokens',
                type: 'number',
                step: 1,
                default: 1024,
                description: 'Maximum number of tokens Claude is allowed use for its internal reasoning process',
                optional: true,
                additionalParams: true
            },
            {
                label: 'Allow Image Uploads',
                name: 'allowImageUploads',
                type: 'boolean',
                description:
                    'Allow image input. Refer to the <a href="https://docs.flowiseai.com/using-flowise/uploads#image" target="_blank">docs</a> for more details.',
                default: false,
                optional: true
            }
        ]
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const temperature = nodeData.inputs?.temperature as string
        const modelName = nodeData.inputs?.modelName as string
        const maxTokens = nodeData.inputs?.maxTokensToSample as string
        const topP = nodeData.inputs?.topP as string
        const topK = nodeData.inputs?.topK as string
        const streaming = nodeData.inputs?.streaming as boolean
        const extendedThinking = nodeData.inputs?.extendedThinking as boolean
        const budgetTokens = nodeData.inputs?.budgetTokens as string

        const obj: Partial<AnthropicInput> & BaseLLMParams & { anthropicApiKey?: string } = {
            temperature: parseFloat(temperature),
            model: modelName,
            streaming: streaming ?? true
        }

        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const zylonApiKey = getCredentialParam('zylonApiKey', credentialData, nodeData)

        if (maxTokens) obj.maxTokens = parseInt(maxTokens, 10)
        if (topP) obj.topP = parseFloat(topP)
        if (topK) obj.topK = parseFloat(topK)
        if (extendedThinking) {
            obj.thinking = {
                type: 'enabled',
                budget_tokens: parseInt(budgetTokens, 10)
            }
            delete obj.temperature
        }

        obj.anthropicApiUrl = ZYLON_HOST
        obj.anthropicApiKey = zylonApiKey ?? 'no-key'
        return new LangchainChatAnthropic(obj)
    }
}

module.exports = { nodeClass: ChatAnthropic_ChatModels }
