# 🍫 ChocGlass — Liquid Chocolate Deck Companion

<p align="center">
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Windows%20%7C%20macOS%20%7C%20Linux-blue?style=for-the-badge" alt="Platforms" />
  <img src="https://img.shields.io/badge/Design-Liquid%20Glass%20%26%20Choclift-purple?style=for-the-badge" alt="Design" />
  <img src="https://img.shields.io/badge/Build-GitHub%20Actions%20CI%2FCD-green?style=for-the-badge" alt="CI/CD" />
</p>

> **ChocGlass** transforme votre **iPhone** en un contrôleur tactile ultra-fluide pour votre PC (Windows, macOS et Linux), fusionnant l'ergonomie modulaire de **Choclift** (tablette de raccourcis chocolatée) avec l'esthétique **Liquid Glass** (VisionOS / iOS givré nacré).
> 
> **Zero bord droit :** tous les composants sont des squircles et pilules galbées (`rounded-[32px]`), avec des animations rebondissantes spring physics, des reflets lumineux et des retours haptiques.

---

## ✨ Fonctionnalités Clés

- 🚀 **Lancement d'Applications PC en 1 Tap :**
  - Tuiles chocolatées prédéfinies : Discord, Spotify, Steam, Chrome, VS Code, OBS Studio, YouTube, Terminal, Explorateur, Calculatrice.
  - Ajout illimité d'applications et macros personnalisées (exécutables `.exe`, protocoles `spotify:`, `discord:`, URLs, scripts).
  - Mode réorganisation et suppression en direct.
- 🔊 **Contrôle Précis du Volume PC :**
  - Slider liquide vertical et horizontal avec égaliseur dynamique réactif.
  - Bouton Sourdine (Mute) animé.
  - Presets instantanés : 0%, 25%, 50%, 75%, 100%.
  - Synchronisation bidirectionnelle instantanée en temps réel (si vous changez le volume sur le PC, le slider iPhone bouge automatiquement).
- 🎵 **Lecteur Médias PC (Now Playing) :**
  - Disque vinyle rotatif avec bague lumineuse néon.
  - Affichage en direct du titre et de l'artiste.
  - Contrôles Play, Pause, Morceau Suivant, Morceau Précédent.
- ⏱️ **Minuteurs & Chronomètres PC Synchronisés :**
  - Mode **Minuteur** (Compte à rebours) avec anneau de progression SVG liquide et bague lumineuse.
  - Mode **Chronomètre** haute précision au centième de seconde.
  - Presets Pomodoro (25 min), 5 min, 15 min, 45 min.
  - Le minuteur tourne sur le serveur PC en tâche de fond : aucune perte même si l'écran de l'iPhone se verrouille.
- 🏝️ **Dynamic Island & Horloge PC en Direct :**
  - Horloge PC synchronisée en temps réel (Heures:Minutes:Secondes).
  - Indicateur de statut de connexion dynamique (Pastille radar verte, type de liaison, latence en millisecondes).
  - Puce animée de rappel du minuteur actif.
  - Dépliage au tapotement pour révéler les jauges processeur (CPU %) et mémoire vive (RAM %).
- 🔌 **Double Liaison Câble USB & Wi-Fi :**
  - **Wi-Fi :** Découverte réseau locale avec scan de QR Code en 1 seconde.
  - **Câble USB :** Connexion directe ultra-rapide (1ms de latence) via partage de connexion USB ou tunnel `127.0.0.1:8765`.
- 🎨 **Personnalisation Totale :**
  - Sélecteur de thèmes Liquid Glass : *Choclift Cacao (Chocolat Noir & Or)*, *Liquid Glass (VisionOS givré)*, *Cyberpunk Neon*, *White Silk (Chocolat Blanc)*, *Aurora Emerald*.
  - Curseurs d'intensité du flou (blur) et de transparence.
  - Synthétiseur de clics haptiques et sons tactiles.

---

## 📱 Installation sur iPhone (.IPA via GitHub Actions)

Ce dépôt inclut un workflow automatique [build-ios.yml](.github/workflows/build-ios.yml) qui compile l'application iOS avec `xcodebuild` et génère un fichier `.ipa` prêt à l'emploi.

### Comment télécharger et installer l'IPA :
1. Rendez-vous sur votre repo GitHub dans l'onglet **Actions** (ou **Releases**).
2. Cliquez sur le dernier workflow **Build iOS IPA (ChocGlass)**.
3. Téléchargez l'artefact **`ChocGlass-iOS-IPA`** (contenant `ChocGlass.ipa`).
4. Installez-le sur votre iPhone avec votre méthode préférée :
   - **AltStore / SideStore** (Gratuit, sans jailbreak).
   - **Sideloadly** (Glissez-déposez le fichier `.ipa` depuis votre PC).
   - **TrollStore** (Installation permanente en 1 clic).
   - **Scarlet / Feather**.

---

## 💻 Application Desktop PC (Windows .exe, Mac, Linux)

Le workflow [build-desktop.yml](.github/workflows/build-desktop.yml) compile automatiquement les exécutables suivants :
- **Windows :** `ChocGlass-Setup.exe` et version portable `ChocGlass.exe`.
- **macOS :** `ChocGlass.dmg` et archive `.zip`.
- **Linux :** `ChocGlass.AppImage` et `.tar.gz`.

L'application Desktop dispose de sa propre interface **Liquid Glass** qui :
- Affiche le **QR Code de jumelage** pour votre iPhone.
- Liste les adresses IP locales de votre machine.
- Gère la communication WebSocket et le pont système natif (CoreAudio, touches multimédias, lancements d'exécutables).

---

## 🔌 Comment Relier l'iPhone au PC

### 1. Par Wi-Fi (Sans fil)
1. Lancez l'application PC `ChocGlass`.
2. Ouvrez l'application sur votre iPhone.
3. Scannez le QR Code affiché sur l'écran du PC ou saisissez l'IP indiquée (ex: `192.168.1.50`).
4. La connexion s'établit instantanément avec indicateur de latence vert.

### 2. Par Câble USB (Ultra-basse latence 1ms)
1. Branchez votre iPhone au PC avec le câble USB (Lightning ou USB-C).
2. Activez le **Partage de connexion USB** sur l'iPhone (dans Réglages > Partage de connexion).
3. Dans l'application iPhone, appuyez sur l'icône Câble et sélectionnez **Mode Câble (127.0.0.1)**.
4. *(Optionnel pour les utilisateurs avancés)* : exécutez `scripts/setup-usb-tunnel.bat` pour rediriger le port via `iproxy 8765 8765`.

---

## 🛠️ Développement Local

### Prérequis
- [Node.js](https://nodejs.org/) v18 ou supérieur.
- Git.

### Lancer tout en 1 clic (Windows)
Double-cliquez sur `scripts/start-all.bat` ou lancez les commandes suivantes :

```bash
# 1. Cloner le dépôt
git clone https://github.com/<votre-compte>/ChocGlass.git
cd ChocGlass

# 2. Lancer le serveur PC
cd desktop
npm install
node src/main/server.js

# 3. Lancer l'application mobile / web
cd ../mobile
npm install
npm run dev
```

L'application web mobile sera accessible sur `http://localhost:5173` (ou sur votre iPhone via `http://<IP-DU-PC>:5173`).

---

## 📂 Structure du Projet

```
ChocGlass/
├── .github/
│   └── workflows/
│       ├── build-ios.yml         # Compilation automatique de l'IPA iPhone
│       └── build-desktop.yml     # Compilation Windows (.exe), Mac (.dmg), Linux (.AppImage)
├── mobile/                       # Application iOS (Capacitor + React + Tailwind + Framer Motion)
│   ├── ios/                      # Projet natif Xcode (App.xcodeproj, Podfile)
│   ├── src/
│   │   ├── components/
│   │   │   ├── DynamicIsland.jsx # Pilule dynamique de statut & horloge PC
│   │   │   ├── LiquidGlassCard.jsx # Cartes galbées squircle frosted glass
│   │   │   ├── VolumeSlider.jsx  # Slider de volume fluide avec égaliseur
│   │   │   ├── MediaDeck.jsx     # Vinyle tournant & contrôleur musical
│   │   │   ├── ChocoGrid.jsx     # Tablette de raccourcis Choclift
│   │   │   ├── SyncedTimer.jsx   # Minuteur & Chronomètre synchronisés
│   │   │   ├── ConnectionModal.jsx # Sélecteur Wi-Fi & Câble USB
│   │   │   └── ThemeCustomizer.jsx # Sélecteur de styles Liquid Glass
│   │   ├── hooks/
│   │   │   ├── useSocket.js      # Client WebSocket temps réel
│   │   │   └── useSound.js       # Moteur haptique & audio Web
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── capacitor.config.json
├── desktop/                      # Application Compagnon PC (Electron + Node)
│   ├── src/
│   │   ├── main/
│   │   │   ├── server.js         # Serveur WebSocket & REST (port 8765)
│   │   │   ├── audio.js          # Contrôleur audio Windows / Mac / Linux
│   │   │   ├── media.js          # Touches claviers multimédias
│   │   │   ├── apps.js           # Lanceur d'applications
│   │   │   ├── timer.js          # Minuteur en arrière-plan
│   │   │   └── index.js          # Fenêtre Electron Liquid Glass
│   │   └── renderer/             # Tableau de bord PC avec QR Code
│   └── electron-builder.yml
├── scripts/
│   ├── start-all.bat             # Lancement rapide 1-clic
│   └── setup-usb-tunnel.bat      # Helper de liaison Câble USB
└── README.md
```

---

## 📄 Licence
Ce projet est open-source sous licence **MIT**.
