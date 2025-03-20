import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface StripePaymentFormProps {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

const StripePaymentForm = ({ amount, onSuccess, onError }: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      onError("Stripe n'est pas initialisé");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onError("Élément de carte non trouvé");
      return;
    }

    setIsProcessing(true);

    try {
      // Créer un PaymentIntent avec capture manuelle
      const { data: { client_secret }, error: intentError } = await supabase.functions.invoke('create-payment-intent', {
        body: { 
          amount,
          capture_method: 'manual' // Important: Capture manuelle pour autoriser seulement
        }
      });

      if (intentError) throw new Error(intentError.message);

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent?.status === 'requires_capture') {
        onSuccess(paymentIntent.id);
      } else {
        throw new Error("Le paiement n'a pas été autorisé");
      }
    } catch (error: any) {
      console.error('Erreur de paiement:', error);
      onError(error.message || 'Une erreur est survenue lors du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Traitement...' : `Payer ${amount} MAD`}
      </Button>
    </form>
  );
};

export default StripePaymentForm; 