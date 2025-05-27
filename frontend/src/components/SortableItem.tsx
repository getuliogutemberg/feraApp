import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { ReactNode } from 'react';

interface SortableItemProps {
  id: string;
  label?: string;
  children?: ReactNode;
  isModule?: boolean;
}

const SortableItem = ({ id, label, children, isModule }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 0,
    backgroundColor: isOver ? 'rgba(247, 128, 28, 0.1)' : 'transparent',
    border: isOver ? '2px dashed #f7801c' : '2px solid transparent',
    borderRadius: '4px',
    padding: isModule ? '0px' : '0',
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children || label}
    </div>
  );
};

export default SortableItem;
