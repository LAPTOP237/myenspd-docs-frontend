import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Search, Filter, ChevronDown } from 'lucide-react';
import { documentService } from '../../services/api';
import { useToast } from '../../context/useToast';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { Pagination } from '../../components/ui/Pagination';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';

export const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const params = { page: currentPage, limit: 10 };
        if (filter !== 'all') params.status = filter;
        const res = await documentService.getAll(params);
        setDocuments(res.data || []);
        setTotalPages(res.totalPages || 1);
      } catch {
        toast.error('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [currentPage, filter, toast]);

  const handleDownload = async (doc) => {
    try {
      const blob = await documentService.download(doc.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.nom}.pdf`;
      a.click();
      toast.success('Téléchargement démarré!');
    } catch {
      toast.error('Erreur de téléchargement');
    }
  };

  const filtered = documents.filter(d => 
    d.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Mes Documents</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="disponible">Disponibles</option>
            <option value="en_attente">En attente</option>
          </select>
        </div>
      </div>

      <Card padding={false}>
        {loading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(doc => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium text-gray-900">{doc.nom}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{doc.type}</TableCell>
                    <TableCell className="text-gray-600">{doc.date}</TableCell>
                    <TableCell>
                      <Badge variant={doc.status === 'disponible' ? 'success' : 'warning'}>
                        {doc.status === 'disponible' ? 'Disponible' : 'En attente'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                        {doc.status === 'disponible' && (
                          <Button variant="secondary" size="sm" onClick={() => handleDownload(doc)}>
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">{filtered.length} document(s)</p>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default DocumentsPage;