import { RotateCw } from 'lucide-react';

export const CircularProgress = ({ size = 24, className }: { size?: number; className?: string }) => (
    <div className="animate-spin">
        <RotateCw size={size} className={className} />
    </div>
);