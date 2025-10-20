// PayPal API configuration and utilities
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
const PAYPAL_BASE_URL = 'https://api-m.sandbox.paypal.com'; // Use sandbox for testing
//  const endpoint_url = environment === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

interface PayPalAccessTokenResponse {
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  scope: string;
}

interface PayPalCreateOrderResponse {
  id: string;
  intent: string;
  status: string;
  purchase_units: Array<{
    reference_id: string;
    amount: {
      currency_code: string;
      value: string;
    };
  }>;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

interface PayPalCaptureOrderResponse {
  id: string;
  status: string;
  payer: {
    name: {
      given_name: string;
      surname: string;
    };
    email_address: string;
  };
  purchase_units: Array<{
    reference_id: string;
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
      }>;
    };
  }>;
}

// Frontend-compatible interface (matches what components expect)
export interface PayPalCaptureResponse {
  orderID: string;
  status: string;
  payer: {
    name: {
      given_name: string;
      surname: string;
    };
    email_address: string;
  };
  purchase_units: Array<{
    reference_id: string;
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
      }>;
    };
  }>;
}

/**
 * Get PayPal access token using client credentials
 */
export async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to get PayPal access token: ${response.statusText}`);
  }

  const data = (await response.json()) as PayPalAccessTokenResponse;
  return data.access_token;
}

/**
 * Create PayPal order
 */
export async function createPayPalOrder(
  amount: string,
  currency = 'USD'
): Promise<PayPalCreateOrderResponse> {
  const accessToken = await getPayPalAccessToken();
  
  const orderData = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount,
        },
      },
    ],
  };

  const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create PayPal order: ${response.statusText}`);
  }

  return response.json() as Promise<PayPalCreateOrderResponse>;
}

/**
 * Capture PayPal order
 */
export async function capturePayPalOrder(
  orderId: string
): Promise<PayPalCaptureResponse> {
  const accessToken = await getPayPalAccessToken();
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to capture PayPal order: ${response.statusText}`);
  }

  const orderResponse = (await response.json()) as PayPalCaptureOrderResponse;
  
  // Transform to frontend-compatible format
  return {
    ...orderResponse,
    orderID: orderResponse.id, // Map 'id' to 'orderID' for frontend compatibility
  };
}