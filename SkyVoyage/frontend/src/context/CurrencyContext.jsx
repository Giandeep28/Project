import React, { createContext, useState, useEffect, useCallback } from 'react';

export const CurrencyContext = createContext();

const SYMBOLS = {
  USD: '$', INR: '₹', GBP: '£', EUR: '€', JPY: '¥', CNY: '¥', 
  AED: 'AED', SGD: 'S$', AUD: 'A$', CAD: 'C$', CHF: 'Fr.', 
  SAR: 'SAR', QAR: 'QAR', MYR: 'RM', THB: '฿', KRW: '₩'
};

const LOCALE_TO_CURRENCY = {
  'en-IN': 'INR', 'en-US': 'USD', 'en-GB': 'GBP', 'de-DE': 'EUR',
  'fr-FR': 'EUR', 'es-ES': 'EUR', 'it-IT': 'EUR', 'ja-JP': 'JPY',
  'zh-CN': 'CNY', 'ar-AE': 'AED', 'en-SG': 'SGD', 'en-AU': 'AUD',
  'en-CA': 'CAD', 'de-CH': 'CHF', 'ar-SA': 'SAR', 'ar-QA': 'QAR',
  'ms-MY': 'MYR', 'th-TH': 'THB', 'ko-KR': 'KRW'
};

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [rates, setRates] = useState({});

  useEffect(() => {
    // Determine initial currency
    let initial = localStorage.getItem('skyvoyage_currency');
    if (!initial) {
      try {
        const locale = Intl.DateTimeFormat().resolvedOptions().locale;
        initial = LOCALE_TO_CURRENCY[locale] || 'USD';
      } catch (e) {
        initial = 'USD';
      }
    }
    setSelectedCurrency(initial);

    // Fetch rates
    fetch('http://localhost:8080/api/currency/rates')
      .then(res => res.json())
      .then(data => {
        if (data.rates) {
          setRates(data.rates);
        }
      })
      .catch(err => console.error("Failed to fetch currency rates:", err));
  }, []);

  const setCurrency = (currency) => {
    setSelectedCurrency(currency);
    localStorage.setItem('skyvoyage_currency', currency);
  };

  const convert = useCallback((amount, from, to) => {
    if (amount === undefined || amount === null) return 0;
    if (from === to) return amount;

    const fromRate = rates[from] || (from === 'INR' ? 83.5 : from === 'EUR' ? 0.92 : from === 'GBP' ? 0.79 : 1);
    const toRate = rates[to] || (to === 'INR' ? 83.5 : to === 'EUR' ? 0.92 : to === 'GBP' ? 0.79 : 1);
    
    return (amount / fromRate) * toRate;
  }, [rates]);

  const formatPrice = useCallback((amountUSD) => {
    if (!amountUSD && amountUSD !== 0) return '';
    
    // Convert using our new universal logic
    const amount = convert(amountUSD, 'USD', selectedCurrency);
    
    // Format
    const symbol = SYMBOLS[selectedCurrency] || selectedCurrency + ' ';
    const isZeroDecimal = ['JPY', 'KRW'].includes(selectedCurrency);
    const formatted = amount.toLocaleString(undefined, {
      minimumFractionDigits: isZeroDecimal ? 0 : 2,
      maximumFractionDigits: isZeroDecimal ? 0 : 2
    });
    
    return `${symbol} ${formatted}`;
  }, [selectedCurrency, convert]);

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, rates, setCurrency, formatPrice, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
};
