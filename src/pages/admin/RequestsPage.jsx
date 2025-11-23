import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { requestService } from '../../services/api';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';

const statusMap = {
  pending: 'warning',
  processing: 'info',
  approved: 'success',
  rejected: 'destructive'
};

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const pageSize = 10;

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);

      try {
        const res = await requestService.getAll({
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          page: currentPage,
          page_size: pageSize
        });

        console.log("REQUESTS API RESULT", res);

        // Correction : lire results
        setRequests(res.results || res.data || []);

        // Correction : lire count ou total
        const total = res.count ?? res.total ?? 0;
        setTotalPages(Math.ceil(total / pageSize));

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentPage, statusFilter]);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Liste des demandes</h1>

      <div className="flex gap-2 items-center">
        <label>Filtrer par statut :</label>
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
          <option value="approved">Approuvée</option>
          <option value="rejected">Rejetée</option>
        </select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Template</TableHead>
            <TableHead>Motif</TableHead>
            <TableHead>Urgence</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {requests.map(req => (
            <TableRow key={req.id}>
              <TableCell>{req.user?.first_name} {req.user?.last_name}</TableCell>
              <TableCell>{req.template?.title}</TableCell>
              <TableCell>{req.motif}</TableCell>
              <TableCell>{req.urgency}</TableCell>
              <TableCell>
                <Badge variant={statusMap[req.status] || 'default'}>
                  {req.status}
                </Badge>
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
    </div>
  );
};

export default RequestsPage;
