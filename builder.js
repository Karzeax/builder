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
  // L'onglet Compétences consomme le rang (PE) + vocations + équipement
  refreshSkills();
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

  // Masquage de la ligne PM si Mysticisme n'est pas dans les vocations équipées
  // (les PM sont inutiles sans sortilèges ni techniques de méditation)
  const pmRow = document.querySelector('.profile-vital--pm');
  if (pmRow) pmRow.style.display = (typeof vocations !== 'undefined' && vocations.includes('Mysticisme')) ? '' : 'none';

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
          <div>${e.stat} ${sign}${total}${e.suffix}</div>
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
        ? `<div class="details-gems"><i class="fa-solid fa-gem" aria-hidden="true"></i><div>${g.stat} +1</div></div>`
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
    // Détail des bonus exacts (cohérent avec elementaryAffinityBonus)
    effects.push(
      `Affinité ${elementIcon(item.elementaryAffinity)} ${item.elementaryAffinity}` +
      ` : <strong>+${AFFINITY_MAG_BONUS} MAG</strong>` +
      ` et <strong>+${Math.round(AFFINITY_PCT_MM_BONUS * 100)}% MM</strong>` +
      ` <em>(sortilèges ${item.elementaryAffinity})</em>`
    );
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

/* =========================================================
   PHASE B — Mini-évaluateur de formules
   ---------------------------------------------------------
   evalFormula(expr, ctx)
     - expr : string ("1.5*FOR", "MAG/5", "(FOR+DEX)/2",
              "4*target.Brûlure", "default", null)
     - ctx  : { stats: {FOR,DEX,…,MAG,BonusDGT,…}, target: {…} }
   Retourne { value, ok, reason, isDefault? }.
   "default" → ok=true, isDefault=true (le caller utilise la
   formule canonique de l'arme). Sinon parse + évalue.
   ========================================================= */

const FORMULA_VARS = new Set([
  'FOR','DEX','INT','CON','ESP','CHA',
  'PRE','ESQ','MM','DM','OBS','DIS',
  'ARM','RES','MAG',
  'BonusDGT','BonusMAG','BonusPA',
  'PV','PM',
]);

function evalFormula(expr, ctx) {
  if (expr == null) return { value: null, ok: false, reason: 'Aucune formule' };
  if (expr === 'default') return { value: null, ok: true, reason: null, isDefault: true };
  ctx = ctx || {};
  const stats = ctx.stats || {};
  const target = ctx.target || {};
  try {
    const tokens = tokenizeFormula(expr);
    const parser = new FormulaParser(tokens, stats, target);
    const value = parser.parseExpr();
    if (!parser.isAtEnd()) {
      return { value: null, ok: false, reason: `Tokens inattendus` };
    }
    if (Number.isNaN(value) || !Number.isFinite(value)) {
      return { value: null, ok: false, reason: 'Résultat non numérique' };
    }
    return { value, ok: true, reason: null };
  } catch (e) {
    return { value: null, ok: false, reason: e.message || 'Erreur d\'évaluation' };
  }
}

function tokenizeFormula(expr) {
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    const c = expr[i];
    if (c === ' ' || c === '\t') { i++; continue; }
    if (c === '(' || c === ')' || c === '+' || c === '-' || c === '*' || c === '/') {
      tokens.push({ type: 'op', value: c }); i++; continue;
    }
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < expr.length && /[0-9.]/.test(expr[j])) j++;
      const num = parseFloat(expr.slice(i, j));
      if (Number.isNaN(num)) throw new Error(`Nombre invalide: ${expr.slice(i,j)}`);
      tokens.push({ type: 'num', value: num });
      i = j; continue;
    }
    if (/[A-Za-zÀ-ÖØ-öø-ÿ_]/.test(c)) {
      let j = i;
      while (j < expr.length && /[A-Za-zÀ-ÖØ-öø-ÿ0-9_.]/.test(expr[j])) j++;
      tokens.push({ type: 'id', value: expr.slice(i, j) });
      i = j; continue;
    }
    throw new Error(`Caractère inconnu: '${c}'`);
  }
  return tokens;
}

class FormulaParser {
  constructor(tokens, stats, target) {
    this.tokens = tokens; this.pos = 0;
    this.stats = stats; this.target = target;
  }
  isAtEnd() { return this.pos >= this.tokens.length; }
  peek()    { return this.tokens[this.pos]; }
  consume() { return this.tokens[this.pos++]; }
  parseExpr() {
    let left = this.parseTerm();
    while (!this.isAtEnd() && (this.peek().value === '+' || this.peek().value === '-')) {
      const op = this.consume().value;
      const right = this.parseTerm();
      left = (op === '+') ? left + right : left - right;
    }
    return left;
  }
  parseTerm() {
    let left = this.parseFactor();
    while (!this.isAtEnd() && (this.peek().value === '*' || this.peek().value === '/')) {
      const op = this.consume().value;
      const right = this.parseFactor();
      if (op === '*') left = left * right;
      else {
        if (right === 0) throw new Error('Division par zéro');
        left = left / right;
      }
    }
    return left;
  }
  parseFactor() {
    if (this.isAtEnd()) throw new Error('Expression incomplète');
    const t = this.peek();
    if (t.type === 'op' && t.value === '-') { this.consume(); return -this.parseFactor(); }
    if (t.type === 'op' && t.value === '+') { this.consume(); return  this.parseFactor(); }
    if (t.type === 'num') { this.consume(); return t.value; }
    if (t.type === 'op' && t.value === '(') {
      this.consume();
      const v = this.parseExpr();
      if (this.isAtEnd() || this.peek().value !== ')') throw new Error('Parenthèse fermante manquante');
      this.consume();
      return v;
    }
    if (t.type === 'id') { this.consume(); return this.resolveIdentifier(t.value); }
    throw new Error(`Token inattendu`);
  }
  resolveIdentifier(id) {
    if (id.startsWith('target.')) {
      const key = id.slice(7);
      const v = this.target[key];
      if (v == null) throw new Error(`target.${key} non défini`);
      if (typeof v !== 'number') throw new Error(`target.${key} non numérique`);
      return v;
    }
    if (id === 'BonusPA' && this.stats['Bonus PA'] != null) return this.stats['Bonus PA'];
    // Alias des stats agrégées (convention Kigard) :
    //   MAG = somme des BonusMAG (puissance magique du perso)
    //   DGT = somme des BonusDGT (bonus de dégâts permanent)
    // Côté state, ces totaux sont stockés respectivement sous 'BonusMAG' et 'BonusDGT'.
    if (id === 'MAG' && this.stats.BonusMAG != null) return this.stats.BonusMAG;
    if (id === 'DGT' && this.stats.BonusDGT != null) return this.stats.BonusDGT;
    if (FORMULA_VARS.has(id)) {
      const v = this.stats[id];
      return (v == null) ? 0 : v;  // stat absente = 0 (permissif)
    }
    throw new Error(`Variable inconnue: ${id}`);
  }
}

/**
 * Arrondi kigardien (probabiliste) : pour 4.4, 60% chance de 4, 40% chance de 5.
 * Pour de l'affichage déterministe, utiliser kigardianRoundParts.
 */
function applyKigardianRound(value) {
  const floor = Math.floor(value);
  const frac = value - floor;
  if (frac === 0) return floor;
  return Math.random() < frac ? floor + 1 : floor;
}
function kigardianRoundParts(value) {
  const floor = Math.floor(value);
  const frac = value - floor;
  return { floor, ceil: floor + 1, pCeil: frac, deterministic: frac === 0 };
}

/**
 * Range de dégâts (esquive / blocage / normal / critique) pour STAT + DGT donnés.
 * Le critique applique critMul (défaut 1.5) uniquement sur STAT.
 * ±10% sur le total final, partie entière à la toute fin.
 * postMul (défaut 1) = multiplicateur post-formule (affinité élémentaire, vuln/résistance,
 * etc.). Appliqué avant le floor pour respecter "partie entière à la toute fin uniquement".
 */
function computeDamageRange(STAT, DGT, critMul, postMul) {
  const crit = (critMul == null) ? 1.5 : critMul;
  const m    = (postMul == null) ? 1   : postMul;
  return {
    dodge:    { min: 0, max: 0 },
    block:    { min: Math.floor((STAT/2  + DGT) * 0.9 * m), max: Math.floor((STAT/2  + DGT) * 1.1 * m) },
    normal:   { min: Math.floor((STAT    + DGT) * 0.9 * m), max: Math.floor((STAT    + DGT) * 1.1 * m) },
    critical: { min: Math.floor((STAT*crit + DGT) * 0.9 * m), max: Math.floor((STAT*crit + DGT) * 1.1 * m) },
  };
}

/* =========================================================
   AFFINITÉ ÉLÉMENTAIRE
   Un item portant `elementaryAffinity: "<élément>"` confère, pour les sortilèges
   du même élément lancés par le porteur :
     • +2 MAG    (additif au DGT du sort — donc impacte les plages de dégâts)
     • +10 % MM  (additif aux points de MM, PAS multiplicatif —
                  ex: MM 30 + 1 affinité = MM 40, pas MM 33)
   Plusieurs items d'affinité du même élément cumulent.
   ========================================================= */
const AFFINITY_MAG_BONUS = 2;   // points de MAG (DGT)
const AFFINITY_MM_BONUS  = 10;  // points de MM (additif)

function elementaryAffinityBonus(element, eq) {
  if (!element) return { addMAG: 0, addMM: 0 };
  let addMAG = 0, addMM = 0;
  for (const slot of EQUIPMENT_SLOTS) {
    const it = eq[slot.key];
    if (it && it.elementaryAffinity === element) {
      addMAG += AFFINITY_MAG_BONUS;
      addMM  += AFFINITY_MM_BONUS;
    }
  }
  return { addMAG, addMM };
}

// Catégorisation arme → 'melee' / 'ranged' / 'melee_2h'
const MELEE_WEAPONS_FORMULA = new Set(['Épée','Hache','Dague','Gant','Lance','Masse','Fouet']);
const RANGED_WEAPONS_FORMULA = new Set(['Arc','Fusil']);
function weaponCategoryOf(item) {
  if (!item || !item.weaponType) return null;
  const isTwoH = item.slot === 'Deux mains';
  if (MELEE_WEAPONS_FORMULA.has(item.weaponType))  return isTwoH ? 'melee_2h' : 'melee';
  if (RANGED_WEAPONS_FORMULA.has(item.weaponType)) return 'ranged';
  return null;
}

/**
 * Vérifie tous les prérequis d'une compétence (vocation, arme, slot).
 * Retourne { ok, reason } — reason est du HTML court pour l'affichage.
 */
function isCompetenceFunctional(comp, state) {
  state = state || {};
  const p = comp.prereq || {};
  const vocs = state.vocations || [];
  const eq = state.equipment || {};

  if (p.vocation) {
    if (!vocs.includes(p.vocation)) {
      return { ok: false, reason: `Requiert la vocation <strong>${p.vocation}</strong>` };
    }
  }
  // Slot + weaponType : on traite les 2 ensemble pour donner un message ciblé
  // (ex: "Requiert un Bouclier en main gauche" plutôt que "Requiert une arme en main gauche")
  const wantOff   = p.slot === 'weaponOff';
  const wantTypes = Array.isArray(p.weaponType) && p.weaponType.length ? p.weaponType : null;
  const typeLabel = wantTypes
    ? (wantTypes.length === 1 ? wantTypes[0] : wantTypes.join(' / '))
    : null;

  if (wantOff && wantTypes) {
    // Doit être dans la main gauche ET du bon type
    const off = eq.weaponOff;
    if (!off || !wantTypes.includes(off.weaponType)) {
      return { ok: false, reason: `Requiert ${typeLabel} en main gauche` };
    }
  } else if (wantOff) {
    // Slot seul : n'importe quel item "Une main" en main gauche suffit
    if (!eq.weaponOff || eq.weaponOff.slot !== 'Une main') {
      return { ok: false, reason: 'Requiert un item en main gauche' };
    }
  } else if (wantTypes) {
    // Type seul : on accepte le match dans n'importe quelle main (un bouclier
    // en main droite c'est rare mais autorisé dans Kigard)
    const main = eq.weaponMain;
    const off  = eq.weaponOff;
    const mainMatch = main && wantTypes.includes(main.weaponType);
    const offMatch  = off  && wantTypes.includes(off.weaponType);
    if (!mainMatch && !offMatch) {
      return { ok: false, reason: `Requiert ${typeLabel} équipé` };
    }
  }
  if (p.weaponCategory) {
    const main = eq.weaponMain;
    const cat = weaponCategoryOf(main);
    if (cat !== p.weaponCategory) {
      const labels = {
        melee:    'arme de mêlée',
        ranged:   'arme à distance',
        melee_2h: 'arme à deux mains de mêlée',
      };
      return { ok: false, reason: `Requiert ${labels[p.weaponCategory] || p.weaponCategory}` };
    }
  }
  if (Array.isArray(p.weaponExclude) && p.weaponExclude.length) {
    const main = eq.weaponMain;
    if (main && p.weaponExclude.includes(main.weaponType)) {
      return { ok: false, reason: `Incompatible avec ${main.weaponType}` };
    }
  }
  return { ok: true, reason: null };
}

/* =========================================================
   PHASE C — RANG, VOCATIONS, COMPÉTENCES
   ========================================================= */

const RANK_DEFS = [
  { key: 1, name: 'Baroudeur',  peMax: 999,   slots: 3 },
  { key: 2, name: 'Aventurier', peMax: 2999,  slots: 4 },
  { key: 3, name: 'Héros',      peMax: 5999,  slots: 5 },
  { key: 4, name: 'Champion',   peMax: 9999,  slots: 6 },
  { key: 5, name: 'Légende',    peMax: 999999, slots: 7 },
];
function computeRank(peUsed) {
  for (const r of RANK_DEFS) if (peUsed <= r.peMax) return r;
  return RANK_DEFS[RANK_DEFS.length - 1];
}

const VOCATIONS = [
  { name: 'Mysticisme',        icon: 'fa-hat-wizard',          desc: 'Sortilèges, techniques de méditation' },
  { name: 'Médecine',          icon: 'fa-staff-snake',         desc: 'Soins, opérations, potions' },
  { name: 'Furtivité',         icon: 'fa-user-ninja',          desc: 'Disparition, embuscade' },
  { name: 'Art de la guerre',  icon: 'fa-shield',              desc: 'Techniques de réaction (protéger, riposter)' },
  { name: 'Équitation',        icon: 'fa-horse',               desc: 'Cavalerie' },
  { name: 'Empathie',          icon: 'fa-hands-holding-child', desc: 'Soutien dévoué' },
  { name: 'Compagnons',        icon: 'fa-paw',                 desc: 'Liens animaux (à préciser)' },
];
const VOCATION_BY_NAME = Object.fromEntries(VOCATIONS.map(v => [v.name, v]));
const MAX_VOCATIONS = 2;

// État : 2 cases de vocation (par ordre d'ajout), liste d'IDs de compétences équipées
const vocations = [null, null];
const competencesEquipped = []; // ['11','13',…] (IDs string, identiques aux clés de COMPETENCES)
// Sortilèges placés dans le livre de magie (via items à magicalSpace).
// Stockés à part car ils ne consomment pas les slots rang+2.
const spellsInBook = [];

function vocationsUsed()       { return vocations.filter(v => v != null).length; }
function maxCapacitySlots()    { return computeRank(totalPEUsed()).slots; }
function availableSkillSlots() {
  return Math.max(0, maxCapacitySlots() - vocationsUsed() - competencesEquipped.length);
}

/** Somme des magicalSpace fournis par tous les items équipés. */
function totalMagicalSpace() {
  let s = 0;
  for (const slot of EQUIPMENT_SLOTS) {
    const it = equipment[slot.key];
    if (it && it.magicalSpace) s += it.magicalSpace;
  }
  return s;
}
function availableSpellSlots() {
  return Math.max(0, totalMagicalSpace() - spellsInBook.length);
}
/**
 * Auto-supprime les sortilèges en surplus quand le total magicalSpace baisse
 * (ex: on retire le réceptacle de sorts). Suppression silencieuse depuis la fin
 * de la liste (FIFO inversé : on garde les plus anciens).
 */
function pruneSpellsInBook() {
  const max = totalMagicalSpace();
  while (spellsInBook.length > max) spellsInBook.pop();
}

/** Une compétence est-elle déjà équipée (slot normal OU livre de magie) ? */
function isCompEquippedAnywhere(id) {
  return competencesEquipped.includes(id) || spellsInBook.includes(id);
}

function compIconFor(comp) {
  const cat = comp.category || 'autre';
  if (cat === 'sortilege') return { cls: 'sortilege', icon: 'fa-wand-magic-sparkles' };
  if (cat === 'technique') return { cls: 'technique', icon: 'fa-hand-fist' };
  if (cat === 'talent')    return { cls: 'talent',    icon: 'fa-star' };
  return { cls: 'technique', icon: 'fa-circle' };
}

function summarizeCompetence(comp) {
  const parts = [];
  if (comp.cost) {
    if (comp.cost.pa != null) parts.push(`<span class="pa">${comp.cost.pa} PA</span>`);
    if (comp.cost.pm === 'same') parts.push(`<span class="pm">${comp.cost.pa} PM</span>`);
    else if (typeof comp.cost.pm === 'number' && comp.cost.pm > 0) parts.push(`<span class="pm">${comp.cost.pm} PM</span>`);
  }
  if (comp.range && typeof comp.range === 'object') {
    if (comp.range.min != null) {
      const r = comp.range.min === comp.range.max ? `${comp.range.min}` : `${comp.range.min}–${comp.range.max}`;
      parts.push(`Portée ${r}`);
    } else if (comp.range.type) {
      const m = { weapon: 'Portée arme', 'weapon+1': 'Portée arme +1', self: 'Auto-cible' };
      parts.push(m[comp.range.type] || comp.range.type);
    }
  }
  if (comp.area) parts.push(comp.area);
  if (comp.element && ELEMENT_ICONS[comp.element]) {
    parts.push(`<img src="${ELEMENT_ICONS[comp.element]}" class="elem-icon" alt="${comp.element}">`);
  }
  if (comp.prereq && comp.prereq.vocation) parts.push(`<span class="voc">${comp.prereq.vocation}</span>`);
  return parts.join(' · ');
}

function buildSkillsState() {
  return {
    vocations: vocations.filter(v => v != null),
    equipment: { ...equipment },
  };
}

/**
 * Calcule les plages bloqué/normal/critique d'une compétence pour les stats/équipement courants.
 * Retourne :
 *  - null               si la compétence n'inflige pas de dégâts / soins
 *  - { error: "..." }   si la formule est insoluble (ex: arme requise mais aucune équipée)
 *  - { kind, critMul, element, range, STAT, DGT }
 *      où range = { block, normal, critical } (chaque entrée { min, max })
 *
 * Conventions (cf PROJECT_STATE) :
 *   • formula === "default"  → utilise la formule canonique de l'arme (STAT=FOR/DEX, DGT=BonusDGT)
 *   • formula === "MAG"      → convention sortilège : STAT=INT, DGT=MAG (BonusMAG agrégé)
 *   • autre formule         → STAT=eval(formula), DGT=BonusDGT de l'arme si weaponDgtSource défini
 *   • criticalMultiplier=1   → pas d'augmentation au critique (ex: Soin stimulant)
 */
function computeCompetenceDamage(comp, charStats, eq) {
  if (!comp.damage || !comp.damage.formula) return null;
  const d = comp.damage;

  let STAT = 0;
  let DGT = 0;

  if (d.formula === 'default') {
    const src = d.weaponDgtSource || 'main';
    const slotKey = src === 'off' ? 'weaponOff' : 'weaponMain';
    const w = eq[slotKey];
    if (!w || !w.attack) return { error: 'Aucune arme équipée' };
    const atk = (slotKey === 'weaponOff' && w.offhandAttack) ? w.offhandAttack : w.attack;
    // Distance ↔ DEX, sinon FOR (Fouet est range mais reste indexé DEX d'après le jeu)
    const isRanged = !!atk.range;
    STAT = isRanged ? charStats.DEX : charStats.FOR;
    DGT = (atk.BonusDGT || 0) + (charStats.BonusDGT || 0);
  } else if (d.formula === 'MAG' && (d.kind === 'magical' || d.kind === 'heal')) {
    // Convention sortilège : STAT = INT, DGT = MAG agrégé (= BonusMAG total)
    STAT = charStats.INT || 0;
    DGT = charStats.BonusMAG || 0;
  } else {
    const res = evalFormula(d.formula, { stats: charStats });
    if (!res.ok) return { error: res.reason || 'Formule non évaluable' };
    STAT = res.value;
    if (d.weaponDgtSource) {
      const src = d.weaponDgtSource;
      const slotKey = src === 'off' ? 'weaponOff' : 'weaponMain';
      const w = eq[slotKey];
      if (w && w.attack) {
        const atk = (slotKey === 'weaponOff' && w.offhandAttack) ? w.offhandAttack : w.attack;
        DGT = (atk.BonusDGT || 0) + (charStats.BonusDGT || 0);
      }
    }
  }

  // Affinité élémentaire de l'équipement : +2 MAG additif par item en affinité
  // sur l'élément du sort. (Le bonus +10% MM est informatif, pas appliqué aux dégâts.)
  const aff = elementaryAffinityBonus(comp.element, eq);
  if (aff.addMAG) DGT += aff.addMAG;

  const critMul = d.criticalMultiplier != null ? d.criticalMultiplier : 1.5;
  const range = computeDamageRange(STAT, DGT, critMul);
  return { kind: d.kind, critMul, element: comp.element, range, STAT, DGT, affinity: aff };
}

// Format : "X – Y" (avec tiret cadratin)
function fmtRange(r) {
  return r.min === r.max ? `${r.min}` : `${r.min} – ${r.max}`;
}

/**
 * Calcule la valeur du jet (précision) d'une compétence, comme si la cible
 * imaginaire avait 0 dans la stat de défense correspondante (ESQ pour PRE,
 * DM pour MM). Permet à l'utilisateur de vérifier que le calcul est bon.
 *
 * Règles :
 *   - kind = magical OU (heal + vocation Mysticisme) → base MM
 *   - sinon (physical / heal Médecine) → base PRE
 *   - preMod : modificateur additif (ex: Attaque puissante -15)
 *   - precisionFormula : formule personnalisée override (ex: "PRE + MM/2")
 *   - affinité élémentaire : +10% MM par item d'affinité sur l'élément du sort
 *
 * Retourne { value, breakdown } où breakdown est un résumé textuel des étapes.
 */
function computePrecisionInfo(comp, charStats, eq) {
  if (!comp.damage) return null;
  const d = comp.damage;
  const voc = (comp.prereq && comp.prereq.vocation) || null;

  // 1. Formule personnalisée (override total)
  if (d.precisionFormula) {
    const res = evalFormula(d.precisionFormula, { stats: charStats });
    if (res.ok) {
      return { value: Math.floor(res.value), breakdown: d.precisionFormula };
    }
  }

  // 2. Stat de base selon la nature de la compétence
  const baseStat = (d.kind === 'magical' || (d.kind === 'heal' && voc === 'Mysticisme'))
    ? 'MM' : 'PRE';
  let value = charStats[baseStat] || 0;
  let parts = [baseStat];

  // 3. preMod additif
  if (d.preMod) {
    value += d.preMod;
    parts.push(d.preMod > 0 ? `+${d.preMod}` : `${d.preMod}`);
  }

  // 4. Affinité élémentaire : +10% MM par item en affinité sur l'élément
  if (baseStat === 'MM' && comp.element) {
    const aff = elementaryAffinityBonus(comp.element, eq);
    if (aff.pctMM > 0) {
      const pctTotal = aff.pctMM;
      value = Math.floor(value * (1 + pctTotal));
      parts.push(`+${Math.round(pctTotal * 100)}% affinité`);
    }
  }

  return { value, breakdown: parts.join(' ') };
}

/**
 * Construit le HTML des lignes de dégâts d'une compétence à afficher sous le résumé.
 * - 3 lignes (Bloqué / Normal / Critique) pour kind = physical / magical / pure
 * - 1 ligne "Soigne" + 1 ligne "Critique" (uniquement si critMul ≠ 1) pour kind = heal
 * - Pour les sortilèges magiques, le "blocage" reste affiché (canon Kigard : DM ↔ MM)
 */
function damageLinesHtml(damageInfo, precInfo) {
  if (!damageInfo && !precInfo) return '';

  // Ligne de jet (précision) — toujours affichée si on peut la calculer
  const precRow = precInfo
    ? `<div class="dmg-row dmg-row--precision"><span class="dmg-label">Jet</span><span class="dmg-value">${precInfo.value} <span class="dmg-prec-detail">(${precInfo.breakdown})</span></span></div>`
    : '';

  if (!damageInfo) {
    return precRow ? `<div class="dmg-lines">${precRow}</div>` : '';
  }
  if (damageInfo.error) {
    return `<div class="dmg-lines">${precRow}<div class="dmg-error">${damageInfo.error}</div></div>`;
  }
  const r = damageInfo.range;
  const elem = damageInfo.element && ELEMENT_ICONS[damageInfo.element]
    ? ` <img src="${ELEMENT_ICONS[damageInfo.element]}" class="elem-icon" alt="${damageInfo.element}">`
    : '';

  if (damageInfo.kind === 'heal') {
    const critRow = damageInfo.critMul !== 1
      ? `<div class="dmg-row"><span class="dmg-label">Critique</span><span class="dmg-value">${fmtRange(r.critical)} PV</span></div>`
      : '';
    return `
      <div class="dmg-lines dmg-lines--heal">
        ${precRow}
        <div class="dmg-row"><span class="dmg-label">Soigne</span><span class="dmg-value">${fmtRange(r.normal)} PV</span></div>
        ${critRow}
      </div>`;
  }

  return `
    <div class="dmg-lines">
      ${precRow}
      <div class="dmg-row"><span class="dmg-label">Bloqué</span><span class="dmg-value">${fmtRange(r.block)}${elem}</span></div>
      <div class="dmg-row"><span class="dmg-label">Normal</span><span class="dmg-value">${fmtRange(r.normal)}${elem}</span></div>
      <div class="dmg-row"><span class="dmg-label">Critique</span><span class="dmg-value">${fmtRange(r.critical)}${elem}</span></div>
    </div>`;
}

/* ── Picker de vocations ── */
let activeVocationSlot = null;

function renderVocationsList() {
  const list = document.getElementById('vocation-list');
  if (!list) return;
  const currentSlot = activeVocationSlot;
  const currentName = currentSlot != null ? vocations[currentSlot] : null;
  list.innerHTML = '';
  for (const voc of VOCATIONS) {
    const inOtherSlot = vocations.some((v, i) => v === voc.name && i !== currentSlot);
    const isCurrent = voc.name === currentName;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'vocation-pick-item';
    if (isCurrent)   btn.classList.add('equipped');
    if (inOtherSlot) btn.classList.add('incompatible');
    const tag = isCurrent ? '<span class="voc-equipped-tag">✓ équipée</span>' : '';
    const reason = inOtherSlot
      ? `<div class="voc-reason"><i class="fa-solid fa-circle-exclamation"></i>Déjà dans l'autre slot</div>` : '';
    btn.innerHTML = `
      <span class="voc-icon"><i class="fa-solid ${voc.icon}"></i></span>
      <span class="voc-body">
        <div class="voc-name">${voc.name}</div>
        <div class="voc-desc">${voc.desc}</div>
        ${reason}
      </span>
      ${tag}
    `;
    if (!inOtherSlot) {
      btn.addEventListener('click', () => {
        vocations[currentSlot] = voc.name;
        closeVocationPicker();
        refreshAll();
      });
    } else {
      btn.disabled = true;
    }
    list.appendChild(btn);
  }
}

function openVocationPicker(slotIdx) {
  activeVocationSlot = slotIdx;
  document.getElementById('vocation-picker-title').textContent =
    `Choisir la vocation ${slotIdx+1}/2`;
  renderVocationsList();
  document.getElementById('vocation-picker-footer').hidden = !vocations[slotIdx];
  document.getElementById('vocation-picker').classList.add('open');
}
function closeVocationPicker() {
  document.getElementById('vocation-picker').classList.remove('open');
  activeVocationSlot = null;
}
function setupVocationPicker() {
  const overlay = document.getElementById('vocation-picker');
  if (!overlay) return;
  overlay.querySelector('.modal-close').addEventListener('click', closeVocationPicker);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeVocationPicker(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeVocationPicker();
  });
  document.getElementById('vocation-remove').addEventListener('click', () => {
    if (activeVocationSlot == null) return;
    vocations[activeVocationSlot] = null;
    closeVocationPicker();
    refreshAll();
  });
}

/* ── Picker de compétences ── */
let activeCompFilter = 'all';
let compSearchQuery = '';
// 'normal' = picker des slots de capacités (rang+2)
// 'spell'  = picker du livre de magie (magicalSpace), forcé aux sortilèges,
//           sans check de vocation (équipable par n'importe qui, juste inactif sans Mysticisme)
let compPickerMode = 'normal';

function getAllCompetences() {
  if (typeof COMPETENCES === 'undefined') return [];
  return Object.entries(COMPETENCES)
    .map(([id, comp]) => ({ id, ...comp }))
    .filter(c => c && c.name && c.category);
}

function renderCompPickerList() {
  const list = document.getElementById('comp-picker-list');
  const empty = document.getElementById('comp-picker-empty');
  if (!list) return;
  const state = buildSkillsState();
  const q = normalizeSearch(compSearchQuery);
  const isSpellMode = compPickerMode === 'spell';
  const noSlot = isSpellMode
    ? availableSpellSlots() <= 0
    : availableSkillSlots() <= 0;

  // En mode 'spell' on évalue la "compatibilité" sans la check de vocation
  // (l'item peut être équipé même sans Mysticisme — il sera juste marqué inactif).
  function compatFor(c) {
    if (!isSpellMode) return isCompetenceFunctional(c, state);
    // Mode spell : on ignore la prereq vocation pour décider si on peut équiper
    const stripped = { ...c, prereq: { ...(c.prereq || {}), vocation: null } };
    return isCompetenceFunctional(stripped, state);
  }

  // Tri par groupe de priorité (apprenables en haut, incompatibles en bas)
  //  0 = apprenable (compatible + slot libre, pas déjà équipée)
  //  1 = déjà équipée
  //  2 = bloquée par manque de slot
  //  3 = incompatible (prérequis manquant)
  function priorityOf(c) {
    const equipped = isCompEquippedAnywhere(c.id);
    const compat = compatFor(c);
    if (equipped) return 1;
    if (compat.ok && !noSlot) return 0;
    if (compat.ok && noSlot)  return 2;
    return 3;
  }

  const filtered = getAllCompetences()
    .filter(c => isSpellMode
      ? c.category === 'sortilege'   // mode spell : sortilèges uniquement
      : (activeCompFilter === 'all' || c.category === activeCompFilter))
    .filter(c => !q || normalizeSearch(c.name).includes(q))
    .sort((a, b) => {
      const pa = priorityOf(a), pb = priorityOf(b);
      if (pa !== pb) return pa - pb;
      return a.name.localeCompare(b.name, 'fr');
    });

  list.innerHTML = '';
  if (filtered.length === 0) { empty.hidden = false; return; }
  empty.hidden = true;

  // Insertion de séparateurs visuels entre les groupes de priorité
  const GROUP_LABELS = {
    0: 'Disponibles',
    1: 'Déjà équipées',
    2: 'Plus de slot libre',
    3: 'Incompatibles',
  };
  let lastGroup = null;

  for (const c of filtered) {
    const isEquipped = isCompEquippedAnywhere(c.id);
    const compat = compatFor(c);
    const grp = priorityOf(c);

    // Ajoute un en-tête de groupe quand on change de priorité
    if (grp !== lastGroup) {
      const header = document.createElement('div');
      header.className = 'picker-group-header picker-group-header--' + grp;
      header.textContent = GROUP_LABELS[grp];
      list.appendChild(header);
      lastGroup = grp;
    }

    const cls = ['picker-item','comp-pick'];
    let disabled = false;
    let reason = null;
    if (isEquipped) cls.push('equipped');
    if (!isEquipped && !compat.ok) {
      cls.push('incompatible'); disabled = true; reason = compat.reason;
    } else if (!isEquipped && noSlot) {
      cls.push('incompatible'); disabled = true;
      const maxLabel = isSpellMode ? totalMagicalSpace() : maxCapacitySlots();
      reason = `Plus de slot libre (${maxLabel} max)`;
    }

    const ic = compIconFor(c);
    const summary = summarizeCompetence(c);
    const tag = isEquipped ? '<span class="picker-equipped-tag">✓ équipée</span>' : '';
    const reasonHtml = reason
      ? `<span class="picker-incompat-reason"><i class="fa-solid fa-circle-exclamation"></i>${reason}</span>` : '';

    const row = document.createElement('button');
    row.type = 'button';
    row.className = cls.join(' ');
    row.disabled = disabled;
    row.dataset.compId = c.id;
    row.innerHTML = `
      <span class="picker-icon ${ic.cls}"><i class="fa-solid ${ic.icon}"></i></span>
      <span class="picker-info">
        <span class="picker-name">${c.name}</span>
        <span class="picker-stats">${summary || '—'}</span>
        ${reasonHtml}
      </span>
      ${tag}
    `;
    if (!disabled) {
      row.addEventListener('click', () => {
        if (isEquipped) {
          // On retire dans la bonne liste (peu importe le mode)
          let i = competencesEquipped.indexOf(c.id);
          if (i >= 0) competencesEquipped.splice(i, 1);
          else {
            i = spellsInBook.indexOf(c.id);
            if (i >= 0) spellsInBook.splice(i, 1);
          }
        } else if (isSpellMode) {
          spellsInBook.push(c.id);
        } else {
          competencesEquipped.push(c.id);
        }
        closeCompPicker();
        refreshAll();
      });
    }
    list.appendChild(row);
  }
}

function openCompPicker(mode) {
  compPickerMode = mode === 'spell' ? 'spell' : 'normal';
  const free = compPickerMode === 'spell' ? availableSpellSlots() : availableSkillSlots();
  const titleNoun = compPickerMode === 'spell' ? 'un sortilège' : 'une capacité';
  document.getElementById('comp-picker-title').textContent =
    `Choisir ${titleNoun} — ${free} libre${free !== 1 ? 's' : ''}`;
  document.getElementById('comp-search').value = '';
  compSearchQuery = '';
  // En mode spell on force le filtre sur sortilèges et on cache les chips
  activeCompFilter = compPickerMode === 'spell' ? 'sortilege' : 'all';
  const filtersWrap = document.getElementById('comp-filters');
  if (filtersWrap) {
    filtersWrap.hidden = (compPickerMode === 'spell');
    document.querySelectorAll('#comp-filters .filter-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.filter === activeCompFilter);
    });
  }
  renderCompPickerList();
  document.getElementById('comp-picker-footer').hidden = true;
  document.getElementById('comp-picker').classList.add('open');
  setTimeout(() => document.getElementById('comp-search').focus(), 50);
}
function closeCompPicker() {
  document.getElementById('comp-picker').classList.remove('open');
}
function setupCompPicker() {
  const overlay = document.getElementById('comp-picker');
  if (!overlay) return;
  overlay.querySelector('.modal-close').addEventListener('click', closeCompPicker);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeCompPicker(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeCompPicker();
  });
  document.getElementById('comp-search').addEventListener('input', (e) => {
    compSearchQuery = e.target.value;
    renderCompPickerList();
  });
  document.getElementById('comp-filters').addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    activeCompFilter = chip.dataset.filter;
    document.querySelectorAll('#comp-filters .filter-chip').forEach(c =>
      c.classList.toggle('active', c === chip));
    renderCompPickerList();
  });
}

/* ── Rendu onglet Compétences ── */
function renderVocationSlot(idx) {
  const wrap = document.createElement('button');
  wrap.type = 'button';
  wrap.className = 'vocation-slot';
  wrap.dataset.slot = idx;
  const vocName = vocations[idx];
  // Le slot 2 est verrouillé tant que le slot 1 est vide (UX : on remplit en ordre)
  const locked = idx === 1 && vocations[0] == null;
  if (vocName) {
    const voc = VOCATION_BY_NAME[vocName];
    wrap.classList.add('filled');
    wrap.innerHTML = `
      <span class="voc-icon"><i class="fa-solid ${voc.icon}"></i></span>
      <span class="voc-info">
        <span class="voc-name">${voc.name}</span>
        <span class="voc-desc">${voc.desc}</span>
      </span>
      <span class="voc-remove" data-action="remove" aria-label="Retirer">×</span>
    `;
  } else if (locked) {
    wrap.classList.add('locked');
    wrap.disabled = true;
    wrap.innerHTML = `
      <span class="voc-plus voc-plus--locked"><i class="fa-solid fa-lock"></i></span>
      <span class="voc-empty">Choisis d'abord la vocation 1</span>
    `;
  } else {
    wrap.innerHTML = `
      <span class="voc-plus">+</span>
      <span class="voc-empty">Vocation ${idx+1}</span>
    `;
  }
  return wrap;
}

function refreshSkills() {
  // Auto-purge des sortilèges en surplus si on a retiré un item magicalSpace
  pruneSpellsInBook();

  // État et stats globaux pour toutes les sections (cards, plages de dégâts, etc.)
  const skillState = buildSkillsState();
  const charStats  = computeCharStats();

  // Vocations grid
  const vocGrid = document.getElementById('vocations-grid');
  if (vocGrid) {
    vocGrid.innerHTML = '';
    for (let i = 0; i < MAX_VOCATIONS; i++) vocGrid.appendChild(renderVocationSlot(i));
  }

  // En-tête capacités + pastilles + récap
  const rank = computeRank(totalPEUsed());
  const max  = rank.slots;
  const used = vocationsUsed() + competencesEquipped.length;
  const meta = document.getElementById('capacities-meta');
  if (meta) meta.textContent = `${max} slot${max>1?'s':''} (rang ${rank.name})`;

  const pillsWrap = document.getElementById('slots-pills');
  if (pillsWrap) {
    pillsWrap.innerHTML = '';
    const vUsed = vocationsUsed();
    const cUsed = competencesEquipped.length;
    for (let i = 0; i < max; i++) {
      const p = document.createElement('span');
      p.className = 'slot-pill';
      if (i < vUsed)            { p.classList.add('voc');  p.title = 'Vocation'; }
      else if (i < vUsed+cUsed) { p.classList.add('used'); p.title = 'Capacité'; }
      else                       { p.title = 'Libre'; }
      pillsWrap.appendChild(p);
    }
  }
  const summaryText = document.getElementById('slots-summary-text');
  if (summaryText) summaryText.innerHTML = `<strong>${used}</strong> / ${max} utilisés`;
  // Marqueur visuel de dépassement (PE baissés en dessous du rang requis pour les caps actuelles)
  const slotsSummary = document.getElementById('slots-summary');
  if (slotsSummary) slotsSummary.classList.toggle('over', used > max);

  // Liste des compétences équipées (avec plages de dégâts pour celles qui en ont)
  const compList = document.getElementById('comp-list');
  if (compList) {
    compList.innerHTML = '';
    if (competencesEquipped.length === 0) {
      compList.innerHTML = `<div class="comp-list-empty">Aucune capacité équipée. Clique sur « Ajouter une capacité » ci-dessous.</div>`;
    } else {
      for (const id of competencesEquipped) {
        const c = COMPETENCES[id];
        if (!c) continue;
        const ic = compIconFor(c);
        const compat = isCompetenceFunctional(c, skillState);
        const summary = summarizeCompetence(c);
        // Plages de dégâts/soins et jet — uniquement si fonctionnelle (sinon les valeurs n'ont aucun sens)
        const dmg  = compat.ok ? computeCompetenceDamage(c, charStats, equipment) : null;
        const prec = compat.ok ? computePrecisionInfo(c, charStats, equipment) : null;
        const dmgHtml = compat.ok ? damageLinesHtml(dmg, prec) : '';
        const card = document.createElement('div');
        card.className = 'comp-card' + (compat.ok ? '' : ' broken');
        card.dataset.compId = id;
        const warn = compat.ok ? '' : ` · <span class="warn">⚠ ${compat.reason}</span>`;
        card.innerHTML = `
          <span class="comp-icon ${ic.cls}"><i class="fa-solid ${ic.icon}"></i></span>
          <span class="comp-body">
            <span class="comp-name">${c.name}</span>
            <span class="comp-meta">${summary}${warn}</span>
            ${dmgHtml}
          </span>
          <button class="comp-remove" type="button" data-action="remove" aria-label="Retirer">×</button>
        `;
        compList.appendChild(card);
      }
    }
  }

  // Bouton add
  const addBtn = document.getElementById('comp-add-btn');
  const addLabel = document.getElementById('comp-add-label');
  if (addBtn && addLabel) {
    const free = availableSkillSlots();
    if (free <= 0) {
      addBtn.classList.add('disabled'); addBtn.disabled = true;
      addLabel.textContent = 'Aucun slot libre';
    } else {
      addBtn.classList.remove('disabled'); addBtn.disabled = false;
      addLabel.textContent = `Ajouter une capacité (${free} slot${free>1?'s':''} libre${free>1?'s':''})`;
    }
  }

  // Section "Sortilèges (livre de magie)" — visible uniquement si un item équipé a du magicalSpace
  const spellSection = document.getElementById('spell-book-section');
  if (spellSection) {
    const totalMag = totalMagicalSpace();
    spellSection.hidden = totalMag === 0;
    if (totalMag > 0) {
      const hasMyst = vocations.includes('Mysticisme');
      // Header meta
      const spellMeta = document.getElementById('spell-book-meta');
      if (spellMeta) {
        spellMeta.innerHTML = hasMyst
          ? `${totalMag} sortilège${totalMag>1?'s':''} en livre`
          : `${totalMag} sortilège${totalMag>1?'s':''} en livre · <span class="meta-warn">Mysticisme requis pour les lancer</span>`;
      }
      // Pastilles + récap
      const spellPills = document.getElementById('spell-book-pills');
      if (spellPills) {
        spellPills.innerHTML = '';
        const used = spellsInBook.length;
        for (let i = 0; i < totalMag; i++) {
          const p = document.createElement('span');
          p.className = 'slot-pill slot-pill--spell' + (i < used ? ' used' : '');
          p.title = i < used ? 'Sortilège' : 'Libre';
          spellPills.appendChild(p);
        }
      }
      const spellSum = document.getElementById('spell-book-summary-text');
      if (spellSum) spellSum.innerHTML = `<strong>${spellsInBook.length}</strong> / ${totalMag}`;

      // Liste des sortilèges en livre
      const spellList = document.getElementById('spell-book-list');
      if (spellList) {
        spellList.innerHTML = '';
        if (spellsInBook.length === 0) {
          spellList.innerHTML = `<div class="comp-list-empty">Aucun sortilège en livre. Clique sur « Ajouter un sortilège » ci-dessous.</div>`;
        } else {
          for (const id of spellsInBook) {
            const c = COMPETENCES[id];
            if (!c) continue;
            const ic = compIconFor(c);
            // Le sortilège est fonctionnel SI Mysticisme est équipé (les autres prereq sont déjà filtrés à l'équipage)
            const compat = isCompetenceFunctional(c, skillState);
            const summary = summarizeCompetence(c);
            const dmg  = compat.ok ? computeCompetenceDamage(c, charStats, equipment) : null;
            const prec = compat.ok ? computePrecisionInfo(c, charStats, equipment) : null;
            const dmgHtml = compat.ok ? damageLinesHtml(dmg, prec) : '';
            const card = document.createElement('div');
            card.className = 'comp-card' + (compat.ok ? '' : ' broken');
            card.dataset.compId = id;
            const warn = compat.ok ? '' : ` · <span class="warn">⚠ ${compat.reason}</span>`;
            card.innerHTML = `
              <span class="comp-icon ${ic.cls}"><i class="fa-solid ${ic.icon}"></i></span>
              <span class="comp-body">
                <span class="comp-name">${c.name}</span>
                <span class="comp-meta">${summary}${warn}</span>
                ${dmgHtml}
              </span>
              <button class="comp-remove" type="button" data-action="remove" aria-label="Retirer">×</button>
            `;
            spellList.appendChild(card);
          }
        }
      }
      // Bouton add sortilège
      const spellAddBtn = document.getElementById('spell-add-btn');
      const spellAddLbl = document.getElementById('spell-add-label');
      if (spellAddBtn && spellAddLbl) {
        const freeSp = availableSpellSlots();
        if (freeSp <= 0) {
          spellAddBtn.classList.add('disabled'); spellAddBtn.disabled = true;
          spellAddLbl.textContent = 'Livre plein';
        } else {
          spellAddBtn.classList.remove('disabled'); spellAddBtn.disabled = false;
          spellAddLbl.textContent = `Ajouter un sortilège (${freeSp} libre${freeSp>1?'s':''})`;
        }
      }
    }
  }

  // Badge rang dans le bandeau top
  const rankNameEl = document.getElementById('rank-name');
  if (rankNameEl) rankNameEl.textContent = rank.name;
}

function setupSkillsTab() {
  const vocGrid = document.getElementById('vocations-grid');
  if (vocGrid) {
    vocGrid.addEventListener('click', (e) => {
      const slotEl = e.target.closest('.vocation-slot');
      if (!slotEl) return;
      const idx = parseInt(slotEl.dataset.slot, 10);
      if (e.target.closest('[data-action="remove"]')) {
        vocations[idx] = null;
        // Si on retire la voc 1 et que la voc 2 existe, on remonte celle-ci pour
        // ne jamais laisser un trou en slot 1 avec un slot 2 rempli.
        if (idx === 0 && vocations[1] != null) {
          vocations[0] = vocations[1];
          vocations[1] = null;
        }
        refreshAll();
        return;
      }
      // Slot 2 verrouillé tant que le slot 1 est vide
      if (slotEl.classList.contains('locked')) return;
      openVocationPicker(idx);
    });
  }
  const compList = document.getElementById('comp-list');
  if (compList) {
    compList.addEventListener('click', (e) => {
      const remove = e.target.closest('[data-action="remove"]');
      if (!remove) return;
      const card = e.target.closest('.comp-card');
      if (!card) return;
      const id = card.dataset.compId;
      const idx = competencesEquipped.indexOf(id);
      if (idx >= 0) competencesEquipped.splice(idx, 1);
      refreshAll();
    });
  }
  const addBtn = document.getElementById('comp-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      if (availableSkillSlots() <= 0) return;
      openCompPicker('normal');
    });
  }
  // Livre de magie : bouton "+ Ajouter un sortilège" et suppression d'un sort du livre
  const spellAdd = document.getElementById('spell-add-btn');
  if (spellAdd) {
    spellAdd.addEventListener('click', () => {
      if (availableSpellSlots() <= 0) return;
      openCompPicker('spell');
    });
  }
  const spellList = document.getElementById('spell-book-list');
  if (spellList) {
    spellList.addEventListener('click', (e) => {
      const remove = e.target.closest('[data-action="remove"]');
      if (!remove) return;
      const card = e.target.closest('.comp-card');
      if (!card) return;
      const id = card.dataset.compId;
      const idx = spellsInBook.indexOf(id);
      if (idx >= 0) spellsInBook.splice(idx, 1);
      refreshAll();
    });
  }
}

/* =========================================================
   HOOKS — affichage PM conditionnel (Mysticisme équipé)
   ========================================================= */
function isPMVisible() { return vocations.includes('Mysticisme'); }

/* =========================================================
   TESTS INLINE — sanity check (console)
   Lance : window.__test()
   ========================================================= */
window.__test = function () {
  const tests = [];
  function eq(label, got, want) {
    const pass = JSON.stringify(got) === JSON.stringify(want);
    tests.push({ label, pass, got, want });
  }
  // evalFormula
  const s = { FOR: 14, DEX: 10, INT: 12, CON: 10, ESP: 10, CHA: 10, MAG: 5, BonusDGT: 2 };
  // Régression : un MAG=N dans le state direct (ancien usage) doit encore marcher
  eq('MAG (direct dans stats)', evalFormula('MAG', { stats: s }).value, 5);
  // Régression réelle : MAG aliasé sur BonusMAG (convention Kigard du state agrégé)
  eq('MAG aliasé sur BonusMAG',
     evalFormula('MAG', { stats: { INT: 29, BonusMAG: 6 } }).value, 6);
  eq('DGT aliasé sur BonusDGT',
     evalFormula('DGT+1', { stats: { BonusDGT: 4 } }).value, 5);
  // Plage de dégâts pour le build du user (INT=29, MAG=6) sur un sort kind=magical
  const dmgSpell = computeDamageRange(29, 6, 1.5);
  eq('Sort INT=29, MAG=6 — bloqué min',   dmgSpell.block.min,    Math.floor((29/2 + 6) * 0.9));
  eq('Sort INT=29, MAG=6 — normal max',   dmgSpell.normal.max,   Math.floor((29 + 6) * 1.1));
  eq('Sort INT=29, MAG=6 — critique min', dmgSpell.critical.min, Math.floor((29*1.5 + 6) * 0.9));
  eq('Sort INT=29, MAG=6 — critique max', dmgSpell.critical.max, Math.floor((29*1.5 + 6) * 1.1));
  eq('FOR seul',          evalFormula('FOR', { stats: s }).value, 14);
  eq('1.5*FOR',           evalFormula('1.5*FOR', { stats: s }).value, 21);
  eq('(FOR+DEX)/2',       evalFormula('(FOR+DEX)/2', { stats: s }).value, 12);
  eq('MAG/5 (1.0)',       evalFormula('MAG/5', { stats: s }).value, 1);
  eq('default → flag',    evalFormula('default', {}).isDefault, true);
  eq('null → ok=false',   evalFormula(null, {}).ok, false);
  eq('target.X',          evalFormula('4*target.Brûlure', { stats: s, target: { 'Brûlure': 3 } }).value, 12);
  eq('var inconnue',      evalFormula('foo+1', { stats: s }).ok, false);
  // isCompetenceFunctional
  const state = { vocations: ['Mysticisme'], equipment: { weaponMain: null, weaponOff: null } };
  eq('Sortilège OK avec Mysticisme',
     isCompetenceFunctional({ prereq: { vocation: 'Mysticisme' } }, state).ok, true);
  eq('Sortilège KO sans vocation',
     isCompetenceFunctional({ prereq: { vocation: 'Furtivité' } }, state).ok, false);
  eq('weaponType KO sans arme',
     isCompetenceFunctional({ prereq: { weaponType: ['Bouclier'] } }, state).ok, false);
  // Régression : bouclier en main gauche doit satisfaire weaponType=['Bouclier']
  eq('weaponType OK avec bouclier en main gauche',
     isCompetenceFunctional(
       { prereq: { weaponType: ['Bouclier'] } },
       { vocations: [], equipment: { weaponMain: null, weaponOff: { weaponType: 'Bouclier', slot: 'Une main' } } }
     ).ok, true);
  // Et inversement : épée en main droite doit satisfaire weaponType=['Épée']
  eq('weaponType OK avec épée en main droite',
     isCompetenceFunctional(
       { prereq: { weaponType: ['Épée'] } },
       { vocations: [], equipment: { weaponMain: { weaponType: 'Épée', slot: 'Une main' }, weaponOff: null } }
     ).ok, true);
  eq('slot weaponOff KO si vide',
     isCompetenceFunctional({ prereq: { slot: 'weaponOff' } }, state).ok, false);
  // slot + weaponType combinés : message ciblé
  const cdb = { prereq: { slot: 'weaponOff', weaponType: ['Bouclier'] } };
  eq('Coup de bouclier KO sans bouclier en G (message ciblé)',
     isCompetenceFunctional(cdb, { vocations: [], equipment: { weaponMain: null, weaponOff: null } }).reason,
     'Requiert Bouclier en main gauche');
  eq('Coup de bouclier OK avec bouclier en main gauche',
     isCompetenceFunctional(cdb, { vocations: [], equipment: { weaponMain: null, weaponOff: { weaponType: 'Bouclier', slot: 'Une main' } } }).ok,
     true);
  eq('Coup de bouclier KO si bouclier en main droite seulement (slot exige G)',
     isCompetenceFunctional(cdb, { vocations: [], equipment: { weaponMain: { weaponType: 'Bouclier', slot: 'Une main' }, weaponOff: null } }).ok,
     false);
  eq('Coup de bouclier KO si dague en main gauche (mauvais type)',
     isCompetenceFunctional(cdb, { vocations: [], equipment: { weaponMain: null, weaponOff: { weaponType: 'Dague', slot: 'Une main' } } }).reason,
     'Requiert Bouclier en main gauche');
  // weaponCategoryOf
  eq('Épée 1 main → melee', weaponCategoryOf({ weaponType: 'Épée', slot: 'Une main' }), 'melee');
  eq('Hache 2 mains → melee_2h', weaponCategoryOf({ weaponType: 'Hache', slot: 'Deux mains' }), 'melee_2h');
  eq('Arc → ranged', weaponCategoryOf({ weaponType: 'Arc', slot: 'Deux mains' }), 'ranged');
  // kigardianRoundParts
  const kr = kigardianRoundParts(4.4);
  eq('kr floor', kr.floor, 4);
  eq('kr ceil',  kr.ceil,  5);
  eq('kr pCeil',  Math.round(kr.pCeil*10)/10, 0.4);
  // computeDamageRange
  const dr = computeDamageRange(10, 5, 1.5);
  eq('damage normal min', dr.normal.min, Math.floor((10+5)*0.9));
  eq('damage critique max', dr.critical.max, Math.floor((10*1.5+5)*1.1));

  // computePrecisionInfo
  const csPrec = { PRE: 40, MM: 30, INT: 14, BonusMAG: 6 };
  const eqEmpty = { weaponMain: null, weaponOff: null, head: null, chest: null, feet: null, fetish: null };
  // Sortilège kind=magical → base MM
  const pSpell = computePrecisionInfo(
    { damage: { kind: 'magical', formula: 'MAG' }, prereq: { vocation: 'Mysticisme' }, element: 'Feu' },
    csPrec, eqEmpty);
  eq('Précision sort magical → MM', pSpell.value, 30);
  // Technique physique → base PRE
  const pPhys = computePrecisionInfo(
    { damage: { kind: 'physical', formula: 'default' }, prereq: {} },
    csPrec, eqEmpty);
  eq('Précision physique → PRE', pPhys.value, 40);
  // Heal Médecine → base PRE
  const pHealMed = computePrecisionInfo(
    { damage: { kind: 'heal', formula: 'INT' }, prereq: { vocation: 'Médecine' } },
    csPrec, eqEmpty);
  eq('Précision heal Médecine → PRE', pHealMed.value, 40);
  // Heal Mysticisme (Guérison) → base MM
  const pHealMyst = computePrecisionInfo(
    { damage: { kind: 'heal', formula: 'MAG' }, prereq: { vocation: 'Mysticisme' } },
    csPrec, eqEmpty);
  eq('Précision heal Mysticisme → MM', pHealMyst.value, 30);
  // preMod additif (Attaque puissante -15)
  const pPreMod = computePrecisionInfo(
    { damage: { kind: 'physical', formula: '1.5*FOR', preMod: -15 }, prereq: {} },
    csPrec, eqEmpty);
  eq('Précision avec preMod -15', pPreMod.value, 25);
  // Premiers soins → base PRE -30
  const pPSoins = computePrecisionInfo(
    { damage: { kind: 'heal', formula: 'INT', preMod: -30 }, prereq: { vocation: 'Médecine' } },
    csPrec, eqEmpty);
  eq('Précision Premiers soins (PRE -30)', pPSoins.value, 10);
  // precisionFormula override
  const pCustom = computePrecisionInfo(
    { damage: { kind: 'physical', precisionFormula: 'PRE + MM/2' }, prereq: {} },
    csPrec, eqEmpty);
  eq('Précision formule custom (PRE+MM/2)', pCustom.value, 55);
  // Affinité +10% MM sur sort de l'élément
  const eqAff = { ...eqEmpty, weaponMain: { elementaryAffinity: 'Glace' } };
  const pAffGlace = computePrecisionInfo(
    { damage: { kind: 'magical', formula: 'MAG' }, prereq: { vocation: 'Mysticisme' }, element: 'Glace' },
    csPrec, eqAff);
  eq('Précision avec affinité Glace → MM × 1.10', pAffGlace.value, Math.floor(30 * 1.10));
  // Sort de l'autre élément : pas de bonus affinité
  const pAffFeu = computePrecisionInfo(
    { damage: { kind: 'magical', formula: 'MAG' }, prereq: { vocation: 'Mysticisme' }, element: 'Feu' },
    csPrec, eqAff);
  eq('Précision affinité élément différent → MM brut', pAffFeu.value, 30);

  // Affinité élémentaire — additif sur DGT, pas multiplicatif sur dégâts
  eq('Aff. sans item → 0', elementaryAffinityBonus('Glace', { weaponMain: null }).addMAG, 0);
  eq('Aff. 1 item Glace → +2 MAG',
     elementaryAffinityBonus('Glace', { weaponMain: { elementaryAffinity: 'Glace' } }).addMAG, 2);
  eq('Aff. 1 item Glace → +10% MM',
     elementaryAffinityBonus('Glace', { weaponMain: { elementaryAffinity: 'Glace' } }).pctMM, 0.1);
  eq('Aff. 2 items Glace cumulent à +4 MAG',
     elementaryAffinityBonus('Glace', { weaponMain: { elementaryAffinity: 'Glace' }, weaponOff: { elementaryAffinity: 'Glace' } }).addMAG, 4);
  eq('Aff. élément différent ne s\'applique pas',
     elementaryAffinityBonus('Glace', { weaponMain: { elementaryAffinity: 'Feu' } }).addMAG, 0);

  // magicalSpace helpers — manipule l'état global équipement
  const _savedHead = equipment.head;
  equipment.head = { magicalSpace: 3 };
  eq('totalMagicalSpace = 3', totalMagicalSpace(), 3);
  spellsInBook.push('11', '13');
  eq('availableSpellSlots après 2 ajouts', availableSpellSlots(), 1);
  spellsInBook.push('25');
  eq('availableSpellSlots = 0 quand plein', availableSpellSlots(), 0);
  // Auto-prune quand l'item magicalSpace disparaît
  equipment.head = null;
  pruneSpellsInBook();
  eq('prune supprime tous les sortilèges en surplus', spellsInBook.length, 0);
  // Restaure l'état
  equipment.head = _savedHead;

  const passed = tests.filter(t => t.pass).length;
  const total  = tests.length;
  console.group(`%c[__test] ${passed}/${total} OK`,
    passed === total ? 'color:#22c55e;font-weight:bold' : 'color:#f87171;font-weight:bold');
  for (const t of tests) {
    console.log(`%c${t.pass ? '✓' : '✗'}%c ${t.label}`,
      t.pass ? 'color:#22c55e' : 'color:#f87171', 'color:inherit',
      t.pass ? '' : `(got ${JSON.stringify(t.got)}, want ${JSON.stringify(t.want)})`);
  }
  console.groupEnd();
  return tests;
};

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
  setupVocationPicker();
  setupCompPicker();
  setupSkillsTab();
  refreshAll();
  refreshEquipment();
});
