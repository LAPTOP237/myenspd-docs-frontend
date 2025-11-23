import React, { useState, useEffect } from 'react';
import { User, FileText, CheckCircle } from 'lucide-react';
import { userService, requestService, templateService } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import StatCard from '../../components/admin/StatCard';
import CreateTemplateModal from '../../components/admin/CreateTemplateModal';
import AddUserModal from '../../components/admin/AddUserModal';
import { Spinner } from '../../components/ui/Spinner';

const AdminHomePage = () => {
  const [stats, setStats] = useState({ users: 0, requests: 0, templates: 0 });
  const [loading, setLoading] = useState(true);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, requestsRes, templatesRes] = await Promise.all([
          userService.getAll({ role: ['STUDENT', 'STAFF'] }),
          requestService.getAll(),
          templateService.getAll()
        ]);

        const getLength = (res) => {
          if (!res) return 0;
          if (Array.isArray(res)) return res.length;
          if (Array.isArray(res.results)) return res.results.length;
          if (Array.isArray(res.data)) return res.data.length;
          return 0;
        };

        setStats({
          users: getLength(usersRes),
          requests: getLength(requestsRes),
          templates: getLength(templatesRes)
        });
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center items-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      {/* StatCards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={User} label="Utilisateurs" value={stats.users} color="bg-blue-500" link="/dashboard/admin/users" />
        <StatCard icon={FileText} label="Demandes" value={stats.requests} color="bg-yellow-500" link="/dashboard/admin/requests" />
        <StatCard icon={CheckCircle} label="Templates" value={stats.templates} color="bg-purple-500" link="/dashboard/admin/templates" />
      </div>

      {/* Actions rapides */}
      <Card className="p-5">
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="w-full h-20 flex-col gap-2" onClick={() => setShowTemplateModal(true)}>
              <CheckCircle className="w-6 h-6" />
              <span>Créer Template</span>
            </Button>
            <Button variant="outline" className="w-full h-20 flex-col gap-2" onClick={() => setShowAddUserModal(true)}>
              <User className="w-6 h-6" />
              <span>Ajouter Utilisateur</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showTemplateModal && <CreateTemplateModal onClose={() => setShowTemplateModal(false)} />}
      {showAddUserModal && <AddUserModal onClose={() => setShowAddUserModal(false)} />}
    </div>
  );
};

export default AdminHomePage;
