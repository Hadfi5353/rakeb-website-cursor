
import { File, Upload, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserDocument, DocumentType } from '@/types/user';

interface DocumentsSectionProps {
  documents: UserDocument[];
  role: 'owner' | 'renter';
  onUpload: (type: DocumentType, file: File) => Promise<void>;
}

export const DocumentsSection = ({ documents, role, onUpload }: DocumentsSectionProps) => {
  const requiredDocuments = role === 'renter' 
    ? [
        { type: 'driver_license', label: 'Permis de conduire', description: 'Recto-verso, en cours de validité' },
        { type: 'identity_card', label: "Carte d'identité", description: 'Ou passeport en cours de validité' },
        { type: 'selfie_with_id', label: "Selfie avec pièce d'identité", description: 'Pour éviter les fraudes' },
      ]
    : [
        { type: 'identity_card', label: "Carte d'identité", description: 'Ou passeport en cours de validité' },
        { type: 'bank_details', label: 'RIB / IBAN', description: 'Pour recevoir vos paiements' },
      ];

  const getDocumentStatus = (type: DocumentType) => {
    const doc = documents.find(d => d.document_type === type);
    return doc?.status || 'pending';
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: DocumentType) => {
    const file = event.target.files?.[0];
    if (file) {
      await onUpload(type, file);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Documents obligatoires</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {requiredDocuments.map(({ type, label, description }) => (
          <div key={type} className="p-4 border rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <File className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{label}</span>
              </div>
              {getDocumentStatus(type) === 'verified' && <CheckCircle className="h-5 w-5 text-green-500" />}
              {getDocumentStatus(type) === 'pending' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
              {getDocumentStatus(type) === 'rejected' && <XCircle className="h-5 w-5 text-red-500" />}
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
            <div>
              <input
                type="file"
                id={`upload-${type}`}
                className="hidden"
                onChange={(e) => handleFileChange(e, type)}
                accept="image/*,.pdf"
              />
              <label htmlFor={`upload-${type}`}>
                <Button variant="outline" className="w-full" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Téléverser
                  </span>
                </Button>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
