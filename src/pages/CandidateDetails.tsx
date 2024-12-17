import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Briefcase, Calendar, Star, Link as LinkIcon, Pencil, X, Save, Trash2, Archive } from 'lucide-react';
import { useCandidates } from '../hooks/useCandidates';
import { useTranslation } from 'react-i18next';
import CandidateJobList from '../components/CandidateJobList';
import { Dialog } from '@headlessui/react';
import ArchiveCandidateDialog from '../components/ArchiveCandidateDialog';

export default function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { candidate, updateCandidate, deleteCandidate } = useCandidates(id);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    location: '',
    links: [''],
  });

  useEffect(() => {
    if (candidate) {
      setEditForm({
        name: candidate.name || '',
        surname: candidate.surname || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        location: candidate.location || '',
        links: candidate.links?.length ? candidate.links : [''],
      });
    }
  }, [candidate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidate) return;

    setIsLoading(true);
    try {
      await updateCandidate(candidate.id!, editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating candidate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!candidate) return;

    setIsDeleting(true);
    try {
      await deleteCandidate(candidate.id!);
      navigate('/candidates');
    } catch (error) {
      console.error('Error deleting candidate:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!candidate) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {isEditing ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="border rounded px-2 py-1 w-full"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={editForm.surname}
                      onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })}
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Last Name"
                    />
                  </div>
                ) : (
                  `${candidate.name} ${candidate.surname}`
                )}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowArchiveDialog(true)}
                className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
              >
                <Archive size={20} />
                Archive
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {isEditing ? (
                  <>
                    <X size={20} /> Cancel
                  </>
                ) : (
                  <>
                    <Pencil size={20} /> Edit
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Rest of the component remains the same */}
        </div>
      </motion.div>

      <Dialog
        open={isDeleting}
        onClose={() => setIsDeleting(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        {/* Delete confirmation dialog */}
      </Dialog>
      
      <ArchiveCandidateDialog
        isOpen={showArchiveDialog}
        onClose={() => setShowArchiveDialog(false)}
        candidateId={candidate.id!}
        candidateName={`${candidate.name} ${candidate.surname}`}
      />
    </div>
  );
}