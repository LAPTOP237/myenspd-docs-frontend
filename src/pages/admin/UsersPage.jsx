import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { userService } from '../../services/api';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState('ALL');

  const pageSize = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      try {
        const res = await userService.getAll({
          role: roleFilter !== 'ALL' ? roleFilter : undefined,
          page: currentPage,
          page_size: pageSize
        });

        console.log("USERS API RESULT", res);

        setUsers(res.results || res.data || []);

        const total = res.count ?? res.total ?? 0;
        setTotalPages(Math.ceil(total / pageSize));

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, roleFilter]);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Liste des utilisateurs</h1>

      <div className="flex gap-2 items-center">
        <label>Filtrer par rôle :</label>
        <select
          className="border rounded px-2 py-1"
          value={roleFilter}
          onChange={(e) => {
            setCurrentPage(1);
            setRoleFilter(e.target.value);
          }}
        >
          <option value="ALL">Tous</option>
          <option value="STUDENT">Étudiant</option>
          <option value="STAFF">Personnel</option>
          <option value="ADMIN">Administrateur</option>
        </select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Matricule</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Filière</TableHead>
            <TableHead>Rôle</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map(u => (
            <TableRow key={u.id}>
              <TableCell>{u.last_name}</TableCell>
              <TableCell>{u.first_name}</TableCell>
              <TableCell>{u.matricule}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.filiere || '-'}</TableCell>
              <TableCell>
                <Badge variant={u.role === 'STUDENT' ? 'blue' : u.role === 'STAFF' ? 'yellow' : 'purple'}>
                  {u.role}
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

export default UsersPage;
