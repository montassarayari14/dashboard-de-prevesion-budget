import { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import API from '../../api/axios';
import { getCategoriesForDirection } from '../../data/budgetCategories';

const ICONS = {
check: 'Coherent',
warning: 'Warning',
error: 'Error',
info: 'Info'
};

export default function AIFormAssistant({ directionCode, formData, onFeedback, className = '' }) {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { t } = useTheme();

  const categories = getCategoriesForDirection(directionCode);

  useEffect(() => {
    if (formData?.categorie && directionCode) {
      validateForm();
    }
  }, [formData?.categorie, formData?.description, formData?.montant]);

  async function validateForm() {
    if (!formData.categorie || !directionCode) return;
    
    setLoading(true);
    try {
      const response = await API.post('/ai/validate-demande', {
        direction: directionCode,
        categorie: formData.categorie,
        sousCategorie: formData.sousCategorie || '',
        montant: formData.montant,
        description: formData.justification || formData.description || formData.nom
      });

      const data = response.data.data;
      setFeedback(data);
      onFeedback?.(data);
    } catch (err) {
      setFeedback({
        validation: 'À vérifier',
        'Analyse rapide': { 'Correspondance métier': 'Erreur connexion IA' },
        Alerte: 'Vérifiez votre connexion'
      });
    } finally {
      setLoading(false);
    }
  }


function formatFeedback(fb) {
    if (!fb || !fb.validation) {
      return <div className={`p-4 rounded-xl border-dashed ${t.border} ${t.textSub} text-sm text-center`}>Chargement analyse IA...</div>;
    }
    return (
      <div className={`p-4 rounded-xl border ${getValidationBg(fb.validation)} text-sm space-y-2`}>

        {/* Validation */}
        <div className="font-bold text-lg flex items-center gap-2">
          {ICONS[getIconForValidation(fb.validation)]} {fb.validation}
        </div>

        {/* Catégorie */}
        {fb['Catégorie'] && (
          <div>
            <span className="text-xs opacity-75 font-medium">Catégorie:</span>
            <div>Type: <span className="font-semibold">{fb['Catégorie'].Type}</span></div>
          </div>
        )}

        {/* Analyse */}
        {fb['Analyse rapide'] && (
          <div className="text-xs space-y-1">
            <span className="opacity-75 font-medium">Analyse:</span>
            <div>Correspondance: {fb['Analyse rapide']['Correspondance métier']}</div>
            <div>Pertinence: {fb['Analyse rapide'].Pertinence}</div>
          </div>
        )}

        {/* Suggestion */}
        {fb.Suggestion && (
          <div className="mt-2 p-2 bg-opacity-20 bg-blue-500 rounded-lg">
            <span className="text-xs font-medium flex items-start gap-1">
              {ICONS.info} {fb.Suggestion}
            </span>
          </div>
        )}

        {/* Alerte */}
        {fb.Alerte && (
          <div className="mt-2 p-2 bg-opacity-20 bg-yellow-500 rounded-lg">
            <span className="text-xs font-semibold flex items-start gap-1">
              {ICONS.warning} {fb.Alerte}
            </span>
          </div>
        )}

        <button 
          onClick={() => setShowSuggestions(!showSuggestions)}
          className={`text-xs opacity-75 hover:opacity-100 transition-all ${t.textSub}`}
        >
          {showSuggestions ? 'Moins de détails' : 'Plus de suggestions'}
        </button>

        {showSuggestions && (
          <div className="mt-2 pt-2 border-t text-xs opacity-75">
<div>Categories recommandées pour {directionCode}:</div>
            <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
              {categories.slice(0, 5).map(cat => (
                <div key={cat} className="p-1 bg-opacity-20 bg-slate-500 rounded cursor-pointer hover:bg-opacity-30 transition-all">
                  {cat}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  function getValidationBg(validation) {
    switch (validation) {
      case 'Cohérent': return 'border-green-300 bg-green-50/80';
      case 'À vérifier': return 'border-yellow-300 bg-yellow-50/80';
      default: return 'border-red-300 bg-red-50/80';
    }
  }

  function getIconForValidation(validation) {
    switch (validation) {
      case 'Cohérent': return 'check';
      case 'À vérifier': return 'warning';
      default: return 'error';
    }
  }

  if (!directionCode || !formData?.categorie) {
    return (
      <div className={`p-4 rounded-xl border-2 border-dashed ${t.border} ${t.textSub} text-sm text-center`}>
        Sélectionnez une catégorie pour validation IA
      </div>
    );
  }

  return (
    <div className={`${className} animate-in slide-in-from-bottom-2 duration-300`}>
      {loading ? (
        <div className={`p-4 rounded-xl border ${t.border} ${t.textSub} text-sm flex items-center gap-2`}>
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          IA analyse votre demande...
        </div>
      ) : (
        formatFeedback(feedback)
      )}
    </div>
  );
}
