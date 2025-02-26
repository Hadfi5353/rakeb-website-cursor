
import { UserCircle, Camera } from 'lucide-react';

interface AvatarSectionProps {
  avatarUrl?: string;
  uploading: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AvatarSection = ({ avatarUrl, uploading, onUpload }: AvatarSectionProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-primary"
          />
        ) : (
          <UserCircle className="w-32 h-32 text-gray-400" />
        )}
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
        >
          <Camera className="w-5 h-5 text-white" />
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            className="hidden"
            onChange={onUpload}
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
};
