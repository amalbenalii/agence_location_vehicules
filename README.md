# 🚗 Gestion d'Agence de Location de Véhicules

Une application web full-stack pour la gestion complète d'une agence de location de véhicules, développée avec Spring Boot (backend) et Angular (frontend).

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [API Documentation](#api-documentation)
- [Structure du Projet](#structure-du-projet)

## 🎯 Vue d'ensemble

Ce projet implémente un système complet de gestion d'agence de location de véhicules avec :

- **Deux rôles d'utilisateurs** : Client et Gestionnaire
- **Gestion complète de la flotte** : CRUD véhicules, catégories, agences
- **Système de réservations** : Processus en 4 étapes avec paiement
- **Authentification sécurisée** : JWT avec Spring Security
- **Interface responsive** : Bootstrap 5 avec Angular 17

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité
- Inscription client automatique
- Login avec redirection selon le rôle
- Tokens JWT sécurisés
- Protection des routes par rôle

### 👤 Interface Client
- **Catalogue de véhicules** : Consultation par catégorie
- **Recherche avancée** : Filtres multiples (prix, date, agence)
- **Réservation en ligne** : Processus 4 étapes
- **Paiement sécurisé** : Plusieurs méthodes
- **Historique personnel** : Voir/annuler/modifier réservations
- **Profil utilisateur** : Gestion des informations

### 🛠️ Interface Gestionnaire
- **Tableau de bord** : Statistiques en temps réel
- **Gestion de flotte** : CRUD complet véhicules
- **Gestion des catégories** : Définition des tarifs
- **Traitement des réservations** : Validation, départ, retour
- **Gestion des agences** : CRUD et affectations
- **Historique véhicule** : Toutes les réservations

### 🏢 Gestion des Agences
- CRUD complet des agences
- Affectation des gestionnaires
- Statistiques par agence
- Suivi des véhicules par agence

## 🏗️ Architecture

### Backend (Spring Boot)
- **Java 17** avec Spring Boot 4.0.0
- **Spring Security** avec JWT
- **Spring Data JPA** avec Hibernate
- **MySQL** comme base de données
- **Swagger/OpenAPI** pour la documentation
- **Validation** avec Jakarta Bean Validation

### Frontend (Angular)
- **Angular 17** avec TypeScript
- **Bootstrap 5** pour le design responsive
- **RxJS** pour la gestion asynchrone
- **Angular Router** pour la navigation
- **HTTP Client** pour les appels API
- **Guards** pour la protection des routes

### Base de Données
- **7 entités principales** avec relations complètes
- **Relations** : 1:N, 1:1, N:N selon les spécifications
- **Contraintes** : Uniques, NOT NULL, clés étrangères

## 🚀 Prérequis

### Backend
- Java 17 ou supérieur
- Maven 3.6+
- MySQL 8.0+
- IDE (IntelliJ IDEA, Eclipse, VS Code)

### Frontend
- Node.js 18+ ou npm 8+
- Angular CLI 17+
- Navigateur web moderne

## 📦 Installation

### 1. Cloner le projet
```bash
git clone <repository-url>
cd agence_location_vehicules
```

### 2. Base de données
```sql
CREATE DATABASE location_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Backend
```bash
cd backend (ou racine du projet)
mvn clean install
mvn spring-boot:run
```

L'application démarrera sur `http://localhost:8090`

### 4. Frontend
```bash
cd location-frontend
npm install
ng serve
```

L'application démarrera sur `http://localhost:4200`

## ⚙️ Configuration

### Backend (application.properties)
```properties
# Base de données
spring.datasource.url=jdbc:mysql://localhost:3306/location_db
spring.datasource.username=root
spring.datasource.password=votre_mot_de_passe

# JWT
jwt.secret=votre_secret_key
jwt.expiration=86400

# CORS
spring.web.cors.allowed-origins=http://localhost:4200
```

### Frontend (environments/environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8090/api'
};
```

## 🎮 Utilisation

### 1. Créer un compte administrateur
```sql
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role) 
VALUES ('Admin', 'System', 'admin@agence.com', '$2a$10$...', 'ADMIN');
```

### 2. Premiers pas
1. Accéder à `http://localhost:4200`
2. Créer un compte client ou se connecter comme admin
3. Explorer les fonctionnalités selon le rôle

### 3. Comptes de démonstration
- **Admin** : admin@agence.com / admin123
- **Gestionnaire** : manager@agence.com / manager123
- **Client** : client@agence.com / client123

## 📚 API Documentation

### Swagger UI
Accédez à `http://localhost:8090/swagger-ui.html` pour la documentation interactive.

### Endpoints principaux

#### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription

#### Véhicules
- `GET /api/vehicules` - Liste des véhicules
- `POST /api/vehicules` - Ajouter un véhicule
- `PUT /api/vehicules/{id}` - Modifier un véhicule
- `DELETE /api/vehicules/{id}` - Supprimer un véhicule

#### Réservations
- `GET /api/reservations` - Liste des réservations
- `POST /api/reservations` - Créer une réservation
- `PUT /api/reservations/{id}/statut` - Modifier le statut

#### Agences
- `GET /api/agences` - Liste des agences
- `POST /api/agences` - Ajouter une agence
- `PUT /api/agences/{id}` - Modifier une agence

## 📁 Structure du Projet

```
agence_location_vehicules/
├── src/main/java/com/example/agence_location_vehicules/
│   ├── entities/           # Entités JPA (7 entités)
│   ├── repository/         # Repositories Spring Data
│   ├── service/           # Services métier
│   ├── controller/        # REST Controllers
│   ├── security/          # Configuration sécurité
│   └── config/           # Configuration générale
├── location-frontend/
│   ├── src/app/
│   │   ├── components/    # Composants Angular
│   │   ├── services/      # Services HTTP
│   │   ├── models/        # Modèles TypeScript
│   │   └── guards/        # Guards de route
│   └── package.json
├── pom.xml               # Configuration Maven
└── README.md
```

## 🔧 Développement

### Backend
- Utiliser Lombok pour le code concis
- Validation avec annotations Jakarta
- Tests avec JUnit 5 et Mockito
- Documentation avec Swagger

### Frontend
- Composants standalone (Angular 17)
- Services injectables
- Guards pour la sécurité
- Forms réactifs ou template-driven

## 🧪 Tests

### Backend
```bash
mvn test
```

### Frontend
```bash
cd location-frontend
ng test
```

## 📝 Notes de Développement

### Sécurité
- Mots de passe cryptés avec BCrypt
- Tokens JWT avec expiration
- Validation des entrées côté serveur
- Protection CSRF activée

### Performance
- Pagination des résultats
- Optimisation des requêtes JPA
- Cache côté client pour les données statiques

### UX/UI
- Interface responsive Bootstrap 5
- Messages d'erreur clairs
- Indicateurs de chargement
- Navigation intuitive

## 🤝 Contributeurs

- Développé dans le cadre d'un projet semestriel
- Architecture respectant les bonnes pratiques
- Code documenté et maintenable

## 📄 Licence

Ce projet est développé à des fins éducatives.

---

## 🎯 Conclusion

Ce projet implémente **intégralement** les spécifications du cahier des charges :

✅ **7 entités** avec relations complètes  
✅ **2 rôles** avec interfaces dédiées  
✅ **Authentification sécurisée** JWT  
✅ **Gestion complète** CRUD pour toutes les entités  
✅ **Processus de réservation** en 4 étapes  
✅ **Interface responsive** et moderne  
✅ **Sécurité** et validation robustes  

Le système est prêt pour être déployé et utilisé dans un environnement de production.
