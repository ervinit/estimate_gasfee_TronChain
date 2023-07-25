import TronWeb from 'tronweb';

const from = 'TSpzhmYwfrUDk2CQHpaPNrP4KWAMC2Wy24';
const to = 'TMBM3Jwu4uoxeVV6MeJR9eVmtu1MmJrrUN';
const amount = 1000000; // | TRX

const tronWeb = new TronWeb(
	'https://api.shasta.trongrid.io', // Full node URL
	'https://api.shasta.trongrid.io', // Solidity node URL
	'https://api.shasta.trongrid.io', // Event server URL
);

/* ----------------------------------------------------------
    To calculate the gas fee for a TRX transfer transaction, you can use the following formula:
        gas fee = energy consumed by the transaction * gas price

    The energy consumed by the transaction is calculated as follows
        energy consumed = transaction data size * energy cost per byte
    ----------------------------------------------------------  */

//  Calculate the size of the transaction data
const tx = await tronWeb.transactionBuilder.sendTrx(to, amount, from);
const txSize = tx.raw_data_hex.length / 2;
console.log(
    'LS -> test/tron-estimate-fee.mjs:25 -> bytes of transaction data: ', 
    txSize
);

/*  ----------------------------------------------------------
    The energy cost per byte is a fixed value of 10 SUN per byte.
    Calculate the energy consumed by the transaction by multiplying the transaction data size by the energy cost per byte (10 SUN per byte)
    ----------------------------------------------------------  */
const energyRequired = txSize * 10;
console.log(
	'LS -> test/tron-estimate-fee.mjs:35 -> energyRequired: ',
	energyRequired,
);

// Estimate the bandwidth (energy) required for the transaction
const bandwidth = await tronWeb.trx.getBandwidth(from);
console.log('LS -> test/tron-estimate-fee.mjs:41 -> bandwidth: ', bandwidth);


// Calculate the total transaction fee
const transactionFee = energyRequired / bandwidth;

// Convert the transaction fee from sun to TRX
const transactionFeeTRX = transactionFee / 1e6;
const transactionFeeToSun = tronWeb.toSun(transactionFeeTRX);
console.log('Transaction Fee:', transactionFeeTRX.toFixed(16), 'TRX');
console.log('Transaction Fee:', parseInt(transactionFeeToSun), 'SUN');
