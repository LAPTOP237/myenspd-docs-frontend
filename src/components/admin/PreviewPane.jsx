// src/components/admin/PreviewPane.jsx
import React from 'react';

const PreviewPane = ({ elements }) => {
  return (
    <div className="p-4 bg-white rounded shadow-sm min-h-[300px]">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold">Aperçu</h3>
        <p className="text-sm text-gray-500">Mise à jour instantanée</p>
      </div>

      <div className="space-y-3">
        {elements.length === 0 && (
          <div className="text-gray-400">Aucun élément — ajoute du texte, des images ou des champs dynamiques.</div>
        )}

        {elements.map((el) => {
          if (el.type === 'text') {
            return (
              <div key={el.id} className="p-3 border rounded bg-white">
                <div className="whitespace-pre-wrap">{el.content || <em className="text-gray-400">Texte...</em>}</div>
              </div>
            );
          }

          if (el.type === 'image') {
            return (
              <div key={el.id} className="p-3 border rounded bg-white">
                {el.content ? (
                  <img src={el.content} alt="" className="max-w-full rounded" />
                ) : (
                  <div className="text-gray-400">Image (URL manquante)</div>
                )}
              </div>
            );
          }

          if (el.type === 'field') {
            return (
              <div key={el.id} className="inline-block px-2 py-1 bg-yellow-100 text-sm rounded-md border border-yellow-200">
                <span className="font-medium text-gray-800">{`{{${el.content || 'FIELD'}}}`}</span>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default PreviewPane;
