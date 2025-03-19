import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/use-profile';
import { FileText, Upload, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { UserDocument } from '@/types/user';

const DocumentVerification = () => {
  const navigate = useNavigate();
  const { documents, uploadDocument, loading } = useProfile();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<UserDocument['type']>('identity');

  const documentTypes = [
    { type: 'identity', label: "Pièce d'identité", description: "Carte d'identité, passeport ou permis de conduire" },
    { type: 'driver_license', label: 'Permis de conduire', description: 'Permis de conduire en cours de validité' },
    { type: 'proof_of_address', label: 'Justificatif de domicile', description: 'Facture récente (moins de 3 mois)' }
  ] as const;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    await uploadDocument(selectedType, selectedFile);
    setSelectedFile(null);
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold">Vérification des documents</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Pour garantir la sécurité de notre communauté, nous devons vérifier certains documents.
        </p>
      </div>

      {/* Document Upload Section */}
      <div className="grid gap-6">
        {documentTypes.map(({ type, label, description }) => {
          const doc = documents.find(d => d.type === type);
          
          return (
            <Card key={type} className="relative overflow-hidden">
              {doc?.verified && (
                <div className="absolute top-0 right-0 m-4">
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Vérifié</span>
                  </div>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {label}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                {doc ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {doc.verified ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                        )}
                        <span className="text-sm">
                          {doc.verified
                            ? 'Document vérifié'
                            : 'En attente de vérification'}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => window.open(doc.file_url, '_blank')}
                      >
                        Voir le document
                      </Button>
                    </div>
                    
                    {!doc.verified && (
                      <div className="text-sm text-gray-500">
                        La vérification peut prendre jusqu'à 24 heures ouvrées
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        id={`file-${type}`}
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        disabled={loading}
                      />
                      <label
                        htmlFor={`file-${type}`}
                        className="flex-1"
                      >
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <p className="mt-2 text-sm font-medium">
                            Cliquez pour sélectionner un fichier
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            PNG, JPG ou PDF jusqu'à 10MB
                          </p>
                        </div>
                      </label>
                    </div>
                    
                    {selectedFile && selectedType === type && (
                      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium truncate">
                            {selectedFile.name}
                          </span>
                        </div>
                        <Button
                          onClick={handleUpload}
                          disabled={loading}
                        >
                          {loading ? 'Envoi...' : 'Envoyer'}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Information Section */}
      <Card className="mt-8">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Informations importantes</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Tous les documents doivent être clairs et lisibles</li>
              <li>Les documents doivent être en cours de validité</li>
              <li>Les selfies doivent montrer clairement votre visage</li>
              <li>Les justificatifs de domicile doivent dater de moins de 3 mois</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentVerification;
