

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { documentService, requestService } from "../../services/api";
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../context/useToast';

export default function RequestPage() {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm();
  const { toast } = useToast();

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);

  // Charger les templates
// Charger les templates
useEffect(() => {
  documentService.getTemplates().then(data => setTemplates(Array.isArray(data) ? data : []));
}, []);


  const selectedTemplateId = watch("template_id");

  // Quand on choisit un template → afficher l’aperçu + champs dynamiques
  useEffect(() => {
    if (!selectedTemplateId) return;

    const template = templates.find(t => t.id === Number(selectedTemplateId));
    setSelectedTemplate(template);

    if (template?.fields) {
      template.fields.forEach(field => {
        setValue(`fields.${field}`, "");
      });
    }
  }, [selectedTemplateId, setValue, templates]);

  const onSubmit = async (data) => {
    setLoading(true);

    const payload = {
      template_id: Number(data.template_id),
      motif: data.motif || "",
      details: data.details || "",
      urgency: data.urgency || false,
      data: data.fields || {},  // <-- ici doit correspondre à onSubmit
    };

    console.log("REQUEST PAYLOAD =>", payload);

    try {
      await requestService.create(payload);
      toast.success("Demande envoyée !");
      reset();
      setSelectedTemplate(null);
    } catch (err) {
      toast.error("Erreur : " + (err.response?.data?.message || "Impossible d'envoyer"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Créer une demande de document</h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Select des templates */}
          <Select
            label="Choisir un modèle de document"
            options={templates.map(t => ({ value: t.id, label: t.title }))}
            {...register("template_id", { required: "Sélection obligatoire" })}
            error={errors.template_id?.message}
          />

          {/* Aperçu du template */}
          {selectedTemplate && (
            <Card className="p-4 bg-gray-50 border">
              <h3 className="font-semibold text-lg">{selectedTemplate.title}</h3>
              <p className="text-gray-600">{selectedTemplate.description}</p>

              <div className="mt-4 space-y-3">
                {selectedTemplate.content.map((block, idx) => (
                  <div key={idx} className="p-3 bg-white border rounded">
                    {block.type === "text" && (
                      <p className="text-sm">{block.value}</p>
                    )}
                    {block.type === "dynamic_field" && (
                      <p className="text-sm font-medium text-primary">{block.label}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Champs dynamiques */}
          {selectedTemplate?.fields?.length > 0 && (
            <Card className="p-4 border">
              <h4 className="font-semibold mb-3">Champs à remplir</h4>

              <div className="space-y-4">
                {selectedTemplate.fields.map((field, idx) => (
                  <div key={idx}>
                    <label className="block text-sm font-medium">
                      {field.replace("_", " ").toUpperCase()}
                    </label>
                    <input
                      className="border w-full p-2 rounded"
                      {...register(`fields.${field}`, { required: true })}
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Motif */}
          <textarea
            placeholder="Motif..."
            className="w-full border p-3 rounded"
            {...register("motif")}
          />

          <Button type="submit" loading={loading} className="w-full">
            Soumettre la demande
          </Button>
        </form>
      </Card>
    </div>
  );
}
