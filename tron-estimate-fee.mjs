// TODO: what needs to change in this script to estimate gas fee for a TRX transfer?
import axios from 'axios';
import TronWeb from 'tronweb';

const from = 'TSpzhmYwfrUDk2CQHpaPNrP4KWAMC2Wy24';
const to = 'TMBM3Jwu4uoxeVV6MeJR9eVmtu1MmJrrUN';
const amount = 1000000; // | TRX

const contract_address = 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs'; // Tron USDT contract address

const provider = new TronWeb(
	'https://api.shasta.trongrid.io', // Full node URL
	'https://api.shasta.trongrid.io', // Solidity node URL
	'https://api.shasta.trongrid.io', // Event server URL
);

// Estimate energy required for the transaction
const energyResponse = await axios.post(
	'https://api.shasta.trongrid.io/wallet/estimateenergy',
	{
		owner_address: from,
		contract_address: contract_address,
		function_selector: 'transfer(address,uint256)',
		parameter: encodeTransferParameter(to, amount),
		visible: true,
	},
);
console.log(
	'LS -> test/tron-estimate-fee.mjs:26 -> energyResponse: ',
	energyResponse.data,
);

const energyRequired = energyResponse.data.energy_required || 0;
console.log(
	'LS -> test/tron-estimate-fee.mjs:35 -> energyRequired: ',
	energyRequired,
);

// Estimate the bandwidth (energy) required for the transaction
const bandwidth = await provider.trx.getBandwidth(from);
console.log('LS -> test/tron-estimate-fee.mjs:41 -> bandwidth: ', bandwidth);

// Calculate the total transaction fee
const transactionFee = energyRequired / bandwidth;
// Convert the transaction fee from sun to TRX
const transactionFeeTRX = transactionFee / 1e6;
const transactionFeeToSun = provider.toSun(transactionFeeTRX);
console.log('Transaction Fee:', transactionFeeTRX.toFixed(16), 'TRX');
console.log('Transaction Fee:', parseInt(transactionFeeToSun), 'SUN');

function encodeParameters(types, values) {
	// Convert values to hexadecimal format
	const encodedParameters = provider.utils.abi.encodeParams(types, values);

	return encodedParameters.substr(2);
}

function encodeTransferParameter(toAddress, amount) {
	const parameterTypes = ['address', 'uint256'];
	const parameterValues = [provider.address.toHex(toAddress), amount];
	return encodeParameters(parameterTypes, parameterValues);
}
