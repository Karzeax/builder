/* =========================================================
   Builder — logique
   Phase 1 : calculateur de stats nu (PE, primaires, secondaires,
   PV/PM dérivés). Phases suivantes : équipement, sorts,
   simu de combat, persistance URL/localStorage.
   ========================================================= */

// ── Définition du modèle ──
const PE_MAX = 10000;
const COST_PER_UPGRADE_STEP = 50;   // n-ième upgrade coûte n * 50 PE
const MAX_UPGRADES = 10;            // 10 améliorations max par stat

const PRIMARY_STATS = [
  { key: 'FOR', label: 'FOR', base: 10, step: 1 },
  { key: 'DEX', label: 'DEX', base: 10, step: 1 },
  { key: 'INT', label: 'INT', base: 10, step: 1 },
  { key: 'CON', label: 'CON', base: 10, step: 1 },
  { key: 'ESP', label: 'ESP', base: 10, step: 1 },
  { key: 'CHA', label: 'CHA', base: 10, step: 1 },
];

const SECONDARY_STATS = [
  { key: 'PRE', label: 'PRE', base: 0, step: 5, suffix: '%' },
  { key: 'ESQ', label: 'ESQ', base: 0, step: 5, suffix: '%' },
  { key: 'MM',  label: 'MM',  base: 0, step: 5, suffix: '%' },
  { key: 'DM',  label: 'DM',  base: 0, step: 5, suffix: '%' },
  { key: 'OBS', label: 'OBS', base: 0, step: 5, suffix: '%' },
  { key: 'DIS', label: 'DIS', base: 0, step: 5, suffix: '%' },
];

const ALL_STATS = [...PRIMARY_STATS, ...SECONDARY_STATS];

// ── État du build : { FOR: 0 (upgrades), DEX: 0, ... } ──
const state = {};
for (const s of ALL_STATS) state[s.key] = 0;

// ── Helpers de calcul ──
function costForNextUpgrade(currentUpgrades) {
  // n-ième upgrade coûte n * 50 PE (1ère = 50, 2ème = 100, etc.)
  return (currentUpgrades + 1) * COST_PER_UPGRADE_STEP;
}
function totalCostForStat(upgrades) {
  // somme triangulaire 1+2+...+n multipliée par 50
  return COST_PER_UPGRADE_STEP * (upgrades * (upgrades + 1) / 2);
}
function totalPEUsed() {
  return ALL_STATS.reduce((acc, s) => acc + totalCostForStat(state[s.key]), 0);
}
function purchasedValue(s) {
  // Valeur "achetée" : base + nombre d'améliorations PE × pas
  return s.base + state[s.key] * s.step;
}

// Toutes les clés de stats permanentes susceptibles d'apparaître à la racine d'un item
const PERMANENT_STAT_KEYS = [
  'FOR','DEX','INT','CON','ESP','CHA',
  'PRE','ESQ','MM','DM','OBS','DIS',
  'ARM','RES',
  'BonusDGT','BonusMAG','Bonus PA',
];

/**
 * Agrège les stats du personnage : caracs achetées + stats permanentes (à la racine)
 * de tous les items équipés. Les blocs `attack` / `offhandAttack` sont exclus —
 * ils servent uniquement au calcul d'une attaque (phase combat).
 */
function computeCharStats() {
  const stats = {};
  for (const k of PERMANENT_STAT_KEYS) stats[k] = 0;
  // 1. Caracs primaires + secondaires : base + améliorations PE
  for (const s of ALL_STATS) {
    stats[s.key] = purchasedValue(s);
  }
  // 2. Bonus permanents apportés par chaque item équipé
  for (const slot of EQUIPMENT_SLOTS) {
    const item = equipment[slot.key];
    if (!item) continue;
    for (const k of PERMANENT_STAT_KEYS) {
      if (item[k] != null) {
        stats[k] += item[k];
      }
    }
  }
  // 3. Bonus des gemmes serties (avec plafond)
  const gemBonuses = computeGemBonuses();
  for (const [k, v] of Object.entries(gemBonuses)) {
    stats[k] = (stats[k] || 0) + v;
  }
  // 4. Bonus des enchantements (avec multiplicateur arme 2 mains et plafond)
  const enchantBonuses = computeEnchantBonuses();
  for (const [k, v] of Object.entries(enchantBonuses)) {
    stats[k] = (stats[k] || 0) + v;
  }
  return stats;
}

// ── Rendu ──
function makeStatRow(s) {
  const row = document.createElement('div');
  row.className = 'stat-row';
  row.innerHTML = `
    <span class="stat-label">${s.label}</span>
    <div class="stat-control">
      <button class="stat-btn" data-action="dec" data-key="${s.key}" aria-label="Retirer 1 amélioration">−</button>
      <span class="stat-value" id="val-${s.key}"></span>
      <button class="stat-btn" data-action="inc" data-key="${s.key}" aria-label="Ajouter 1 amélioration">+</button>
    </div>
    <span class="stat-cost" id="cost-${s.key}"></span>
  `;
  return row;
}

/**
 * Affiche dans l'onglet Évolution la valeur "achetée" pure (base + PE), sans
 * contribution d'équipement. Le total avec équipement est dans l'onglet Profil.
 */
function refreshStat(s) {
  const upg = state[s.key];
  const value = purchasedValue(s);
  const suffix = s.suffix || '';

  const valEl = document.getElementById('val-' + s.key);
  valEl.textContent = value + suffix;
  valEl.classList.toggle('boosted', value > s.base);

  const costEl = document.getElementById('cost-' + s.key);
  const decBtn = document.querySelector(`.stat-btn[data-action="dec"][data-key="${s.key}"]`);
  const incBtn = document.querySelector(`.stat-btn[data-action="inc"][data-key="${s.key}"]`);

  decBtn.disabled = upg <= 0;

  if (upg >= MAX_UPGRADES) {
    costEl.textContent = 'max';
    costEl.className = 'stat-cost maxed';
    incBtn.disabled = true;
  } else {
    const next = costForNextUpgrade(upg);
    const peLeft = PE_MAX - totalPEUsed();
    const affordable = next <= peLeft;
    costEl.textContent = `+${next} PE`;
    costEl.className = 'stat-cost' + (affordable ? '' : ' unaffordable');
    incBtn.disabled = !affordable;
  }
}

function refreshAll() {
  for (const s of ALL_STATS) refreshStat(s);

  const used = totalPEUsed();
  document.getElementById('pe-used').textContent = used.toLocaleString('fr-FR');
  const pct = Math.min(100, (used / PE_MAX) * 100);
  const bar = document.getElementById('pe-bar-fill');
  bar.style.width = pct + '%';
  document.querySelector('.pe-bar').classList.toggle('over', used > PE_MAX);
  document.querySelector('.pe-counter .values').classList.toggle('over', used > PE_MAX);

  // L'onglet Profil consomme les stats finales (caracs achetées + équipement)
  refreshProfile();
}

/* =========================================================
   PROFIL — résumé des stats finales du personnage
   (caracs achetées + bonus permanents des items équipés)
   Présentation calquée sur l'écran de personnage in-game :
   PV/PM en haut, puis 12 caracs en 2 colonnes,
   puis stats de combat en bas (sans titre de section).
   ========================================================= */

// SVG inline (FA-style heart + spirale custom pour les PM)
const ICON_HEART_SVG = `<svg viewBox="0 0 512 512" aria-hidden="true"><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9z"/></svg>`;

const ICON_GALAXY_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
  <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
  <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(0 12 12)"/>
  <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)"/>
  <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(-60 12 12)"/>
</svg>`;

// Vitalité : PV (rouge), PM (vert) — couleurs proches de l'in-game
const PROFILE_VITALS = [
  { key: 'PV', label: 'PV', compute: s => s.CON * 10, base: 100, icon: ICON_HEART_SVG  },
  { key: 'PM', label: 'PM', compute: s => s.ESP * 2,  base: 20,  icon: ICON_GALAXY_SVG },
];

// Caracs primaires (colonne gauche) — base 10
const PROFILE_PRIMARY = ['FOR','DEX','INT','CON','ESP','CHA'].map(k => ({
  key: k, label: k, compute: s => s[k], base: 10,
}));

// Caracs secondaires (colonne droite) — base 0, en %
const PROFILE_SECONDARY = ['PRE','ESQ','MM','DM','OBS','DIS'].map(k => ({
  key: k, label: k, compute: s => s[k], base: 0, suffix: '%',
}));

// Stats de combat (en bas, sans titre — affichées seulement si > 0)
const PROFILE_COMBAT = [
  { key: 'ARM',      label: 'ARM', compute: s => s.ARM,         base: 0 },
  { key: 'RES',      label: 'RES', compute: s => s.RES,         base: 0 },
  { key: 'BonusDGT', label: 'DGT', compute: s => s.BonusDGT,    base: 0, prefixSign: true },
  { key: 'BonusMAG', label: 'MAG', compute: s => s.BonusMAG,    base: 0, prefixSign: true },
  { key: 'BonusPA',  label: 'PA',  compute: s => s['Bonus PA'], base: 0, prefixSign: true },
];

function makeVitalRow(card) {
  const row = document.createElement('div');
  row.className = `profile-vital profile-vital--${card.key.toLowerCase()}`;
  row.innerHTML = `
    <span class="profile-vital-icon">${card.icon}</span>
    <span class="profile-vital-label">${card.label}</span>
    <span class="profile-vital-bar"><span class="profile-vital-bar-fill"></span></span>
    <span class="profile-vital-value" id="profile-${card.key}">—</span>
  `;
  return row;
}

function makeStatLine(card) {
  const row = document.createElement('div');
  row.className = 'profile-stat';
  row.innerHTML = `
    <span class="profile-stat-label">${card.label}</span>
    <span class="profile-stat-value" id="profile-${card.key}">—</span>
  `;
  return row;
}

function makeCombatChip(card) {
  const chip = document.createElement('div');
  chip.className = 'profile-chip';
  chip.dataset.cardKey = card.key;
  chip.innerHTML = `
    <span class="profile-chip-label">${card.label}</span>
    <span class="profile-chip-value" id="profile-${card.key}">—</span>
  `;
  return chip;
}

function buildProfileGrid() {
  const grid = document.getElementById('profile-grid');
  if (!grid) return;
  grid.innerHTML = '';

  // Bloc 1 : Vitalité (PV + PM)
  const vitals = document.createElement('div');
  vitals.className = 'profile-vitals';
  PROFILE_VITALS.forEach(c => vitals.appendChild(makeVitalRow(c)));
  grid.appendChild(vitals);

  // Bloc 2 : Équipement (6 vignettes horizontales, ordre demandé)
  const eqWrap = document.createElement('div');
  eqWrap.className = 'profile-equipment';
  eqWrap.id = 'profile-equipment';
  grid.appendChild(eqWrap);

  // Bloc 3 : Caracs en 2 colonnes (primaires / secondaires)
  const stats = document.createElement('div');
  stats.className = 'profile-stats-grid';
  const colP = document.createElement('div'); colP.className = 'profile-stat-col';
  const colS = document.createElement('div'); colS.className = 'profile-stat-col';
  PROFILE_PRIMARY.forEach(c => colP.appendChild(makeStatLine(c)));
  PROFILE_SECONDARY.forEach(c => colS.appendChild(makeStatLine(c)));
  stats.appendChild(colP);
  stats.appendChild(colS);
  grid.appendChild(stats);

  // Bloc 4 : Stats de combat (sans titre, chips compactes)
  const combat = document.createElement('div');
  combat.className = 'profile-combat';
  PROFILE_COMBAT.forEach(c => combat.appendChild(makeCombatChip(c)));
  grid.appendChild(combat);

  // Bloc 5 : Résistances élémentaires (toujours visibles, même à 0)
  const resWrap = document.createElement('div');
  resWrap.className = 'profile-resistances';
  for (const el of ELEMENTS) {
    const chip = document.createElement('div');
    chip.className = 'profile-res-chip';
    chip.innerHTML = `
      <img src="${ELEMENT_ICONS[el]}" class="profile-res-icon" alt="${el}" title="${el}">
      <span class="profile-res-value" id="profile-res-${el}">0%</span>
    `;
    resWrap.appendChild(chip);
  }
  grid.appendChild(resWrap);
}

/* Ordre d'affichage des 6 vignettes d'équipement dans le profil */
const PROFILE_EQ_ORDER = ['head','chest','weaponMain','weaponOff','feet','fetish'];

function refreshProfileEquipment() {
  const container = document.getElementById('profile-equipment');
  if (!container) return;
  container.innerHTML = '';

  // Détection arme à 2 mains : la vignette d'arme secondaire reprend l'image, en transparence
  const main = equipment.weaponMain;
  const isTwoHanded = main && main.slot === 'Deux mains';

  for (const slotKey of PROFILE_EQ_ORDER) {
    const slot = EQUIPMENT_SLOTS.find(s => s.key === slotKey);
    let item = equipment[slotKey];
    let dimmed = false;
    let interactive = !!item;

    // Cas spécial : main secondaire affiche l'arme 2 mains en opacité réduite
    if (slotKey === 'weaponOff' && isTwoHanded) {
      item = main;
      dimmed = true;
      interactive = false; // pas de clic — c'est juste un rappel visuel
    }

    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'profile-eq-tile';

    tile.dataset.slot = slotKey; // toujours présent — sert à passer la main au openItemDetails
    if (!item) {
      // Slot vide
      tile.classList.add('profile-eq-tile--empty');
      tile.title = slot.label;
    } else {
      tile.dataset.itemId = item.id;
      if (dimmed) {
        tile.classList.add('profile-eq-tile--dimmed', 'profile-eq-tile--locked');
        tile.title = `${slot.label} (occupée par ${item.name})`;
      } else {
        tile.title = item.name;
      }
      tile.innerHTML = `<img src="https://www.kigard.fr/images/items/${item.id}.gif" class="kigard-icon-item" alt="${item.name}">`;
    }
    container.appendChild(tile);
  }
}

function refreshProfile() {
  const grid = document.getElementById('profile-grid');
  if (!grid) return;
  const stats = computeCharStats();
  const allCards = [...PROFILE_VITALS, ...PROFILE_PRIMARY, ...PROFILE_SECONDARY, ...PROFILE_COMBAT];
  for (const c of allCards) {
    const valEl = document.getElementById('profile-' + c.key);
    if (!valEl) continue;
    const value = c.compute(stats);
    const suffix = c.suffix != null ? c.suffix : '';
    const sign = (c.prefixSign && value > 0) ? '+' : '';
    valEl.textContent = `${sign}${value}${suffix}`;
    valEl.classList.toggle('boosted',  value > c.base);
    valEl.classList.toggle('debuffed', value < c.base);
  }
  // Bonus DGT/MAG/PA : toujours visibles, même à 0 (info utile à l'utilisateur)

  // Résistances élémentaires : maj des chips
  const resistances = computeElementaryResistances();
  for (const el of ELEMENTS) {
    const valEl = document.getElementById('profile-res-' + el);
    if (!valEl) continue;
    const v = resistances[el];
    valEl.textContent = `${v}%`;
    valEl.classList.toggle('boosted',  v > 0);
    valEl.classList.toggle('debuffed', v < 0);
  }

  // Équipement équipé (icônes cliquables → fiche détaillée)
  refreshProfileEquipment();
}

/**
 * Calcule les infos d'attaque d'une arme équipée (PA, Précision, Dégâts, élément, statuts).
 * Pour la main G, utilise `offhandAttack` si présent, sinon `attack`.
 * Retourne null si l'arme ne peut pas attaquer (pas de bloc attack).
 */
function computeWeaponInfo(weapon, slotKey, charStats) {
  if (!weapon || !weapon.attack) return null;
  const isOffhand = slotKey === 'weaponOff';
  const a = (isOffhand && weapon.offhandAttack) ? weapon.offhandAttack : weapon.attack;
  const isRanged = !!a.range;
  const baseStat = isRanged ? charStats.DEX : charStats.FOR;
  const dgt = baseStat + (a.BonusDGT || 0) + (charStats.BonusDGT || 0);
  const pre = charStats.PRE + (a.PRE || 0);
  return {
    PA: a.usageCost || 0,
    DGT: dgt,
    PRE: pre,
    element: a.element || null,
    statuses: Array.isArray(a.status) ? a.status : [],
    range: a.range || null,
  };
}

/**
 * Agrège les résistances élémentaires (en %) apportées par les items équipés.
 * Toujours retourne les 8 éléments (à 0 si aucun item ne couvre).
 */
function computeElementaryResistances() {
  const out = {};
  for (const el of ELEMENTS) out[el] = 0;
  for (const slot of EQUIPMENT_SLOTS) {
    const item = equipment[slot.key];
    if (!item || !Array.isArray(item.elementaryResistances)) continue;
    for (const r of item.elementaryResistances) {
      if (out[r.element] != null) out[r.element] += r.value;
    }
  }
  return out;
}

/* =========================================================
   ÉQUIPEMENT
   Grille 6 slots, ordre d'affichage (2 colonnes × 3 lignes) :
     head        | weaponMain
     chest       | weaponOff
     feet        | fetish
   weaponOff est désactivé si weaponMain est une arme à 2 mains.
   ========================================================= */

const EQUIPMENT_SLOTS = [
  { key: 'head',       label: 'Tête',     accepts: ['Tête'] },
  { key: 'weaponMain', label: 'Main D.',  accepts: ['Une main', 'Deux mains'] },
  { key: 'chest',      label: 'Buste',    accepts: ['Buste'] },
  { key: 'weaponOff',  label: 'Main G.',  accepts: ['Une main'] },
  { key: 'feet',       label: 'Pieds',    accepts: ['Pieds'] },
  { key: 'fetish',     label: 'Fétiche',  accepts: ['Fétiche'] },
];

// État équipement : { head: itemObj | null, ... }
const equipment = {};
for (const s of EQUIPMENT_SLOTS) equipment[s.key] = null;

/* =========================================================
   SERTISSAGE
   Chaque slot d'équipement peut accueillir 1 ou 2 gemmes
   (selon item.doubleSetting). Chaque gemme donne +1 sur une
   carac primaire. Plafond global de 3 bonus par type de gemme :
   au-delà, c'est du gâchis (mais autorisé par l'UI).
   ========================================================= */

const GEMS = [
  { name: 'Rubis',     id: 172, stat: 'FOR' },
  { name: 'Topaze',    id: 173, stat: 'CON' },
  { name: 'Émeraude',  id: 174, stat: 'INT' },
  { name: 'Saphir',    id: 175, stat: 'DEX' },
  { name: 'Améthyste', id: 176, stat: 'CHA' },
  { name: 'Diamant',   id: 341, stat: 'ESP' },
];
const GEM_BY_NAME = Object.fromEntries(GEMS.map(g => [g.name, g]));
const GEM_CAP = 3; // max 3 bonus par type de gemme comptabilisés

// État sertissage : { head: [gemName|null, gemName|null], ... }
const settings = {};
for (const s of EQUIPMENT_SLOTS) settings[s.key] = [null, null];

function gemSlotsForItem(item) {
  if (!item) return 0;
  return item.doubleSetting ? 2 : 1;
}

/* =========================================================
   ENCHANTEMENT
   Chaque slot d'équipement peut recevoir UN enchantement.
   Sur les armes à 2 mains (enhancedEnchantment: true), le
   bonus est DOUBLÉ (mais c'est toujours un seul enchantement
   choisi, pas deux différents — différence avec les gemmes).
   Plafond global de 3 instances par type d'enchantement.
   ========================================================= */

const ENCHANTMENTS = [
  { name: 'Croc',          id: 209, stat: 'PRE',      bonus: 5,  suffix: '%' },
  { name: 'Racine',        id: 208, stat: 'MM',       bonus: 5,  suffix: '%' },
  { name: 'Queue',         id: 71,  stat: 'ESQ',      bonus: 5,  suffix: '%' },
  { name: 'Carapace',      id: 314, stat: 'DM',       bonus: 5,  suffix: '%' },
  { name: 'Oeil',          id: 69,  stat: 'OBS',      bonus: 5,  suffix: '%' },
  { name: 'Encre',         id: 342, stat: 'DIS',      bonus: 5,  suffix: '%' },
  { name: 'Rose des rois', id: 40,  stat: 'Bonus PA', bonus: 25, suffix: ''  },
];
const ENCHANT_BY_NAME = Object.fromEntries(ENCHANTMENTS.map(e => [e.name, e]));
const ENCHANT_CAP = 3; // max 3 instances par type

// État : enchantments[slotKey] = nom de l'enchantement (ou null)
const enchantments = {};
for (const s of EQUIPMENT_SLOTS) enchantments[s.key] = null;

function enchantMultiplierForItem(item) {
  if (!item) return 0;
  return item.enhancedEnchantment ? 2 : 1;
}

/**
 * Agrège les enchantements appliqués. Le multiplicateur (2 pour les armes 2 mains)
 * compte chaque slot enchanté comme 2 instances. Le plafond ENCHANT_CAP limite
 * ensuite à 3 instances par type.
 */
function computeEnchantBonuses() {
  const counts = {};
  for (const slot of EQUIPMENT_SLOTS) {
    const item = equipment[slot.key];
    if (!item) continue;
    const ench = enchantments[slot.key];
    if (!ench) continue;
    const mult = enchantMultiplierForItem(item);
    counts[ench] = (counts[ench] || 0) + mult;
  }
  const bonuses = {};
  for (const [name, n] of Object.entries(counts)) {
    const e = ENCHANT_BY_NAME[name];
    if (!e) continue;
    const capped = Math.min(ENCHANT_CAP, n);
    bonuses[e.stat] = (bonuses[e.stat] || 0) + capped * e.bonus;
  }
  return bonuses;
}

/**
 * Compte les gemmes serties (en respectant le nb de slots autorisés par l'item)
 * et applique le plafond GEM_CAP. Retourne un objet { stat: bonus } à ajouter
 * aux caracs.
 */
function computeGemBonuses() {
  const counts = {};
  for (const slot of EQUIPMENT_SLOTS) {
    const item = equipment[slot.key];
    if (!item) continue;
    const max = gemSlotsForItem(item);
    const gems = settings[slot.key] || [];
    for (let i = 0; i < max; i++) {
      const g = gems[i];
      if (g) counts[g] = (counts[g] || 0) + 1;
    }
  }
  const bonuses = {};
  for (const [name, n] of Object.entries(counts)) {
    const gem = GEM_BY_NAME[name];
    if (!gem) continue;
    bonuses[gem.stat] = (bonuses[gem.stat] || 0) + Math.min(GEM_CAP, n);
  }
  return bonuses;
}

function itemIconUrl(item) {
  // Cohérent avec main.js : extension .gif sur kigard.fr
  return `https://www.kigard.fr/images/items/${item.id}.gif`;
}

function makeEquipmentSlot(slot) {
  const wrap = document.createElement('div');
  wrap.className = 'eq-slot';
  wrap.dataset.slot = slot.key;
  wrap.innerHTML = `
    <button class="eq-icon" type="button" aria-label="Choisir un item pour ${slot.label}">
      <span class="eq-empty">+</span>
    </button>
    <span class="eq-label">${slot.label}</span>
    <div class="eq-gems" data-slot="${slot.key}" hidden>
      <i class="eq-row-icon fa-solid fa-gem" aria-hidden="true" title="Sertissage"></i>
      <button class="eq-gem-slot" type="button" data-gem-idx="0" aria-label="Sertir une gemme"></button>
      <button class="eq-gem-slot" type="button" data-gem-idx="1" aria-label="Sertir une gemme"></button>
    </div>
    <div class="eq-enchant" data-slot="${slot.key}" hidden>
      <i class="eq-row-icon eq-row-icon--gold fa-solid fa-hand-sparkles" aria-hidden="true" title="Enchantement"></i>
      <button class="eq-enchant-slot" type="button" aria-label="Enchanter">
        <span class="eq-enchant-x2" hidden>×2</span>
      </button>
    </div>
  `;
  return wrap;
}

function refreshEquipmentSlot(slot) {
  const wrap = document.querySelector(`.eq-slot[data-slot="${slot.key}"]`);
  if (!wrap) return;
  const iconEl = wrap.querySelector('.eq-icon');
  let item = equipment[slot.key];
  let dimmed = false;

  // Cas spécial : main secondaire reprend l'image de l'arme 2 mains
  // (rappel visuel — opacité réduite via la classe .disabled sur le wrap).
  if (slot.key === 'weaponOff') {
    const main = equipment.weaponMain;
    const isTwoHanded = main && main.slot === 'Deux mains';
    if (isTwoHanded && !item) {
      item = main;
      dimmed = true;
    }
    wrap.classList.toggle('disabled', isTwoHanded);
  }

  if (item) {
    iconEl.innerHTML = `<img src="${itemIconUrl(item)}" alt="${item.name}" class="kigard-icon-item">`;
    iconEl.setAttribute('aria-label', dimmed
      ? `${slot.label} (occupée par ${item.name})`
      : `${slot.label} : ${item.name}`);
  } else {
    iconEl.innerHTML = '<span class="eq-empty">+</span>';
    iconEl.setAttribute('aria-label', `Choisir un item pour ${slot.label}`);
  }

  // Emplacements de gemme : visibles uniquement si un item est réellement équipé
  // (pas en mode "dimmed/2 mains") et selon le nombre de slots de l'item
  const gemsWrap = wrap.querySelector('.eq-gems');
  const realItem = equipment[slot.key];
  const max = gemSlotsForItem(realItem);
  const slotsBtns = gemsWrap.querySelectorAll('.eq-gem-slot');
  if (max === 0) {
    gemsWrap.hidden = true;
  } else {
    gemsWrap.hidden = false;
    const gems = settings[slot.key] || [];
    slotsBtns.forEach((btn, i) => {
      btn.hidden = i >= max;
      btn.dataset.gemIdx = i;
      const gemName = gems[i];
      if (gemName) {
        const gem = GEM_BY_NAME[gemName];
        btn.classList.add('filled');
        btn.title = `${gem.name} (+1 ${gem.stat})`;
        btn.innerHTML = `<img src="https://www.kigard.fr/images/items/${gem.id}.gif" alt="${gem.name}">`;
      } else {
        btn.classList.remove('filled');
        btn.title = 'Sertir une gemme';
        btn.innerHTML = '';
      }
    });
  }

  // Emplacement d'enchantement : 1 seul, visible si item équipé.
  // Badge "×2" affiché si enhancedEnchantment.
  const enchantWrap = wrap.querySelector('.eq-enchant');
  const enchantBtn = enchantWrap ? enchantWrap.querySelector('.eq-enchant-slot') : null;
  if (!enchantWrap || !enchantBtn) return;

  if (!realItem) {
    enchantWrap.hidden = true;
  } else {
    enchantWrap.hidden = false;
    const ench = enchantments[slot.key];
    const doubled = !!realItem.enhancedEnchantment;
    const x2Html = doubled ? '<span class="eq-enchant-x2">×2</span>' : '';
    if (ench) {
      const e = ENCHANT_BY_NAME[ench];
      const totalBonus = doubled ? 2 * e.bonus : e.bonus;
      enchantBtn.classList.add('filled');
      enchantBtn.title = `${e.name} (+${totalBonus}${e.suffix} ${e.stat}${doubled ? ' — doublé' : ''})`;
      enchantBtn.innerHTML =
        `<img src="https://www.kigard.fr/images/items/${e.id}.gif" alt="${e.name}">` + x2Html;
    } else {
      enchantBtn.classList.remove('filled');
      enchantBtn.title = doubled ? 'Enchanter (bonus ×2)' : 'Enchanter';
      enchantBtn.innerHTML = x2Html;
    }
  }
}

function refreshEquipment() {
  for (const s of EQUIPMENT_SLOTS) refreshEquipmentSlot(s);
  // Propage les stats permanentes des items sur les caracs/dérivées
  refreshAll();
}

/* =========================================================
   PICKER D'ITEMS
   Modale qui s'ouvre au clic sur un slot d'équipement.
   - Filtre les items par leur slot (selon EQUIPMENT_SLOTS.accepts)
   - Recherche par nom (normalisée pour ignorer accents + apostrophes courbes)
   - Clic sur un item → équipement, modale fermée
   - "Retirer l'item équipé" visible si le slot a déjà un item
   ========================================================= */

let activePickerSlot = null;

// Reprise de la même normalisation que main.js (Safari-safe)
function normalizeSearch(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[‘’‚‛′]/g, "'")
    .replace(/[“”„‟″]/g, '"')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

// Mapping clé brute → label affiché en résumé
const STAT_LABELS = {
  FOR: 'FOR', DEX: 'DEX', INT: 'INT', CON: 'CON', ESP: 'ESP', CHA: 'CHA',
  ARM: 'ARM', RES: 'RES',
  BonusDGT: 'DGT', BonusMAG: 'MAG', 'Bonus PA': 'PA',
  PRE: 'PRE', ESQ: 'ESQ', MM: 'MM', DM: 'DM', OBS: 'OBS', DIS: 'DIS',
};
const STAT_FLAT = ['FOR','DEX','INT','CON','ESP','CHA','ARM','RES','BonusDGT','BonusMAG','Bonus PA'];
const STAT_PCT  = ['PRE','ESQ','MM','DM','OBS','DIS'];

// Éléments du jeu, dans l'ordre d'affichage du profil
const ELEMENTS = ['Feu','Glace','Foudre','Lumière','Ombre','Eau','Terre','Vent'];

// Icônes officielles depuis kigard.fr (id selon la convention in-game)
const ELEMENT_ICONS = {
  Feu:     'https://www.kigard.fr/images/elements/1.gif?v=2.15.06',
  Glace:   'https://www.kigard.fr/images/elements/2.gif?v=2.15.06',
  Foudre:  'https://www.kigard.fr/images/elements/3.gif?v=2.15.06',
  Lumière: 'https://www.kigard.fr/images/elements/4.gif?v=2.15.06',
  Ombre:   'https://www.kigard.fr/images/elements/5.gif?v=2.15.06',
  Eau:     'https://www.kigard.fr/images/elements/6.gif?v=2.15.06',
  Terre:   'https://www.kigard.fr/images/elements/7.gif?v=2.15.06',
  Vent:    'https://www.kigard.fr/images/elements/8.gif?v=2.15.06',
};

function elementIcon(name) {
  const url = ELEMENT_ICONS[name];
  if (!url) return name;
  return `<img src="${url}" class="elem-icon" alt="${name}" title="${name}">`;
}

// Icônes des statuts (modificateurs Kigard) — mêmes URLs que main.js du bestiaire
const STATUS_ICONS = {
  'Saignement':    'https://www.kigard.fr/images/modificateur/17.gif?v=2.15.06',
  'Faille':        'https://www.kigard.fr/images/modificateur/3.gif?v=2.15.06',
  'Terreur':       'https://www.kigard.fr/images/modificateur/20.gif?v=2.15.06',
  'Nécrose':       'https://www.kigard.fr/images/modificateur/9.gif?v=2.15.06',
  'Lenteur':       'https://www.kigard.fr/images/modificateur/2.gif?v=2.15.06',
  'Assommé':       'https://www.kigard.fr/images/modificateur/1.gif?v=2.15.06',
  'Poison':        'https://www.kigard.fr/images/modificateur/4.gif?v=2.15.06',
  'Poison rapide': 'https://www.kigard.fr/images/modificateur/46.gif?v=2.15.06',
  'Brûlure':       'https://www.kigard.fr/images/modificateur/16.gif?v=2.15.06',
  'Exposition':    'https://www.kigard.fr/images/modificateur/32.gif?v=2.15.06',
  'Gel':           'https://www.kigard.fr/images/modificateur/39.gif?v=2.15.06',
  'Cécité':        'https://www.kigard.fr/images/modificateur/38.gif?v=2.15.06',
};

function statusIcon(name) {
  const url = STATUS_ICONS[name];
  if (!url) return name;
  return `<img src="${url}" class="status-icon" alt="${name}" title="${name}">`;
}

/**
 * Construit un résumé compact des stats d'un item pour le picker.
 * Ordre : (1) infos d'attaque si présentes — PA, DGT, élément, portée, statuts, bonus contextuels
 *         (2) stats permanentes (à la racine de l'item)
 * Permet à l'utilisateur de comparer les armes sans naviguer dans la fiche détaillée.
 */
function summarizeItemStats(item) {
  const attackParts = [];
  const a = item.attack;
  if (a) {
    if (a.usageCost) attackParts.push(`${a.usageCost} PA`);
    if (a.BonusDGT)  attackParts.push(`DGT ${a.BonusDGT > 0 ? '+' : ''}${a.BonusDGT}`);
    if (a.element)   attackParts.push(elementIcon(a.element));
    // Portée volontairement omise — les joueurs la connaissent par cœur,
    // et ça fait gagner de la place dans le résumé compact.
    if (Array.isArray(a.status)) {
      for (const s of a.status) attackParts.push(`Inflige ${s.value} ${statusIcon(s.status)}`);
    }
    // Bonus contextuels (s'appliquent pendant l'attaque uniquement)
    for (const k of STAT_PCT) {
      if (a[k]) attackParts.push(`${k} ${a[k] > 0 ? '+' : ''}${a[k]}%`);
    }
  }

  // Stats permanentes à la racine (s'appliquent dès que l'item est équipé)
  const permParts = [];
  for (const k of STAT_FLAT) {
    const v = item[k];
    if (v) permParts.push(`${STAT_LABELS[k]} ${v > 0 ? '+' : ''}${v}`);
  }
  for (const k of STAT_PCT) {
    const v = item[k];
    if (v) permParts.push(`${STAT_LABELS[k]} ${v > 0 ? '+' : ''}${v}%`);
  }

  // Capacité de sortilèges (réceptacles, boucliers magiques) :
  // affiché comme "N × [icône parchemin]" pour signaler les slots disponibles
  if (item.magicalSpace) {
    permParts.push(
      `${item.magicalSpace} <img src="https://www.kigard.fr/images/items/276.gif?v=2.15.06" class="parch-icon" alt="parchemin" title="emplacement(s) de sortilège">`
    );
  }

  return [...attackParts, ...permParts].join(' · ');
}

function getItemsForSlot(slot) {
  return Object.values(ITEMS)
    .filter(it => slot.accepts.includes(it.slot))
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
}

/* ── Règles d'incompatibilité ──
   Catégories pour lesquelles on ne peut pas équiper deux items du même weaponType */
const UNIQUE_WEAPON_TYPES = new Set([
  'Bouclier',
  'Réceptacle de sorts',
  'Instrument',
  'Symbole',
  'Focaliseur de sorts',
]);

/**
 * Vérifie si `item` peut être équipé dans `slotKey`, étant donné l'équipement actuel.
 * L'item présent dans `slotKey` est ignoré (puisqu'on est en train de le remplacer).
 * Retourne { ok: true } ou { ok: false, reason: "..." }.
 */
function checkItemCompatibility(item, slotKey) {
  const otherItems = EQUIPMENT_SLOTS
    .filter(s => s.key !== slotKey)
    .map(s => equipment[s.key])
    .filter(it => it != null);

  // Règle B : max 1 item avec magicalSpace sur tout l'équipement
  if (item.magicalSpace) {
    const conflict = otherItems.find(it => it.magicalSpace);
    if (conflict) {
      return {
        ok: false,
        reason: `Objet contenant des sortilèges déjà équipé (${conflict.name})`,
      };
    }
  }

  // Règle C : pas deux items du même weaponType pour les catégories spéciales
  if (UNIQUE_WEAPON_TYPES.has(item.weaponType)) {
    const conflict = otherItems.find(it => it.weaponType === item.weaponType);
    if (conflict) {
      return {
        ok: false,
        reason: `${item.weaponType} déjà équipé (${conflict.name})`,
      };
    }
  }

  return { ok: true };
}

function renderPickerList(query) {
  const slot = EQUIPMENT_SLOTS.find(s => s.key === activePickerSlot);
  if (!slot) return;
  const list  = document.getElementById('picker-list');
  const empty = document.getElementById('picker-empty');
  const equippedItem = equipment[slot.key];

  const q = normalizeSearch(query || '');
  const items = getItemsForSlot(slot)
    .filter(it => !q || normalizeSearch(it.name).includes(q));

  list.innerHTML = '';

  if (items.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  for (const item of items) {
    const isEquipped = equippedItem && equippedItem.id === item.id;
    // L'item déjà équipé est compatible (= remplacement de lui-même)
    const compat = isEquipped ? { ok: true } : checkItemCompatibility(item, slot.key);
    const stats = summarizeItemStats(item);

    const classes = ['picker-item'];
    if (isEquipped) classes.push('equipped');
    if (!compat.ok) classes.push('incompatible');

    const row = document.createElement('button');
    row.type = 'button';
    row.className = classes.join(' ');
    row.dataset.itemId = item.id;
    if (!compat.ok) row.disabled = true;

    const subline = compat.ok
      ? `<span class="picker-stats">${stats || '—'}</span>`
      : `<span class="picker-incompat-reason">${compat.reason}</span>`;

    row.innerHTML = `
      <span class="picker-icon">
        <img src="https://www.kigard.fr/images/items/${item.id}.gif" alt="" class="kigard-icon-item">
      </span>
      <span class="picker-info">
        <span class="picker-name">${item.name}</span>
        ${subline}
      </span>
    `;

    if (compat.ok) {
      row.addEventListener('click', () => {
        equipment[slot.key] = item;
        settings[slot.key] = [null, null];     // reset gemmes
        enchantments[slot.key] = null;          // reset enchantement
        // Si on équipe une 2 mains, on libère la main secondaire
        if (slot.key === 'weaponMain' && item.slot === 'Deux mains') {
          equipment.weaponOff = null;
          settings.weaponOff = [null, null];
          enchantments.weaponOff = null;
        }
        closePicker();
        refreshEquipment();
      });
    }
    list.appendChild(row);
  }
}

function openItemPicker(slotKey) {
  const slot = EQUIPMENT_SLOTS.find(s => s.key === slotKey);
  if (!slot) return;
  activePickerSlot = slotKey;

  document.getElementById('picker-title').textContent = `Choisir : ${slot.label}`;
  const search = document.getElementById('picker-search');
  search.value = '';
  renderPickerList('');

  document.getElementById('picker-footer').hidden = !equipment[slotKey];

  document.getElementById('item-picker').classList.add('open');
  setTimeout(() => search.focus(), 50);
}

function closePicker() {
  document.getElementById('item-picker').classList.remove('open');
  activePickerSlot = null;
}

function setupPicker() {
  const overlay = document.getElementById('item-picker');
  const search  = document.getElementById('picker-search');

  overlay.querySelector('.modal-close').addEventListener('click', closePicker);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePicker();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closePicker();
  });

  search.addEventListener('input', (e) => renderPickerList(e.target.value));

  document.getElementById('picker-remove').addEventListener('click', () => {
    if (activePickerSlot) {
      equipment[activePickerSlot] = null;
      settings[activePickerSlot] = [null, null];
      enchantments[activePickerSlot] = null;
      closePicker();
      refreshEquipment();
    }
  });

  // Délégation : clic sur un slot d'équipement → ouvre le picker
  // (les clics sur les emplacements de gemme et d'enchantement sont gérés à part)
  document.getElementById('equipment-grid').addEventListener('click', (e) => {
    if (e.target.closest('.eq-gem-slot')) return;
    if (e.target.closest('.eq-enchant-slot')) return;
    const slotEl = e.target.closest('.eq-slot');
    if (!slotEl || slotEl.classList.contains('disabled')) return;
    openItemPicker(slotEl.dataset.slot);
  });
}

/* =========================================================
   GEM PICKER — modale de sertissage
   Ouverte au clic sur un emplacement de gemme dans l'onglet Équipement.
   Affiche les 6 gemmes (icône + nom + bonus) et un bouton "Retirer".
   ========================================================= */

let activeGemSlot = null; // { slotKey, gemIdx }

function renderGemGrid() {
  const grid = document.getElementById('gem-grid');
  if (!grid || !activeGemSlot) return;
  const { slotKey, gemIdx } = activeGemSlot;
  const current = settings[slotKey][gemIdx];

  grid.innerHTML = '';
  for (const gem of GEMS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gem-card' + (current === gem.name ? ' selected' : '');
    btn.innerHTML = `
      <img src="https://www.kigard.fr/images/items/${gem.id}.gif" alt="${gem.name}" class="gem-card-icon">
      <span class="gem-card-name">${gem.name}</span>
      <span class="gem-card-bonus">+1 ${gem.stat}</span>
    `;
    btn.addEventListener('click', () => {
      settings[slotKey][gemIdx] = gem.name;
      closeGemPicker();
      refreshEquipment();
    });
    grid.appendChild(btn);
  }
}

function openGemPicker(slotKey, gemIdx) {
  activeGemSlot = { slotKey, gemIdx };
  const slot = EQUIPMENT_SLOTS.find(s => s.key === slotKey);
  const item = equipment[slotKey];
  document.getElementById('gem-picker-title').textContent =
    item ? `Sertir : ${slot.label} — ${item.name}` : `Sertir : ${slot.label}`;
  renderGemGrid();
  document.getElementById('gem-picker-footer').hidden = !settings[slotKey][gemIdx];
  document.getElementById('gem-picker').classList.add('open');
}

function closeGemPicker() {
  document.getElementById('gem-picker').classList.remove('open');
  activeGemSlot = null;
}

function setupGemPicker() {
  const overlay = document.getElementById('gem-picker');
  if (!overlay) return;
  overlay.querySelector('.modal-close').addEventListener('click', closeGemPicker);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeGemPicker();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeGemPicker();
  });

  document.getElementById('gem-remove').addEventListener('click', () => {
    if (!activeGemSlot) return;
    settings[activeGemSlot.slotKey][activeGemSlot.gemIdx] = null;
    closeGemPicker();
    refreshEquipment();
  });

  // Délégation : clic sur un emplacement de gemme dans la grille équipement
  document.getElementById('equipment-grid').addEventListener('click', (e) => {
    const gemBtn = e.target.closest('.eq-gem-slot');
    if (!gemBtn) return;
    const slotEl = gemBtn.closest('.eq-slot');
    if (!slotEl) return;
    const slotKey = slotEl.dataset.slot;
    if (!equipment[slotKey]) return; // pas d'item, pas de sertissage
    const idx = parseInt(gemBtn.dataset.gemIdx, 10);
    openGemPicker(slotKey, idx);
  });
}

/* =========================================================
   ENCHANT PICKER — modale d'enchantement
   Ouverte au clic sur l'emplacement d'enchantement d'un slot.
   Affiche les 7 ressources possibles + un bouton "Retirer".
   ========================================================= */

let activeEnchantSlot = null; // slotKey

function renderEnchantGrid() {
  const grid = document.getElementById('enchant-grid');
  if (!grid || !activeEnchantSlot) return;
  const current = enchantments[activeEnchantSlot];
  const item = equipment[activeEnchantSlot];
  const doubled = !!(item && item.enhancedEnchantment);

  grid.innerHTML = '';
  for (const e of ENCHANTMENTS) {
    const totalBonus = doubled ? 2 * e.bonus : e.bonus;
    const sign = totalBonus > 0 ? '+' : '';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gem-card' + (current === e.name ? ' selected' : '');
    btn.innerHTML = `
      <img src="https://www.kigard.fr/images/items/${e.id}.gif" alt="${e.name}" class="gem-card-icon">
      <span class="gem-card-name">${e.name}</span>
      <span class="gem-card-bonus">${sign}${totalBonus}${e.suffix} ${e.stat}</span>
    `;
    btn.addEventListener('click', () => {
      enchantments[activeEnchantSlot] = e.name;
      closeEnchantPicker();
      refreshEquipment();
    });
    grid.appendChild(btn);
  }
}

function openEnchantPicker(slotKey) {
  activeEnchantSlot = slotKey;
  const slot = EQUIPMENT_SLOTS.find(s => s.key === slotKey);
  const item = equipment[slotKey];
  const titleEl = document.getElementById('enchant-picker-title');
  let title = item ? `Enchanter : ${slot.label} — ${item.name}` : `Enchanter : ${slot.label}`;
  if (item && item.enhancedEnchantment) title += ' (×2)';
  titleEl.textContent = title;
  renderEnchantGrid();
  document.getElementById('enchant-picker-footer').hidden = !enchantments[slotKey];
  document.getElementById('enchant-picker').classList.add('open');
}

function closeEnchantPicker() {
  document.getElementById('enchant-picker').classList.remove('open');
  activeEnchantSlot = null;
}

function setupEnchantPicker() {
  const overlay = document.getElementById('enchant-picker');
  if (!overlay) return;
  overlay.querySelector('.modal-close').addEventListener('click', closeEnchantPicker);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeEnchantPicker();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeEnchantPicker();
  });

  document.getElementById('enchant-remove').addEventListener('click', () => {
    if (!activeEnchantSlot) return;
    enchantments[activeEnchantSlot] = null;
    closeEnchantPicker();
    refreshEquipment();
  });

  // Délégation : clic sur l'emplacement d'enchantement
  document.getElementById('equipment-grid').addEventListener('click', (e) => {
    const enchantBtn = e.target.closest('.eq-enchant-slot');
    if (!enchantBtn) return;
    const slotEl = enchantBtn.closest('.eq-slot');
    if (!slotEl) return;
    const slotKey = slotEl.dataset.slot;
    if (!equipment[slotKey]) return;
    openEnchantPicker(slotKey);
  });
}

/* =========================================================
   FICHE DÉTAILLÉE D'UN ITEM
   Modale ouverte depuis l'onglet Profil au clic sur une carte d'équipement.
   ========================================================= */

function permanentStatsLines(item) {
  const lines = [];
  for (const k of STAT_FLAT) {
    if (item[k]) lines.push(`${STAT_LABELS[k]} ${item[k] > 0 ? '+' : ''}${item[k]}`);
  }
  for (const k of STAT_PCT) {
    if (item[k]) lines.push(`${STAT_LABELS[k]} ${item[k] > 0 ? '+' : ''}${item[k]}%`);
  }
  return lines;
}

/**
 * Ouvre la fiche détaillée d'un item. Si slotKey est fourni (= ouvert
 * depuis une vignette d'équipement du profil), on affiche les gemmes
 * et l'enchantement actifs sur ce slot, et on choisit attack/offhandAttack
 * selon la main concernée (cas Main-gauche).
 */
function openItemDetails(item, slotKey) {
  const modal = document.getElementById('item-details');
  if (!modal) return;

  document.getElementById('item-details-icon').src =
    `https://www.kigard.fr/images/items/${item.id}.gif`;
  document.getElementById('item-details-icon').alt = item.name;
  document.getElementById('item-details-name').textContent = item.name;
  // Sous-titre du header vidé : on remet le tout dans le body pour matcher l'in-game
  document.getElementById('item-details-sub').innerHTML = '';

  const sections = [];

  // ─── 1. Bloc "Équipement | <slot>" + "(<weaponType>)" ───
  const slotLabel = item.slot || '';
  const wtLine = item.weaponType ? `<div class="details-wt"><em>(${item.weaponType})</em></div>` : '';
  sections.push(`
    <div class="details-typeline">
      <span>Équipement</span>
      <span class="details-slotname"><em>${slotLabel}</em></span>
    </div>
    ${wtLine}
  `);

  // ─── 2. Bloc Attaquer (selon main équipée si Main-gauche) ───
  // Sur main G, on utilise offhandAttack si présent. Sinon attack.
  let attackBlock = null;
  if (slotKey === 'weaponOff' && item.offhandAttack) {
    attackBlock = item.offhandAttack;
  } else if (item.attack) {
    attackBlock = item.attack;
  }
  if (attackBlock) {
    const a = attackBlock;
    const rangeText = a.range ? `Portée ${a.range.min} à ${a.range.max}` : 'Contact';
    const paLine = a.usageCost != null
      ? `<span class="details-pa">${a.usageCost} PA</span>` : '';
    const innerLines = [];
    if (a.BonusDGT != null) {
      const elemSuffix = a.element ? ` ${elementIcon(a.element)}` : '';
      innerLines.push(`DGT ${a.BonusDGT > 0 ? '+' : ''}${a.BonusDGT}${elemSuffix}`);
    } else if (a.element) {
      innerLines.push(`${elementIcon(a.element)} ${a.element}`);
    }
    if (Array.isArray(a.status)) {
      for (const s of a.status) innerLines.push(`Inflige ${s.value} ${statusIcon(s.status)}`);
    }
    for (const k of STAT_PCT) {
      if (a[k]) innerLines.push(`${k} ${a[k] > 0 ? '+' : ''}${a[k]}%`);
    }
    sections.push(`
      <div class="details-attack">
        <div class="details-attack-head">
          <span><strong>Attaquer</strong> (${rangeText})</span>
          ${paLine}
        </div>
        <div class="details-attack-body">
          ${innerLines.map(l => `<div>${l}</div>`).join('')}
        </div>
      </div>
    `);
  }

  // ─── 3. Stats hors attack (sans titre) ───
  const permLines = permanentStatsLines(item);
  if (permLines.length) {
    sections.push(`
      <div class="details-perm">
        ${permLines.map(l => `<div>${l}</div>`).join('')}
      </div>
    `);
  }

  // ─── 4. Enchantement actif (uniquement si ouvert depuis un slot équipé) ───
  // Juste la stat et la valeur — pas besoin de répéter le nom de la ressource
  // ni de noter ×2 (l'utilisateur sait que c'est doublé sur une arme 2 mains).
  if (slotKey && enchantments[slotKey]) {
    const enchName = enchantments[slotKey];
    const e = ENCHANT_BY_NAME[enchName];
    if (e) {
      const itemEquipped = equipment[slotKey];
      const doubled = !!(itemEquipped && itemEquipped.enhancedEnchantment);
      const total = doubled ? 2 * e.bonus : e.bonus;
      const sign = total > 0 ? '+' : '';
      sections.push(`
        <div class="details-enchant">
          <i class="fa-solid fa-hand-sparkles" aria-hidden="true"></i>
          <div>${sign}${total}${e.suffix} ${e.stat}</div>
        </div>
      `);
    }
  }

  // ─── 5. Sertissage actif (uniquement si ouvert depuis un slot équipé) ───
  // Une icône fa-gem par ligne — la stat suffit, pas besoin du nom de la gemme.
  if (slotKey && settings[slotKey]) {
    const itemEquipped = equipment[slotKey];
    const max = gemSlotsForItem(itemEquipped);
    const gems = settings[slotKey].slice(0, max).filter(Boolean);
    const lines = gems.map(name => {
      const g = GEM_BY_NAME[name];
      return g
        ? `<div class="details-gems"><i class="fa-solid fa-gem" aria-hidden="true"></i><div>+1 ${g.stat}</div></div>`
        : '';
    }).filter(Boolean);
    if (lines.length) sections.push(lines.join(''));
  }

  // ─── 6. Résistances élémentaires natives de l'item ───
  if (Array.isArray(item.elementaryResistances) && item.elementaryResistances.length) {
    const lines = item.elementaryResistances.map(r =>
      `${elementIcon(r.element)} ${r.element} ${r.value > 0 ? '+' : ''}${r.value}%`
    );
    sections.push(`
      <div class="details-perm">
        ${lines.map(l => `<div>${l}</div>`).join('')}
      </div>
    `);
  }

  // ─── 7. Effets spéciaux (magicalSpace, regen, affinity, etc.) ───
  const effects = [];
  if (item.magicalSpace) {
    effects.push(`Peut contenir ${item.magicalSpace} sortilège${item.magicalSpace > 1 ? 's' : ''}`);
  }
  if (item.regeneration) effects.push(`Régénération <strong>${item.regeneration}</strong> PV/tour`);
  if (item.elementaryAffinity) {
    effects.push(`Affinité ${elementIcon(item.elementaryAffinity)} ${item.elementaryAffinity}`);
  }
  if (effects.length) {
    sections.push(`
      <div class="details-perm">
        ${effects.map(l => `<div>${l}</div>`).join('')}
      </div>
    `);
  }

  // ─── 8. Footer : rang (★) + poids ───
  const footerParts = [];
  if (item.rank != null) {
    footerParts.push(`<span><i class="fa-solid fa-star" aria-hidden="true"></i> ${item.rank}</span>`);
  }
  if (item.weight != null) {
    footerParts.push(`<span><i class="fa-solid fa-weight-hanging" aria-hidden="true"></i> ${item.weight}</span>`);
  }
  if (footerParts.length) {
    sections.push(`<div class="details-footer">${footerParts.join('')}</div>`);
  }

  document.getElementById('item-details-body').innerHTML = sections.join('');
  modal.classList.add('open');
}

function closeItemDetails() {
  const modal = document.getElementById('item-details');
  if (modal) modal.classList.remove('open');
}

function setupItemDetails() {
  const modal = document.getElementById('item-details');
  if (!modal) return;
  modal.querySelector('.modal-close').addEventListener('click', closeItemDetails);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeItemDetails();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeItemDetails();
  });

  // Délégation : clic sur une vignette d'équipement du profil ouvre la fiche
  const profileEq = document.getElementById('profile-equipment');
  if (profileEq) {
    profileEq.addEventListener('click', (e) => {
      const tile = e.target.closest('.profile-eq-tile');
      if (!tile) return;
      // Vignettes vides ou "locked" (2 mains qui occupe la main G) → pas de fiche
      if (tile.classList.contains('profile-eq-tile--locked')) return;
      if (tile.classList.contains('profile-eq-tile--empty')) return;
      const item = ITEMS[tile.dataset.itemId];
      if (item) openItemDetails(item, tile.dataset.slot);
    });
  }
}

/* =========================================================
   ONGLETS
   ========================================================= */

function setupTabs() {
  const tabs = document.querySelectorAll('.builder-tab');
  const panels = document.querySelectorAll('.tab-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      panels.forEach(p => { p.hidden = p.dataset.tab !== target; });
    });
  });
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  // Onglet Évolution
  const primary = document.getElementById('primary-stats');
  const secondary = document.getElementById('secondary-stats');
  PRIMARY_STATS.forEach(s => primary.appendChild(makeStatRow(s)));
  SECONDARY_STATS.forEach(s => secondary.appendChild(makeStatRow(s)));

  // Onglet Équipement
  const eqGrid = document.getElementById('equipment-grid');
  EQUIPMENT_SLOTS.forEach(s => eqGrid.appendChild(makeEquipmentSlot(s)));

  // Onglet Profil
  buildProfileGrid();

  // Click delegation sur les boutons +/- (caracs)
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.stat-btn');
    if (!btn || btn.disabled) return;
    const key = btn.dataset.key;
    const action = btn.dataset.action;
    if (action === 'inc' && state[key] < MAX_UPGRADES) {
      state[key]++;
    } else if (action === 'dec' && state[key] > 0) {
      state[key]--;
    }
    refreshAll();
  });

  // Reset
  document.getElementById('reset-btn').addEventListener('click', () => {
    for (const s of ALL_STATS) state[s.key] = 0;
    refreshAll();
  });

  setupTabs();
  setupPicker();
  setupGemPicker();
  setupEnchantPicker();
  setupItemDetails();
  refreshAll();
  refreshEquipment();
});
