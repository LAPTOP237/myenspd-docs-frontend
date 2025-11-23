import React, { useState, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "../../components/ui/Button";
import { useForm } from "react-hook-form";
import { templateService } from "../../services/api";
import RichEditor from "./RichEditor";
import { Plus, Trash2 } from "lucide-react";

const fieldTypes = ["text", "number", "date"];

export default function CreateTemplateModal({ onClose }) {
  const [fields, setFields] = useState([]);
  const [content, setContent] = useState("");
  const insertVariableRef = useRef(null);

  const { register, handleSubmit, reset } = useForm();

  const addField = () =>
    setFields([...fields, { name: "", type: "text" }]);

  const removeField = (i) =>
    setFields(fields.filter((_, index) => index !== i));

  const updateField = (index, key, value) => {
    const list = [...fields];
    list[index][key] = value;
    setFields(list);
  };

  const insertVariable = (name) => {
    if (!insertVariableRef.current) return;
    insertVariableRef.current(name);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        content: content,
        fields: fields,
      };

      console.log("TEMPLATE PAYLOAD =>", payload);

      await templateService.create(payload);

      reset();
      setContent("");
      setFields([]);

      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
    >
      <Dialog.Panel className="bg-white rounded-xl w-full max-w-5xl p-6 overflow-y-auto max-h-[90vh]">
        <Dialog.Title className="text-xl font-bold mb-4">
          Créer un Template
        </Dialog.Title>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* TITRE & DESCRIPTION */}
          <div className="grid grid-cols-2 gap-4">
            <input
              {...register("title", { required: true })}
              className="border p-2 rounded-lg"
              placeholder="Titre du document"
            />
            <input
              {...register("description")}
              className="border p-2 rounded-lg"
              placeholder="Description"
            />
          </div>

          {/* CHAMPS DYNAMIQUES */}
          <div className="p-4 border rounded-lg space-y-2">
            <h3 className="font-semibold mb-2">
              Champs dynamiques (cliquables pour insertion)
            </h3>

            {fields.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={f.name}
                  onChange={(e) =>
                    updateField(i, "name", e.target.value)
                  }
                  placeholder="Nom du champ"
                  className="border p-2 rounded-lg flex-1"
                />

                <select
                  value={f.type}
                  onChange={(e) =>
                    updateField(i, "type", e.target.value)
                  }
                  className="border p-2 rounded-lg"
                >
                  {fieldTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>

                <Button
                  variant="destructive"
                  onClick={() => removeField(i)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => insertVariable(f.name)}
                >
                  Insérer
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2"
              onClick={addField}
            >
              <Plus className="w-4 h-4" /> Ajouter un champ
            </Button>
          </div>

          {/* ÉDITEUR + APERÇU */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Éditeur du document</h3>
              <RichEditor
                value={content}
                onChange={setContent}
                onInsertVariable={(fn) =>
                  (insertVariableRef.current = fn)
                }
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Aperçu du rendu</h3>
              <div
                className="border rounded-lg p-4 bg-gray-50 min-h-[260px]"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>

          {/* OPTIONS */}
          <div className="flex items-center gap-6">
            <input
              type="number"
              {...register("processing_time_days")}
              placeholder="Délai (jours)"
              className="border p-2 rounded-lg w-40"
            />
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("is_active")} />
              Actif
            </label>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>

            <Button type="submit">Créer</Button>
          </div>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
}
