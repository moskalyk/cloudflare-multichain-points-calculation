export interface Env {
	PROJECT_ACCESS_KEY: string;
}

// Works in both a Webapp (browser) or Node.js:
import { SequenceIndexer } from '@0xsequence/indexer'

async function getArbitryValue() {
    /* 
        implement function to compute an abitrary number
    */
	// e.g.
	const start = Date.now()
	const res = await fetch('https://lucky-base-5021.on.fleek.co/')
	const end = Date.now()

    return end-start
}

async function getMultiChainTokenBalance(address: string, env: Env){

    const networks = [
        'mainnet',
        'arbitrum',
        'arbitrum-nova',
        'polygon',
        'polygon-zkevm',
        'base',
        'optimism',
        'avalanche',
        'bsc',
        'gnosis'
    ]

    const tokens: any = []

    for (let i = 0; i < networks.length; i ++){
        const indexer = new SequenceIndexer(`https://${networks[i]}-indexer.sequence.app`, env.PROJECT_ACCESS_KEY)
        const tokenBalances = await indexer.getTokenBalances({
            accountAddress: address,
            includeMetadata: true
        })  

        tokens.push(...tokenBalances.balances)
    }

    const computeFullbalance = (tokens: any) => {
        let balance = 0

        tokens.map((token: any) => {
            if(token.contractType == 'ERC1155' || token.contractType == 'ERC721') balance += Number(token.balance)
        })

        return balance
    }

    return computeFullbalance(tokens)
}

const computeWare = async (address: string, env: Env) => await crystalStructure(await getMultiChainTokenBalance(address, env))

async function crystalStructure(token_count: any) {
    const balance = token_count
    let points = 0
    if(balance >= 0 && balance < 2){
        const classes = [1,2]
        points = 2*3
        const arbitraryVal = await getArbitryValue()
        points = points * classes[arbitraryVal % classes.length]
    } else if(balance >= 2 && balance < 7){
        const classes = [6]
        points = 7*72
        const arbitraryVal = await getArbitryValue()
        points = points * classes[arbitraryVal % classes.length]
    } else if(balance >= 7 && balance < 13){
        const classes = [2,2,4]
        points = 13*13
        const arbitraryVal = await getArbitryValue()
        points = points * classes[arbitraryVal % classes.length]
    } else if(balance >= 13 && balance < 18){
        const classes = [3,6,6,6,6,12]
        points = 18*18
        const arbitraryVal = await getArbitryValue()
        points = points * classes[arbitraryVal % classes.length]
    } else if(balance >= 18 && balance < 27){
        const classes = [6,12,12,12,12,24]
        points = 27*26
        const arbitraryVal = await getArbitryValue()
        points = points * classes[arbitraryVal % classes.length]
    } else if(balance >= 27 && balance < 36){
        const classes = [12,24,24,24,48]
        points = 36*8
        const arbitraryVal = await getArbitryValue()
        points = points * classes[arbitraryVal % classes.length]
    } else if(balance >= 36 && balance < 59){
        const classes = [4,4,8]
        points = 59*14
        const arbitraryVal = await getArbitryValue()
        points = points * classes[arbitraryVal % classes.length]
    } else if(balance >= 59 && balance < 68){
        const classes = [4,4,8,8,8,8,16]
        points = 68*9
        const arbitraryVal = await getArbitryValue()
        points = points * classes[arbitraryVal % classes.length]
    }
    return points
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		// Get the 'address' parameter from the URL
		const address = url.searchParams.get('address');

		// Check if 'address' is not null or undefined
		if (address) {
			// If 'address' parameter is found, return it in the response
			try {
				return new Response(`Crystal Points from Multichain Items: ${await computeWare(address, env)}`, {status: 200});
			}catch(err){
				console.log(err)
				return new Response(`Error: `, {status: 500});
			}
		} else {
			// If 'address' parameter is missing, inform the user
			return new Response(`'address' parameter is missing from the URL.`, {status: 400});
			
		}
	}
}