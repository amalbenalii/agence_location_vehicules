export interface Reservation {
  id?: number;
  dateDebut: string;
  dateFin: string;
  dateReservation?: string;
  montantTotal: number;
  statut: 'EN_ATTENTE' | 'CONFIRMEE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE';
  client?: Utilisateur;
  vehicule?: Vehicule;
  agencePriseEnCharge?: Agence;
  agenceRetour?: Agence;
  gestionnaire?: Utilisateur;
  paiement?: Paiement;
}

export interface Utilisateur {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse?: string;
  telephone?: string;
  adresse?: string;
  role: 'CLIENT' | 'GESTIONNAIRE';
}

export interface Vehicule {
  id?: number;
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
  categorie?: CategorieVehicule;
  agence?: Agence;
}

export interface CategorieVehicule {
  id?: number;
  nom: string;
  description?: string;
  prixParJour: number;
  caracteristiques?: string;
}

export interface Agence {
  id?: number;
  nom: string;
  adresse: string;
  telephone?: string;
  email?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
  heureOuverture?: string;
  heureFermeture?: string;
}

export interface Paiement {
  id?: number;
  montant: number;
  datePaiement?: string;
  methodePaiement: 'CARTE_BANCAIRE' | 'ESPECES' | 'VIREMENT' | 'PAYPAL';
  statut: 'EN_ATTENTE' | 'VALIDE' | 'ECHOUE' | 'REMBOURSE';
  reservation?: Reservation;
}
