import React from 'react';
import useCurrency from '../../context/useCurrency';

/**
 * PriceDisplay Component
 * Automatically converts and formats prices based on the user's selected currency.
 * 
 * @param {number} amount - The numeric value to display.
 * @param {string} currency - The base currency of the 'amount' prop (default: 'USD').
 */
export default function PriceDisplay({ amount, currency = 'USD', className, style }) {
  const { formatPrice, rates } = useCurrency();
  
  if (amount === undefined || amount === null) return null;
  
  // Logic: 
  // 1. If base currency is NOT USD, we convert it to USD first using the live rates.
  // 2. Then we use formatPrice(amountUSD) which handles the final conversion to user's choice.
  
  let amountUSD = amount;
  if (currency !== 'USD' && rates[currency]) {
    amountUSD = amount / rates[currency];
  } else if (currency === 'INR' && !rates['INR']) {
    // Fallback if rates are not yet loaded for INR
    amountUSD = amount / 83.5;
  }
  
  return (
    <span className={className} style={style}>
      {formatPrice(amountUSD)}
    </span>
  );
}
