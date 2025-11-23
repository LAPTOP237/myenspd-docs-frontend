import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { documentService, requestService } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

// ✅ StatCard corrigé - icon est maintenant utilisé correctement
const StatCard = ({ icon: Icon, label, value, color, trend }) => (
  <Card hover className="p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trend && (
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {trend}
          </p>
        )}
      </div>
      <div className={`${color} p-4 rounded-2xl`}>
        {Icon && <Icon className="w-6 h-6 text-white" />}
      </div>
    </div>
  </Card>
);

// Mapping des statuts pour l'affichage
const statusMap = {
  pending: { label: 'En attente', variant: 'warning' },
  approved: { label: 'Approuvée', variant: 'success' },
  rejected: { label: 'Rejetée', variant: 'error' },
  processing: { label: 'En cours', variant: 'info' },
  // Fallback pour les anciens statuts
  disponible: { label: 'Disponible', variant: 'success' },
  en_attente: { label: 'En attente', variant: 'warning' },
  en_cours: { label: 'En cours', variant: 'info' },
  validee: { label: 'Validée', variant: 'success' },
  rejetee: { label: 'Rejetée', variant: 'error' },
};

// Helper pour formater la date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const HomePage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ documents: 0, pending: 0, validated: 0 });
  const [recentDocs, setRecentDocs] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        
        // Fetch documents et requests en parallèle
        const [docsRes, reqRes] = await Promise.all([
          documentService.getAll({ limit: 4 }).catch(() => ({ data: [], total: 0 })),
          requestService.getAll({ limit: 4 }).catch(() => ({ data: [], total: 0 }))
        ]);

        // Adapter les données selon la structure de votre API
        const docs = docsRes.results || docsRes.data || docsRes || [];
        const requests = reqRes.results || reqRes.data || reqRes || [];

        setRecentDocs(Array.isArray(docs) ? docs.slice(0, 4) : []);
        setRecentRequests(Array.isArray(requests) ? requests.slice(0, 4) : []);
        
        setStats({
          documents: docsRes.count || docsRes.total || docs.length || 0,
          pending: Array.isArray(requests) 
            ? requests.filter(r => r.status === 'pending' || r.status === 'processing').length 
            : 0,
          validated: Array.isArray(requests) 
            ? requests.filter(r => r.status === 'approved').length 
            : 0,
        });
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError('Impossible de charger les données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#224F7F] to-[#1a3d62] rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F7A707]/20 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10">
          <h1 className="text-2xl lg:text-3xl font-bold">
            Bonjour, {user?.first_name || user?.username || 'Utilisateur'} 👋
          </h1>
          <p className="text-white/80 mt-2 max-w-lg">
            Bienvenue sur votre espace documentaire. Gérez vos documents et demandes administratives en toute simplicité.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            {user?.matricule && (
              <span className="bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium">
                {user.matricule}
              </span>
            )}
            {user?.filiere && (
              <span className="bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium">
                {user.filiere}
              </span>
            )}
            {user?.role && (
              <span className="bg-[#F7A707]/90 px-4 py-1.5 rounded-full text-sm font-medium">
                {user.role === 'STUDENT' ? 'Étudiant' : 'Personnel'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          icon={FileText} 
          label="Mes documents" 
          value={stats.documents} 
          color="bg-green-500" 
        />
        <StatCard 
          icon={Clock} 
          label="Demandes en cours" 
          value={stats.pending} 
          color="bg-blue-500" 
        />
        <StatCard 
          icon={CheckCircle} 
          label="Demandes validées" 
          value={stats.validated} 
          color="bg-[#F7A707]" 
        />
      </div>

      {/* Quick Actions */}
      <Card className="p-5">
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/dashboard/request">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <Plus className="w-6 h-6" />
                <span>Nouvelle demande</span>
              </Button>
            </Link>
            <Link to="/dashboard/documents">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <FileText className="w-6 h-6" />
                <span>Mes documents</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Documents */}
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#224F7F]" />
              Documents récents
            </CardTitle>
            <Link to="/dashboard/documents" className="text-sm text-[#224F7F] hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentDocs.length > 0 ? (
              recentDocs.map(doc => (
                <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#224F7F]/10 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#224F7F]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {doc.template?.title || doc.nom || 'Document'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(doc.created_at || doc.date)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">Disponible</Badge>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>Aucun document pour le moment</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Requests */}
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#F7A707]" />
              Demandes récentes
            </CardTitle>
            <Link to="/dashboard/request" className="text-sm text-[#224F7F] hover:underline flex items-center gap-1">
              Nouvelle <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentRequests.length > 0 ? (
              recentRequests.map(req => (
                <div key={req.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">
                      {req.template?.title || req.type || 'Demande'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(req.created_at || req.date)}
                    </p>
                  </div>
                  <Badge variant={statusMap[req.status]?.variant || 'default'}>
                    {statusMap[req.status]?.label || req.status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>Aucune demande pour le moment</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;