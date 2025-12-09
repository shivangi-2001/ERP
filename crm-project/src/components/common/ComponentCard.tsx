import { PencilIcon } from "../../icons";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; 
  desc?: string; 
  button?: React.ReactNode;
  isEditing?: boolean; // Made optional
  onEdit?: () => void; // Made optional
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  isEditing = false,
  onEdit,
  button,
}) => {
  
  const handleEdit = () => {
    if (onEdit) onEdit();
  };

  return (
    <div
      className={`h-fit rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      {/* FIX 1: Used 'items-center' instead of 'align-middle' */}
      <div className="flex flex-row justify-between items-center px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="text-base capitalize font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* FIX 2: Removed extra padding wrapper around button */}
          {button && <div>{button}</div>}
          
          {/* FIX 3: Show Pencil only when NOT editing (Read Mode) */}
          {isEditing && onEdit && (
            <button
              type="button"
              onClick={handleEdit}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              title="Edit Details"
            >
              <PencilIcon className={`size-6 ${isEditing ? "text-blue-500":"text-gray-400"} hover:text-brand-500 `} />
            </button>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="">
        <div className="">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;