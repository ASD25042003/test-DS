/**
 * Export des composants Resources - Diagana School
 * Module complet de gestion des ressources pédagogiques
 * Réplication exacte de l'interface test-CAT avec intégration backend
 */

import SearchFiltersComponent from './search-filters.js';
import ResourceCard from './resource-card.js';
import ResourcesList from './resource-list.js';
import UploadForm from './upload-form.js';
import { ResourceFullPageViewer } from './resource-fullpage-viewer.js';

// Export avec nommage explicite pour éviter les conflits
export {
    SearchFiltersComponent as SearchFilters,
    ResourceCard,
    ResourcesList,
    UploadForm,
    ResourceFullPageViewer
};
