export interface StructuredRule {
  metric: 'monthly_income' | 'annual_income' | 'credit_score' | 'crypto_balance';
  operator: '>=' | '>' | '<=' | '<' | '==';
  threshold: number;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP' | 'NIGHT';
  description?: string;
}

export interface ValidationResult {
  isValid: boolean;
  rule?: StructuredRule;
  error?: string;
}

const SUPPORTED_METRICS = ['monthly_income', 'annual_income', 'credit_score', 'crypto_balance'] as const;
const SUPPORTED_OPERATORS = ['>=', '>', '<=', '<', '=='] as const;
const SUPPORTED_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'NIGHT'] as const;

/**
 * Parses natural language financial requirements into structured rules
 */
export function parseNaturalLanguageRequirement(prompt: string): ValidationResult {
  const cleanPrompt = prompt.trim().toLowerCase();

  if (!cleanPrompt) {
    return { isValid: false, error: 'Empty prompt provided. Please enter a financial requirement.' };
  }

  // Detect metric
  let metric: StructuredRule['metric'] = 'monthly_income';
  if (cleanPrompt.includes('annual') || cleanPrompt.includes('yearly')) {
    metric = 'annual_income';
  } else if (cleanPrompt.includes('credit score') || cleanPrompt.includes('cibil') || cleanPrompt.includes('fico')) {
    metric = 'credit_score';
  } else if (cleanPrompt.includes('balance') || cleanPrompt.includes('holding') || cleanPrompt.includes('stake')) {
    metric = 'crypto_balance';
  } else if (cleanPrompt.includes('income') || cleanPrompt.includes('salary') || cleanPrompt.includes('earning') || cleanPrompt.includes('earn')) {
    metric = 'monthly_income';
  }

  // Detect operator
  let operator: StructuredRule['operator'] = '>=';
  if (cleanPrompt.includes('greater than or equal') || cleanPrompt.includes('at least') || cleanPrompt.includes('minimum of') || cleanPrompt.includes('min') || cleanPrompt.includes('>=')) {
    operator = '>=';
  } else if (cleanPrompt.includes('greater than') || cleanPrompt.includes('more than') || cleanPrompt.includes('above') || cleanPrompt.includes('>')) {
    operator = '>';
  } else if (cleanPrompt.includes('less than or equal') || cleanPrompt.includes('at most') || cleanPrompt.includes('maximum of') || cleanPrompt.includes('max') || cleanPrompt.includes('<=')) {
    operator = '<=';
  } else if (cleanPrompt.includes('less than') || cleanPrompt.includes('below') || cleanPrompt.includes('<')) {
    operator = '<';
  } else if (cleanPrompt.includes('equal') || cleanPrompt.includes('exactly') || cleanPrompt.includes('==')) {
    operator = '==';
  }

  // Detect currency
  let currency: StructuredRule['currency'] = 'INR';
  if (cleanPrompt.includes('usd') || cleanPrompt.includes('dollar') || cleanPrompt.includes('$')) {
    currency = 'USD';
  } else if (cleanPrompt.includes('eur') || cleanPrompt.includes('euro') || cleanPrompt.includes('€')) {
    currency = 'EUR';
  } else if (cleanPrompt.includes('gbp') || cleanPrompt.includes('pound') || cleanPrompt.includes('£')) {
    currency = 'GBP';
  } else if (cleanPrompt.includes('night') || cleanPrompt.includes('tnight')) {
    currency = 'NIGHT';
  } else if (cleanPrompt.includes('inr') || cleanPrompt.includes('rupee') || cleanPrompt.includes('₹') || cleanPrompt.includes('rs')) {
    currency = 'INR';
  }

  // Extract numeric threshold (handling 'k', 'lakh', 'm', commas)
  let threshold: number | null = null;

  // Regex patterns
  const lakhMatch = cleanPrompt.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|l)/i);
  const kMatch = cleanPrompt.match(/(\d+(?:\.\d+)?)\s*(?:k|thousand)/i);
  const mMatch = cleanPrompt.match(/(\d+(?:\.\d+)?)\s*(?:m|million)/i);
  const rawNumMatch = cleanPrompt.match(/(?:₹|\$|€|£|rs\.?|inr|usd)?\s*([\d,]+(?:\.\d+)?)/i);

  if (lakhMatch) {
    threshold = parseFloat(lakhMatch[1]) * 100000;
  } else if (kMatch) {
    threshold = parseFloat(kMatch[1]) * 1000;
  } else if (mMatch) {
    threshold = parseFloat(mMatch[1]) * 1000000;
  } else if (rawNumMatch) {
    const cleanNum = rawNumMatch[1].replace(/,/g, '');
    threshold = parseFloat(cleanNum);
  }

  if (threshold === null || isNaN(threshold) || threshold <= 0) {
    return {
      isValid: false,
      error: `Could not parse a valid positive numerical threshold from prompt: "${prompt}". Please specify a number, e.g. "50,000 INR" or "50k".`,
    };
  }

  const structuredRule: StructuredRule = {
    metric,
    operator,
    threshold,
    currency,
    description: `Requires ${metric.replace('_', ' ')} ${operator} ${currency} ${threshold.toLocaleString()}`,
  };

  return validateStructuredRule(structuredRule);
}

/**
 * Validates a structured rule against strict security and schema criteria
 */
export function validateStructuredRule(rule: any): ValidationResult {
  if (!rule || typeof rule !== 'object') {
    return { isValid: false, error: 'Rule must be an object' };
  }

  if (!SUPPORTED_METRICS.includes(rule.metric)) {
    return {
      isValid: false,
      error: `Unsupported metric: "${rule.metric}". Supported metrics: ${SUPPORTED_METRICS.join(', ')}`,
    };
  }

  if (!SUPPORTED_OPERATORS.includes(rule.operator)) {
    return {
      isValid: false,
      error: `Unsupported operator: "${rule.operator}". Supported operators: ${SUPPORTED_OPERATORS.join(', ')}`,
    };
  }

  if (!SUPPORTED_CURRENCIES.includes(rule.currency)) {
    return {
      isValid: false,
      error: `Unsupported currency: "${rule.currency}". Supported currencies: ${SUPPORTED_CURRENCIES.join(', ')}`,
    };
  }

  if (typeof rule.threshold !== 'number' || isNaN(rule.threshold) || rule.threshold <= 0) {
    return {
      isValid: false,
      error: `Invalid threshold: ${rule.threshold}. Must be a strictly positive integer/number.`,
    };
  }

  // Business logic boundary checks
  if (rule.metric === 'credit_score' && (rule.threshold < 300 || rule.threshold > 900)) {
    return {
      isValid: false,
      error: `Credit score threshold must be between 300 and 900, received: ${rule.threshold}`,
    };
  }

  return {
    isValid: true,
    rule: {
      metric: rule.metric,
      operator: rule.operator,
      threshold: rule.threshold,
      currency: rule.currency,
      description: rule.description || `Rule: ${rule.metric} ${rule.operator} ${rule.threshold} ${rule.currency}`,
    },
  };
}
