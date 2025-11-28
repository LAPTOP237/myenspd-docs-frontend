import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { requestService } from '../../services/api';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';

const statusMap = {
  pending: 'warning',
  processing: 'info',
  approved: 'success',
  rejected: 'destructive'
};

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const pageSize = 10;

  useEffect(() => {
    loadRequests();
  }, [currentPage, statusFilter]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await requestService.getAll({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        page: currentPage,
        page_size: pageSize
      });

      setRequests(res.results || res.data || []);
      const total = res.count ?? res.total ?? 0;
      setTotalPages(Math.ceil(total / pageSize));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (id) => {
    try {
      await requestService.updateStatus(id, { status: 'approved' });
      loadRequests();
      setSelectedRequest(null);
    } catch (e) {
      console.error(e);
    }
  };

  const rejectRequest = async (id) => {
    try {
      await requestService.updateStatus(id, { status: 'rejected' });
      loadRequests();
      setSelectedRequest(null);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Gestion des demandes</h1>

      {/* FILTRE */}
      <div className="flex gap-2 items-center">
        <label>Filtrer :</label>
        <select
          className="border rounded px-2 py-1"
          value={statusFilter}
          onChange={(e) => {
            setCurrentPage(1);
            setStatusFilter(e.target.value);
          }}
        >
          <option value="ALL">Tous</option>
          <option value="pending">En attente</option>
          <option value="processing">En cours</option>
          <option value="approved">Approuvé</option>
          <option value="rejected">Rejeté</option>
        </select>
      </div>

      {/* TABLEAU */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Template</TableHead>
            <TableHead>Motif</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {requests.map(req => (
            <TableRow key={req.id}>
              <TableCell>{req.user?.first_name} {req.user?.last_name}</TableCell>
              <TableCell>{req.template?.title}</TableCell>
              <TableCell>{req.motif}</TableCell>
              <TableCell>
                <Badge variant={statusMap[req.status] || 'default'}>
                  {req.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button size="sm" onClick={() => setSelectedRequest(req)}>Voir</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* MODAL DETAILS */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4">
          <Card className="w-full max-w-lg">
            <CardContent className="space-y-4 p-4">
              <h2 className="text-lg font-bold">Détails de la demande</h2>

              <p><strong>Utilisateur :</strong> {selectedRequest.user?.first_name} {selectedRequest.user?.last_name}</p>
              <p><strong>Template :</strong> {selectedRequest.template?.title}</p>
              <p><strong>Motif :</strong> {selectedRequest.motif}</p>
              <p><strong>Urgence :</strong> {selectedRequest.urgency}</p>
              <p><strong>Status :</strong> {selectedRequest.status}</p>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>Fermer</Button>
                <Button variant="destructive" onClick={() => rejectRequest(selectedRequest.id)}>Rejeter</Button>
                <Button variant="success" onClick={() => approveRequest(selectedRequest.id)}>Approuver</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
