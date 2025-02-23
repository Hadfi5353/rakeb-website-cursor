
import { Upload } from "lucide-react";

const ImageUpload = () => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Photos du véhicule
      </label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md hover:border-primary/50 transition-colors">
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark">
              <span>Télécharger des images</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
            </label>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG jusqu'à 10MB</p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
