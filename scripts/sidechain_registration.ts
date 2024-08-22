import { apiClient } from 'klayr-sdk';
// Replace this with the path to a file storing the public and private key of a mainchain account who will send the sidechain registration transaction.
// (Can be any account with enough tokens).
// import { keys } from '../config/default/dev-validators.json';

(async () => {
	// Replace this with alias of the sidechain node(s)
	const SIDECHAIN_ARRAY = ['pepe-world'];
	// Replace this with the alias of the mainchain node(s), e.g. klayr-core
	// Note: Number of mainchain nodes should be equal to sidechain nodes, for this script to work properly.
	const MAINCHAIN_ARRAY = ['klayr-core'];
	let i = 0;
	for (const nodeAlias of SIDECHAIN_ARRAY) {
		const sidechainClient = await apiClient.createWSClient(`wss://token-factory.klayr.dev/rpc-ws`);
		const mainchainClient = await apiClient.createWSClient(`wss://testnet.klayr.xyz/rpc-ws`);
		const sidechainNodeInfo = await sidechainClient.invoke('system_getNodeInfo');

		console.log({ sidechainNodeInfo });

		// Get info about the active sidechain validators and the certificate threshold
		const { validators: sidechainActiveValidators, certificateThreshold } =
			await sidechainClient.invoke('consensus_getBFTParameters', {
				height: sidechainNodeInfo.height,
			});

		// Sort validator list lexicographically after their BLS key
		(sidechainActiveValidators as { blsKey: string; bftWeight: string }[]).sort((a, b) =>
			Buffer.from(a.blsKey, 'hex').compare(Buffer.from(b.blsKey, 'hex')),
		);

		const unsignedTransaction = {
			module: 'interoperability',
			command: 'registerSidechain',
			fee: BigInt(2000000000),
			params: {
				sidechainCertificateThreshold: certificateThreshold,
				sidechainValidators: sidechainActiveValidators,
				chainID: sidechainNodeInfo.chainID,
				name: nodeAlias.replace(/-/g, '_'),
			},
		};

		const signedTransaction = await mainchainClient.transaction.create(unsignedTransaction, 'b');

		try {
			const receipt = await mainchainClient.transaction.send(signedTransaction);
			console.log(
				`Sent sidechain '${nodeAlias}' registration transaction on mainchain node '${MAINCHAIN_ARRAY[i]}'. Tx ID:`,
				receipt.transactionId,
			);
		} catch (error) {
			console.log(error);
		}

		i += 1;

		// Wait in case there are more elements in the SIDECHAIN_ARRAY, after performing another loop with the next element.
		const wait = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
		if (i < SIDECHAIN_ARRAY.length) {
			const WAIT_PERIOD = 10000;
			console.log(`Waiting for ${WAIT_PERIOD} ms to send another sidechain registration`);
			await wait(WAIT_PERIOD);
		}

		const authorizeSideChainResult = await sidechainClient.invoke<{
			transactionId: string;
		}>('chainConnector_authorize', {
			enable: true,
			password: 'klayr',
		});
		console.log('Authorize Sidechain completed, result:', authorizeSideChainResult);
	}

	process.exit(0);
})();