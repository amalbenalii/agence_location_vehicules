export interface Vehicule {
  id: number;
  marque: string;
  modele: string;
  immatriculation: string;
  couleur?: string;
  kilometrage?: number;
  carburant: 'ESSENCE' | 'DIESEL' | 'ELECTRIQUE' | 'HYBRIDE';
  boiteVitesse: 'MANUELLE' | 'AUTOMATIQUE';
  nombrePlaces?: number;
  statut: 'DISPONIBLE' | 'LOUE' | 'MAINTENANCE' | 'HORS_SERVICE';
  imageUrl?: string;
  categorie?: {
    id: number;
    nom: string;
    description?: string;
    prixParJour: number;
    caracteristiques?: string;
  };
}
