// src/components/admin/EditorCanvas.jsx
import React from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';

const EditorCanvas = ({ elements, setElements, onRemove }) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = elements.findIndex((e) => e.id === active.id);
      const newIndex = elements.findIndex((e) => e.id === over.id);
      setElements(arrayMove(elements, oldIndex, newIndex));
    }
  };

  const updateContent = (id, value) => {
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, content: value } : el)));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={elements.map((e) => e.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {elements.map((el) => (
            <SortableItem key={el.id} id={el.id}>
              <div className="p-2 bg-white rounded shadow-sm border flex gap-2 items-start">
                <div className="flex-1">
                  {el.type === 'text' && (
                    <textarea
                      className="w-full p-2 border rounded resize-none"
                      value={el.content || ''}
                      onChange={(e) => updateContent(el.id, e.target.value)}
                      placeholder="Texte libre..."
                      rows={3}
                    />
                  )}

                  {el.type === 'image' && (
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      placeholder="URL de l'image..."
                      value={el.content || ''}
                      onChange={(e) => updateContent(el.id, e.target.value)}
                    />
                  )}

                  {el.type === 'field' && (
                    <div className="flex gap-2 items-center">
                      <input
                        className="p-2 border rounded flex-1"
                        placeholder="Nom du champ (ex: NOM_ETUDIANT)"
                        value={el.content || ''}
                        onChange={(e) => updateContent(el.id, e.target.value)}
                      />
                      <span className="text-sm text-gray-500">
                        sera inséré comme {'{{FIELD}}'}
                     </span>

                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    className="text-sm text-red-600 px-2 py-1 rounded bg-red-50 hover:bg-red-100"
                    onClick={() => onRemove(el.id)}
                  >
                    Suppr
                  </button>
                </div>
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default EditorCanvas;
