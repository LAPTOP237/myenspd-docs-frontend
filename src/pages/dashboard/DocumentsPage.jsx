import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, Eye, XCircle, Printer } from 'lucide-react';
import { requestService, documentService } from '../../services/api';
import { useToast } from '../../context/useToast';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { Pagination } from '../../components/ui/Pagination';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '../../components/ui/Dialog';

const STATUS_LABELS = {
  pending: 'En attente',
  processing: 'En cours',
  approved: 'Approuvée',
  rejected: 'Rejetée',
  cancelled: 'Annulée',
};

const STATUS_VARIANTS = {
  pending: 'warning',
  processing: 'secondary',
  approved: 'success',
  rejected: 'destructive',
  cancelled: 'secondary',
};

export const DocumentsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [templateFields, setTemplateFields] = useState([]);
  const [templateData, setTemplateData] = useState(null);
  const [renderedHtml, setRenderedHtml] = useState("");

  const { toast } = useToast();
  const printRef = useRef();

  const fetchRequests = async (page = 1, status = '') => {
    setLoading(true);
    try {
      const params = { page, page_size: 10 };
      if (status) params.status = status;
      const res = await requestService.getAll(params);
      setRequests(res.data || []);
      setTotalPages(Math.ceil((res.total || 0) / 10));
    } catch {
      toast.error('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  

  const handleGeneratePDF = async (requestId) => {
    try {
      const blob = await documentService.download(requestId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `demande_${requestId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success('PDF généré !');
    } catch {
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  const handleCancel = async (requestId) => {
    try {
      await requestService.cancel(requestId);
      toast.success('Demande annulée !');
      fetchRequests(currentPage, statusFilter);
    } catch {
      toast.error('Impossible d’annuler cette demande');
    }
  };

const handleViewRequest = async (request) => {
  try {
    const template = await documentService.getById(request.template.id);

    const blocks = template.content || [];
    let html = blocks[0]?.value || ""; // le contenu HTML brut du template

    // 🔥 Remplacement des variables dynamiques
    template.fields.forEach((field) => {
      const value = request.data?.[field] || '';
      const regex = new RegExp(`{{\\s*${field}\\s*}}`, "g");
      html = html.replace(regex, value);
    });

    setTemplateFields(template.fields || []);
    setRenderedHtml(html); // stocker le HTML final
    setSelectedRequest(request);

  } catch {
    toast.error("Impossible de charger le template");
  }
};




  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow.document.write('<html><head><title>Impression</title></head><body>');
    newWindow.document.write(printContents);
    newWindow.document.write('</body></html>');
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900">Mes demandes de documents</h1>

      {/* Filtre par statut */}
      <div className="flex items-center gap-2">
        <span className="text-gray-700 font-medium">Filtrer par statut :</span>
        <Button
          variant={statusFilter === '' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('')}
        >
          Tous
        </Button>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <Button
            key={key}
            variant={statusFilter === key ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      <Card padding={false}>
        {loading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Demande</TableHead>
                  <TableHead>Modèle</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map(req => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium text-gray-900">{req.motif || req.template.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{req.template.title}</TableCell>
                    <TableCell className="text-gray-600">{new Date(req.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[req.status]}>
                        {STATUS_LABELS[req.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewRequest(req)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {req.status === 'approved' && (
                          <>
                            <Button variant="secondary" size="sm" onClick={() => handleGeneratePDF(req.id)}>
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="secondary" size="sm" onClick={handlePrint}>
                              <Printer className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {req.status === 'pending' && (
                          <Button variant="destructive" size="sm" onClick={() => handleCancel(req.id)}>
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">{requests.length} demande(s)</p>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        )}
      </Card>

      {/* Modal détails de la demande */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onClose={() => setSelectedRequest(null)}>
          {/* <DialogHeader>Détails de la demande</DialogHeader> */}
          <DialogBody className="space-y-4" ref={printRef}>
            {/* <p><strong>Motif:</strong> {selectedRequest.motif}</p>
            <p><strong>Détails:</strong> {selectedRequest.details || '-'}</p>
            <p><strong>Template:</strong> {selectedRequest.template.title}</p>
            <p><strong>Date:</strong> {new Date(selectedRequest.created_at).toLocaleDateString()}</p>
            <p><strong>Statut:</strong> {STATUS_LABELS[selectedRequest.status]}</p>

  <hr />

  <h4 className="font-semibold">Champs dynamiques</h4>
  {templateFields.length > 0 ? (
    templateFields.map((field, idx) => (
      <div key={idx} className="p-2 border rounded bg-gray-50">
        <p className="font-medium">{field}:</p>
        <p>{selectedRequest.data?.[field] || '-'}</p>
      </div>
    ))
  ) : (
    <p>Aucun champ dynamique</p>
  )}

  <hr /> */}
<div>
  <h4 className="font-semibold mb-2">Contenu du template</h4>
  <div
    className="p-2 border rounded bg-gray-100"
    dangerouslySetInnerHTML={{ __html: renderedHtml }}
  />
</div>


</DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setSelectedRequest(null)}>Fermer</Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
};

export default DocumentsPage;
