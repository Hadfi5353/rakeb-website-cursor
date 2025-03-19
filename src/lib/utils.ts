import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formate une date en format français
 */
export function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), 'PPP', { locale: fr });
  } catch (e) {
    return dateString;
  }
}

/**
 * Formate un prix en MAD avec séparateur de milliers
 */
export function formatPrice(amount: number): string {
  return amount.toLocaleString('fr-FR') + ' MAD';
}
