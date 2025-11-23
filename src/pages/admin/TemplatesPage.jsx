import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { templateService } from '../../services/api';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { Modal } from '../../components/ui/Modal';
import { Drawer } from '../../components/ui/Drawer';
import { Button } from '../../components/ui/Button';

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pageSize = 10;

  // ✅ fetchTemplates stable avec useCallback
  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await templateService.getAll({
        is_active: activeFilter !== 'ALL' ? activeFilter === 'ACTIVE' : undefined,
        search: search || undefined,
        page: currentPage,
        page_size: pageSize
      });
      setTemplates(res.results || []);
      setTotalPages(Math.ceil((res.count || 0) / pageSize));
    } catch (err) {
      console.error("❌ Erreur :", err);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, search, currentPage]);

  // 🔄 Effect dynamique qui réagit à tous les changements
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleView = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (templateId) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce template ?")) {
      try {
        await templateService.delete(templateId);
        fetchTemplates(); // rafraîchit automatiquement après suppression
      } catch (err) {
        console.error("❌ Erreur lors de la suppression :", err);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Liste des templates</h1>

      {/* BARRE DE RECHERCHE ET FILTRE */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Recherche..."
          className="border rounded px-2 py-1 flex-1"
          value={search}
          onChange={(e) => { setCurrentPage(1); setSearch(e.target.value); }}
        />
        <label>Filtrer par statut :</label>
        <select
          className="border rounded px-2 py-1"
          value={activeFilter}
          onChange={(e) => { setCurrentPage(1); setActiveFilter(e.target.value); }}
        >
          <option value="ALL">Tous</option>
          <option value="ACTIVE">Actif</option>
          <option value="INACTIVE">Inactif</option>
        </select>
      </div>

      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Actif</TableHead>
            <TableHead>Délai traitement</TableHead>
            <TableHead>Créé par</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map(t => (
            <TableRow key={t.id} onClick={() => handleView(t)} className="cursor-pointer hover:bg-gray-50">
              <TableCell>{t.title}</TableCell>
              <TableCell>
                <Badge variant={t.is_active ? 'success' : 'destructive'}>
                  {t.is_active ? 'Actif' : 'Inactif'}
                </Badge>
              </TableCell>
              <TableCell>{t.processing_time_days} jours</TableCell>
              <TableCell>{t.created_by?.first_name} {t.created_by?.last_name}</TableCell>
              <TableCell className="flex gap-2">
                <Button size="sm" onClick={(e) => { e.stopPropagation(); handleView(t); }}>Voir</Button>
                <Button size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(t); }}>Modifier</Button>
                <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}>Supprimer</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* MODAL DE DÉTAIL */}
      {isModalOpen && selectedTemplate && (
        <Modal title="Détails du template" onClose={() => setIsModalOpen(false)}>
          <p><strong>Titre :</strong> {selectedTemplate.title}</p>
          <p><strong>Actif :</strong> {selectedTemplate.is_active ? 'Oui' : 'Non'}</p>
          <p><strong>Délai :</strong> {selectedTemplate.processing_time_days} jours</p>
          <p><strong>Créé par :</strong> {selectedTemplate.created_by?.first_name} {selectedTemplate.created_by?.last_name}</p>
        </Modal>
      )}

      {/* DRAWER D'ÉDITION */}
      {isDrawerOpen && selectedTemplate && (
        <Drawer title="Modifier le template" onClose={() => setIsDrawerOpen(false)}>
          <form>
            <div className="flex flex-col gap-2">
              <label>Titre</label>
              <input type="text" defaultValue={selectedTemplate.title} className="border rounded px-2 py-1"/>
              <label>Actif</label>
              <select defaultValue={selectedTemplate.is_active ? 'ACTIVE' : 'INACTIVE'} className="border rounded px-2 py-1">
                <option value="ACTIVE">Actif</option>
                <option value="INACTIVE">Inactif</option>
              </select>
              <label>Délai traitement (jours)</label>
              <input type="number" defaultValue={selectedTemplate.processing_time_days} className="border rounded px-2 py-1"/>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </Drawer>
      )}
    </div>
  );
};

export default TemplatesPage;
