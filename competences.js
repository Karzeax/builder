// Fiches descriptives des compétences, indexées par ID.
// Champs structurés (v4) — voir audit complet dans la conversation.
// damage.kind : 'physical' | 'magical' | 'heal' | 'pure'
// damage.formula : 'default' (= formule canonique de l'arme), expression (ex '1.5*FOR'), ou null
// statuses[].target : 'enemy' | 'self' | 'ally'
// statuses[].condition : expression conditionnelle (ex 'target.Exposition > 0')
// statuses[].criticalBonus : bonus de valeur en cas de critique
// specialEffects : effets non-standard (double_status_temp, boost_chosen_buff)
const COMPETENCES = {
  "11": {
    "name": "Boule de feu",
    "type": "Sortilège (Hostile)",
    "category": "sortilege",
    "subcategory": "hostile",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 3
    },
    "area": null,
    "target": null,
    "isFreeAction": true,
    "isDiscreetAction": false,
    "element": "Feu",
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": {
      "formula": "MAG",
      "altFormula": null,
      "kind": "magical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [
      {
        "value": 2,
        "status": "Brûlure",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 1 à 3 • Action libre • <img src=\"https://www.kigard.fr/images/elements/1.gif?v=2.15.06\" class=\"elements\" title=\"Feu\" alt=\"\" />",
    "desc_html": "Inflige <b>(MAG) <u>dégâts magiques</u> de Feu <img src=\"https://www.kigard.fr/images/elements/1.gif?v=2.15.06\" class=\"elements\" title=\"Feu\" alt=\"\" /></b> et <b>2 <img src=\"https://www.kigard.fr/images/modificateur/16.gif?v=2.15.06\" class=\"statut\" title=\"Brûlure\" alt=\"\" /> Brûlure</b>."
  },
  "13": {
    "name": "Provoquer",
    "type": "Technique (Spécial)",
    "category": "technique",
    "subcategory": "special",
    "cost": {
      "pa": 3,
      "pm": 0
    },
    "range": {
      "min": 1,
      "max": 3
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": null,
    "statuses": [
      {
        "value": 3,
        "status": "Provocation",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "3 PA • Portée 1 à 3",
    "desc_html": "Réussit si <b>[CHA] > PV/10 de la cible</b>.<br><br>Inflige <b>3 <img src=\"https://www.kigard.fr/images/modificateur/47.gif?v=2.15.06\" class=\"statut\" title=\"Provocation\" alt=\"\" /> Provocation</b> (non cumulatif).<br><br><i>Note : une provocation réussie remplace la précédente."
  },
  "24": {
    "name": "Coup de bouclier",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": 3,
      "pm": 0
    },
    "range": {
      "min": 1,
      "max": 1
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": [
        "Bouclier"
      ],
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": "weaponOff",
      "vocation": null
    },
    "damage": {
      "formula": "CON",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "shield",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [
      {
        "value": 2,
        "status": "Assommé",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "3 PA • Portée 1 • <span class='rouge'>Requis : Bouclier (main gauche)",
    "desc_html": "Attaque du <b>bouclier</b> avec <b>2 <img src=\"https://www.kigard.fr/images/modificateur/1.gif?v=2.15.06\" class=\"statut\" title=\"Assommé\" alt=\"\" /> Assommé</b>.<br><br>Base de dégâts: <b>CON</b> <i>(au lieu de FOR)</i><br><br><i>Le bouclier est considéré comme une arme avec +0 DGT et +0 Pre.<i>"
  },
  "25": {
    "name": "Foudre",
    "type": "Sortilège (Hostile)",
    "category": "sortilege",
    "subcategory": "hostile",
    "cost": {
      "pa": 6,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 3
    },
    "area": "Zone 3x3",
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": "Foudre",
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": {
      "formula": "MAG",
      "altFormula": null,
      "kind": "magical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "6 PA & PM • Portée 1 à 3 • Zone 3 x 3 <img src=\"https://www.kigard.fr/images/forme/zone3x3.gif?v=2.15.06\" title=\"Zone 3 x 3\" alt=\"Zone 3 x 3\" /> • <img src=\"https://www.kigard.fr/images/elements/3.gif?v=2.15.06\" class=\"elements\" title=\"Foudre\" alt=\"\" />",
    "desc_html": "Inflige <b>(MAG) <u>dégâts magiques</u> de Foudre <img src=\"https://www.kigard.fr/images/elements/3.gif?v=2.15.06\" class=\"elements\" title=\"Foudre\" alt=\"\" /></b> à la cible centrale.<br><br>Inflige <b>(MAG/2)</b> aux personnages adjacents</b>.<br><br><i>Note : ne déclenche les réactions <b>(Retraite, Riposter, Protéger)</b> que sur la cible principale.</i>"
  },
  "26": {
    "name": "Congélation",
    "type": "Sortilège (Hostile, Spécial)",
    "category": "sortilege",
    "subcategory": "hostile_special",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 3
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": "Glace",
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": "MAG/5",
        "status": "Gel",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 1 à 3 • <img src=\"https://www.kigard.fr/images/elements/2.gif?v=2.15.06\" class=\"elements\" title=\"Glace\" alt=\"\" />",
    "desc_html": "<b>Sur personnage:</b> Inflige <b>(MAG/5) <img src=\"https://www.kigard.fr/images/modificateur/39.gif?v=2.15.06\" class=\"statut\" title=\"Gel\" alt=\"\" /> Gel</b>.<br><br><b>Sur case libre:</b> Génère <b>un bloc de glace</b> <img src=\"https://www.kigard.fr/images/vue/lieu/20.gif?v=2.15.06\" class=\"lieu\" title=\"un bloc de glace\" alt=\"un bloc de glace\" /> (5PA pour Détruire, dure environ 48h).<br><br> <b>Semi-réussite</b>: élément fragile (-1PA pour Détruire)<br> <b>Critique</b>: élément solide (+1PA pour Détruire)"
  },
  "31": {
    "name": "Guérison",
    "type": "Sortilège (Soutien)",
    "category": "sortilege",
    "subcategory": "soutien",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 0,
      "max": 3
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": {
      "formula": "MAG",
      "altFormula": null,
      "kind": "heal",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 0 à 3",
    "desc_html": "Soigne <b>(MAG) PV</b>."
  },
  "38": {
    "name": "Entrave",
    "type": "Sortilège (Hostile)",
    "category": "sortilege",
    "subcategory": "hostile",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 4
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": "MAG/5",
        "status": "Lenteur",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 1 à 4",
    "desc_html": "Inflige <b>(MAG/5) <img src=\"https://www.kigard.fr/images/modificateur/2.gif?v=2.15.06\" class=\"statut\" title=\"Lenteur\" alt=\"\" /> Lenteur</b>."
  },
  "41": {
    "name": "Inspirer",
    "type": "Technique (Spécial)",
    "category": "technique",
    "subcategory": "special",
    "cost": {
      "pa": 6,
      "pm": 0
    },
    "range": {
      "type": "self"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": null,
    "statuses": [
      {
        "value": "CHA/5",
        "status": "Inspiration",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "6 PA • Soi-même",
    "desc_html": "Confère à soi-même et aux personnages alliés adjacents <b>(CHA/5) <img src=\"https://www.kigard.fr/images/modificateur/5.gif?v=2.15.06\" class=\"statut\" title=\"Inspiration\" alt=\"\" /> Inspiration</b>.<br/><br/><i>Note : les personnages alliés sont ceux qui appartiennent au même clan ou qui ont un lien d'empathie, ainsi que tout leurs compagnons.</i>"
  },
  "45": {
    "name": "Attaque sournoise",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": "weapon+2",
      "pm": 0
    },
    "range": {
      "min": 1,
      "max": 1
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": [
        "Dague",
        "Gant"
      ],
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "0.5*FOR+1*DEX",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": 2.0,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "(Coût Arme + 2) PA • Portée 1 • <span class='rouge'>Requis : Dague ou Gant",
    "desc_html": "Attaque de l'<b>arme principale</b>.<br><br>Base de dégâts: <b>0.5 x FOR + 1 x DEX</b> <i>(au lieu de FOR)</i><br><br> <b>Critique</b>: <b>base de dégâts x2</b> <i>(au lieu de base x1.5, soit FOR + 2 x DEX au total)</i>"
  },
  "46": {
    "name": "Attaque puissante",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": "weapon+2",
      "pm": 0
    },
    "range": {
      "min": 1,
      "max": 1
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": [
        "Épée",
        "Masse",
        "Hache"
      ],
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "1.5*FOR",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "main",
      "preMod": -15,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "(Coût Arme + 2) PA • Portée 1 • <span class='rouge'>Requis : Epée, Masse ou Hache",
    "desc_html": "Attaque de l'<b>arme principale</b> avec <b>-15 en Précision</b>.<br><br>Base de dégâts: <b>1.5 x FOR</b> <i>(au lieu de FOR)</i>"
  },
  "47": {
    "name": "Bond athlétique",
    "type": "Technique (Spécial)",
    "category": "technique",
    "subcategory": "special",
    "cost": {
      "pa": 4,
      "pm": 0
    },
    "range": {
      "min": 2,
      "max": 2
    },
    "area": null,
    "target": "Case vide",
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": null,
    "statuses": [
      {
        "value": "CON/5",
        "status": "Impact",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA • Case vide • Portée 2",
    "desc_html": "Permet de <b>bondir</b> sur la case ciblée.<br>Confère également <b>(CON/5) <img src=\"https://www.kigard.fr/images/modificateur/28.gif?v=2.15.06\" class=\"statut\" title=\"Impact\" alt=\"\" /> Impact</b>.<br><br><i>Note : subit les effets du statut <b><img src=\"https://www.kigard.fr/images/modificateur/2.gif?v=2.15.06\" class=\"statut\" title=\"Lenteur\" alt=\"\" /> Lenteur</b>."
  },
  "48": {
    "name": "Protéger",
    "type": "Technique (Réaction programmée)",
    "category": "technique",
    "subcategory": "reaction",
    "cost": {
      "pa": 2,
      "pm": 0
    },
    "range": {
      "min": 1,
      "max": 1
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Art de la guerre"
    },
    "damage": null,
    "statuses": [
      {
        "value": null,
        "status": "Protection",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "2 PA • Portée 1",
    "desc_html": "Permet de <b>protéger</b> <img src=\"https://www.kigard.fr/images/modificateur/26.gif?v=2.15.06\" class=\"statut\" title=\"Protection\" alt=\"\" /> Protection sa cible jusqu'au prochain tour de jeu de l'utilisateur (le protecteur).<br><br>La prochaine fois que le <b>personnage protégé</b> est ciblé par une action hostile (attaque, technique ou sort), le <b>protecteur</b> prend sa place et devient ainsi la nouvelle cible.<br><ul><li>La protection n'est pas déclenchée si le protecteur n'est <b>plus adjacent</b> au protégé.</li><li>Elle est annulée au nouveau tour de jeu du protecteur, même si elle n'a pas été déclenchée.</li><li>Si la technique est utilisée sur une cible <b>déjà protégée</b>, l'utilisateur devient le <b>nouveau protecteur</b>.</li></ul>"
  },
  "49": {
    "name": "Télékinésie",
    "type": "Sortilège (Hostile)",
    "category": "sortilege",
    "subcategory": "hostile",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 3
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 1 à 3",
    "desc_html": "Déplace la cible <b>vers une case vide adjacente</b>.<br><br> <b>Semi-réussite</b>: comme <b>Echec</b><br> <b>Critique</b>: comme <b>Réussite</b>"
  },
  "50": {
    "name": "Téléportation",
    "type": "Sortilège (Spécial)",
    "category": "sortilege",
    "subcategory": "special",
    "cost": {
      "pa": "distance*2",
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 3
    },
    "area": null,
    "target": "Case vide",
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": null,
        "status": "Lenteur",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "(Distance x 2) PA & PM • Case vide • Portée 1 à 3",
    "desc_html": "Se <b>téléporte</b> sur la case.<br><br> <b>Semi-réussite</b>: comme <b>Echec</b><br> <b>Critique</b>: comme <b>Réussite</b><br><br><i>Note : ignore les effets du statut <b><img src=\"https://www.kigard.fr/images/modificateur/2.gif?v=2.15.06\" class=\"statut\" title=\"Lenteur\" alt=\"\" /> Lenteur</b>."
  },
  "51": {
    "name": "Invocation de la forêt",
    "type": "Sortilège (Invocation)",
    "category": "sortilege",
    "subcategory": "invocation",
    "cost": {
      "pa": 8,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 2
    },
    "area": null,
    "target": "Arbre",
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "8 PA & PM • Arbre • Portée 1 à 2",
    "desc_html": "Transforme un arbre en un <b><img src=\"https://www.kigard.fr/images/vue/monstre/29.gif?v=2.15.06\" class=\"vue\" title=\"\" alt=\"\" /> Tréant</b>.<br><br><div style='background-color:white;padding:20px'><b>Profil du <img src=\"https://www.kigard.fr/images/vue/monstre/29.gif?v=2.15.06\" class=\"vue\" title=\"\" alt=\"\" /> Tréant</b><br>Invocation majeure<br><br>FOR <b>0.7 x MAG</b><br>CON <b>0.5 x MAG</b><br>ESP <b>0.5 x MAG</b><br>Pre <b>1.5 x MAG</b><br><br>DGT <b>+4</b><br><b>Vulnérabilité Feu <img src=\"https://www.kigard.fr/images/elements/1.gif?v=2.15.06\" class=\"elements\" title=\"Feu\" alt=\"\" /> 30%</b><br><br><u>Bonus <b>Critique</b>:</u><br>DGT <b>+2</b><br><b>Attaque puissante</b></div><br> <b>Semi-réussite</b>: aucun effet (comme <b>Echec</b>)<br> <b>Critique</b>: gagne <b>un trait</b> et les <b>bonus listés</b> <i>(valeur de MAG non augmentée)</i>"
  },
  "52": {
    "name": "Riposter",
    "type": "Technique (Réaction programmée)",
    "category": "technique",
    "subcategory": "reaction",
    "cost": {
      "pa": 2,
      "pm": 0
    },
    "range": {
      "type": "self"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": "melee",
      "weaponExclude": null,
      "slot": null,
      "vocation": "Art de la guerre"
    },
    "damage": null,
    "statuses": [
      {
        "value": null,
        "status": "Riposte",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "2PA • Soi-même • <span class='rouge'>Requis : Arme de corps-à-corps",
    "desc_html": "Permet de préparer <b>une riposte</b> <img src=\"https://www.kigard.fr/images/modificateur/27.gif?v=2.15.06\" class=\"statut\" title=\"Riposte\" alt=\"\" /> Riposte pour le tour en cours (expire à l'activation).<br><br>La prochaine fois que l'utilisateur est la cible d'une attaque ou d'un sort hostile par un personnage adjacent, il <b>riposte par une attaque normale</b>.<br><br>Une riposte <b>ne déclenche pas</b> d'actions programmées (<b>Riposter</b>, <b>Protéger</b>).</li><br>L'utilisateur doit toujours être <b>équipé d'une arme de corps-à-corps</b> au moment de riposter.</li>"
  },
  "53": {
    "name": "Poser un piège",
    "type": "Technique (Spécial)",
    "category": "technique",
    "subcategory": "special",
    "cost": {
      "pa": 3,
      "pm": 0
    },
    "range": {
      "min": 1,
      "max": 1
    },
    "area": null,
    "target": "Case vide",
    "isFreeAction": false,
    "isDiscreetAction": true,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "DEX",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "projectile",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "3 PA • Case vide • Portée 1Action discrète",
    "desc_html": "Pose <b>un piège</b> sur une case vide, qui sera <b>invisible</b> sauf pour les personnages alliés.<br><br>Un piège peut être découvert lors d'une <b>action de recherche</b>, lors de laquelle sa <b>Dis</b> aide à le cacher.<br><br>Un piège se déclenche lorsqu'un personnage entre sur la case piégée ou la fouille. Ceci se résoud comme une attaque. L'<b>Obs</b> est utilisée pour se défendre <i>(au lieu de l'Esq)</i>.<br><br>Il inflige des <u>dégâts physiques</u> basés sur la <b>DEX</b> du poseur et une <b>Précision</b> égale à la <b>Dis</b>.<br>L'objet utilisé pour le piège compte ses bonus de <b>DGT</b> et de <b>Pre</b> ainsi que ses <b>statuts</b>, comme une arme.<br><br>Les objets servant à poser un piège sont <img src=\"https://www.kigard.fr/images/items/16.gif?v=2.15.06\" class=\"item\" title=\"\" alt=\"\" /><img src=\"https://www.kigard.fr/images/items/352.gif?v=2.15.06\" class=\"item\" title=\"\" alt=\"\" /><img src=\"https://www.kigard.fr/images/items/350.gif?v=2.15.06\" class=\"item\" title=\"\" alt=\"\" /><img src=\"https://www.kigard.fr/images/items/359.gif?v=2.15.06\" class=\"item\" title=\"\" alt=\"\" />."
  },
  "54": {
    "name": "Lancer un projectile",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": 3,
      "pm": 0
    },
    "range": {
      "min": 1,
      "max": 3
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "(FOR+DEX)/2",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "projectile",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "3 PA • Portée 1 à 3",
    "desc_html": "Attaque avec un <b>projectile</b> de l'inventaire.<br><br>Base de dégâts: <b>(FOR + DEX)/2</b><br><br><i>Le <b>projectile</b> est détruit ensuite.</i><br><br>Les objets servant à lancer un projectile sont <img src=\"https://www.kigard.fr/images/items/107.gif?v=2.15.06\" class=\"item\" title=\"\" alt=\"\" /><img src=\"https://www.kigard.fr/images/items/188.gif?v=2.15.06\" class=\"item\" title=\"\" alt=\"\" /><img src=\"https://www.kigard.fr/images/items/225.gif?v=2.15.06\" class=\"item\" title=\"\" alt=\"\" /><img src=\"https://www.kigard.fr/images/items/351.gif?v=2.15.06\" class=\"item\" title=\"\" alt=\"\" /><img src=\"https://www.kigard.fr/images/items/350.gif?v=2.15.06\" class=\"item\" title=\"\" alt=\"\" /><img src=\"https://www.kigard.fr/images/items/359.gif?v=2.15.06\" class=\"item\" title=\"\" alt=\"\" /><img src=\"https://www.kigard.fr/images/items/365.gif?v=2.15.06\" class=\"item\" title=\"\" alt=\"\" />."
  },
  "71": {
    "name": "Vol de magie",
    "type": "Sortilège (Hostile)",
    "category": "sortilege",
    "subcategory": "hostile",
    "cost": {
      "pa": 4,
      "pm": 0
    },
    "range": {
      "min": 1,
      "max": 3
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": 2,
        "status": "Bonus de Résistance",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA • Portée 1 à 3",
    "desc_html": "Vole <b>(MAG/5) PM</b> et <b>dissipe 2 <img src=\"https://www.kigard.fr/images/modificateur/19.gif?v=2.15.06\" class=\"statut\" title=\"Bonus de Résistance\" alt=\"\" /> Bonus de Résistance</b>.<br><br>Regagne <b>2 PM</b> par <b>niveau de <img src=\"https://www.kigard.fr/images/modificateur/19.gif?v=2.15.06\" class=\"statut\" title=\"Bonus de Résistance\" alt=\"\" /> Bonus de Résistance dissipé</b>.<br><br> <b>Semi-réussite</b>: -1 statut dissipé<br> <b>Critique</b>: +1 statut dissipé"
  },
  "72": {
    "name": "Drain de vie",
    "type": "Sortilège (Hostile)",
    "category": "sortilege",
    "subcategory": "hostile",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 2
    },
    "area": null,
    "target": null,
    "isFreeAction": true,
    "isDiscreetAction": false,
    "element": "Ombre",
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": {
      "formula": "MAG",
      "altFormula": null,
      "kind": "magical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 1 à 2 • Action libre • <img src=\"https://www.kigard.fr/images/elements/5.gif?v=2.15.06\" class=\"elements\" title=\"Ombre\" alt=\"\" />",
    "desc_html": "Inflige des <b>(MAG) <u>dégâts magiques</u> de Ténèbres <img src=\"https://www.kigard.fr/images/elements/5.gif?v=2.15.06\" class=\"elements\" title=\"Ombre\" alt=\"\" /></b>.<br><br>Soigne le lanceur de <b>30% des dégâts infligés</b>, <b>+5%</b> par <b><img src=\"https://www.kigard.fr/images/modificateur/17.gif?v=2.15.06\" class=\"statut\" title=\"Saignement\" alt=\"\" /> Saignement</b> sur la cible (<b>max. de +30%</b>)."
  },
  "73": {
    "name": "Jugement",
    "type": "Sortilège (Hostile)",
    "category": "sortilege",
    "subcategory": "hostile",
    "cost": {
      "pa": 6,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 1
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": "Lumière",
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": {
      "formula": "1.5*INT",
      "altFormula": null,
      "kind": "magical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": "2 * target.positiveStatusCount",
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "6 PA & PM • Portée 1 • <img src=\"https://www.kigard.fr/images/elements/4.gif?v=2.15.06\" class=\"elements\" title=\"Lumière\" alt=\"\" />",
    "desc_html": "Inflige des <b><u>dégâts magiques</u> de Lumière <img src=\"https://www.kigard.fr/images/elements/4.gif?v=2.15.06\" class=\"elements\" title=\"Lumière\" alt=\"\" /></b>.<br><br>MM <b>augmentée de 2% par niveau de statuts positifs</b> sur la cible.<br><br>Base de dégâts: <b>1.5 x INT</b> <i>(au lieu de INT)</i>"
  },
  "74": {
    "name": "Maléfice de poison",
    "type": "Sortilège (Hostile)",
    "category": "sortilege",
    "subcategory": "hostile",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 0,
      "max": 3
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": "MAG/5",
        "status": "Poison",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 0 à 3",
    "desc_html": "Inflige <b>(MAG/5) <img src=\"https://www.kigard.fr/images/modificateur/4.gif?v=2.15.06\" class=\"statut\" title=\"Poison\" alt=\"\" /> Poison</b>."
  },
  "75": {
    "name": "Dévotion",
    "type": "Sortilège (Soutien)",
    "category": "sortilege",
    "subcategory": "soutien",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 0,
      "max": 2
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": "MAG/5",
        "status": "Bonus de Dégâts",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 0 à 2",
    "desc_html": "Confère <b>[MAG/5] <img src=\"https://www.kigard.fr/images/modificateur/8.gif?v=2.15.06\" class=\"statut\" title=\"Bonus de Dégâts\" alt=\"\" /> Bonus de Dégâts</b>."
  },
  "76": {
    "name": "Purification",
    "type": "Sortilège (Soutien)",
    "category": "sortilege",
    "subcategory": "soutien",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 0,
      "max": 2
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": "MAG/5",
        "status": "Immunité",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 0 à 2",
    "desc_html": "Confère <b>(MAG/5) <img src=\"https://www.kigard.fr/images/modificateur/21.gif?v=2.15.06\" class=\"statut\" title=\"Immunité\" alt=\"\" /> Immunité</b>."
  },
  "77": {
    "name": "Réveil des ossements",
    "type": "Sortilège (Invocation)",
    "category": "sortilege",
    "subcategory": "invocation",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 2
    },
    "area": null,
    "target": "Dépouille",
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": 1,
        "status": "Terreur",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Dépouille • Portée 1 à 2",
    "desc_html": "Relève un <b><img src=\"https://www.kigard.fr/images/vue/monstre/19.gif?v=2.15.06\" class=\"vue\" title=\"\" alt=\"\" /> Squelette</b>.<br><br><div style='background-color:white;padding:20px'><b>Profil du <img src=\"https://www.kigard.fr/images/vue/monstre/19.gif?v=2.15.06\" class=\"vue\" title=\"\" alt=\"\" /> Squelette</b><br>Invocation mineure<br><br>FOR <b>0.6 x MAG</b><br>CON <b>0.2 x MAG</b><br>ESP <b>0.2 x MAG</b><br>Pre <b>1.5 x MAG</b><br><br><b>Vulnérabilité Lumière <img src=\"https://www.kigard.fr/images/elements/4.gif?v=2.15.06\" class=\"elements\" title=\"Lumière\" alt=\"\" /> 30%</b><br>DGT <b>+3</b><br><br><u>Bonus <b>Critique</b>:</u><br><b>Attaque précise</b><br><b>Inflige 1 <img src=\"https://www.kigard.fr/images/modificateur/20.gif?v=2.15.06\" class=\"statut\" title=\"Terreur\" alt=\"\" /> Terreur</b></div><br> <b>Semi-réussite</b>: aucun effet (comme <b>Echec</b>)<br> <b>Critique</b>: gagne <b>un trait</b> et les <b>bonus listés</b> <i>(valeur de MAG non augmentée)</i><br><br>Note : le contenu de la <b>dépouille</b> est ramassé."
  },
  "88": {
    "name": "Attaque précise",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": "weapon+2",
      "pm": 0
    },
    "range": {
      "type": "weapon"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": [
        "Dague",
        "Épée",
        "Lance",
        "Arc",
        "Fouet"
      ],
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "default",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": "offensive",
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "(Coût Arme + 2) PA • Portée Arme • <span class='rouge'>Requis : Dague, Epée, Lance, Arc ou Fouet",
    "desc_html": "Attaque de l'<b>arme principale</b> avec un <b>Avantage</b>."
  },
  "91": {
    "name": "Attaque sacrée",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": "weapon",
      "pm": "same"
    },
    "range": {
      "type": "weapon"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "default",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "(Coût Arme) PA & PM • Portée Arme",
    "desc_html": "Attaque <b>de Lumière <img src=\"https://www.kigard.fr/images/elements/4.gif?v=2.15.06\" class=\"elements\" title=\"Lumière\" alt=\"\" /></b> de l'<b>arme principale</b>.<br><br>Base de dégâts:<ul><li><b>0.75 x (FOR + INT)</b> si arme de contact <i>(au lieu de FOR)</i></li><li><b>0.75 x (DEX + INT)</b> si arme à distance <i>(au lieu de DEX)</i></li></ul>"
  },
  "93": {
    "name": "Subterfuge mystique",
    "type": "Technique (Spécial)",
    "category": "technique",
    "subcategory": "special",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "type": "self"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": null,
    "statuses": [
      {
        "value": 3,
        "status": "Subterfuge mystique",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Soi-même",
    "desc_html": "Confère <b>3 <img src=\"https://www.kigard.fr/images/modificateur/15.gif?v=2.15.06\" class=\"statut\" title=\"Subterfuge mystique\" alt=\"\" /> Subterfuge mystique</b>."
  },
  "94": {
    "name": "Disparition soudaine",
    "type": "Technique (Spécial)",
    "category": "technique",
    "subcategory": "special",
    "cost": {
      "pa": 2,
      "pm": 0
    },
    "range": {
      "type": "self"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": true,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Furtivité"
    },
    "damage": null,
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "2 PA • Soi-même • Action discrète",
    "desc_html": "Réalise une <b>disparition</b>.<br><br>Un <img src=\"https://www.kigard.fr/images/items/365.gif?v=2.15.06\" class=\"item\" title=\"\" alt=\"\" /> <b>fumigène</b> peut être utilisé pour obtenir <b>+30 en Dis</b> pendant l'action."
  },
  "100": {
    "name": "Rafale de givre",
    "type": "Sortilège (Hostile)",
    "category": "sortilege",
    "subcategory": "hostile",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 3
    },
    "area": null,
    "target": null,
    "isFreeAction": true,
    "isDiscreetAction": false,
    "element": "Glace",
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": {
      "formula": "MAG",
      "altFormula": null,
      "kind": "magical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [
      {
        "value": 2,
        "status": "Gel",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 1 à 3 • Action libre • <img src=\"https://www.kigard.fr/images/elements/2.gif?v=2.15.06\" class=\"elements\" title=\"Glace\" alt=\"\" />",
    "desc_html": "Inflige <b>(MAG) <u>dégâts magiques</u> de Glace <img src=\"https://www.kigard.fr/images/elements/2.gif?v=2.15.06\" class=\"elements\" title=\"Glace\" alt=\"\" /></b> et <b>+2 <img src=\"https://www.kigard.fr/images/modificateur/39.gif?v=2.15.06\" class=\"statut\" title=\"Gel\" alt=\"\" /> Gel</b>."
  },
  "101": {
    "name": "Offrir son sang",
    "type": "Technique (Spécial)",
    "category": "technique",
    "subcategory": "special",
    "cost": {
      "pa": 0,
      "pm": 0
    },
    "range": {
      "type": "self"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": 2,
        "status": "Saignement",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "0 PA • Soi-même • <span class='rouge'>Interdit si Agonisant",
    "desc_html": "Inflige à l'utilisateur <b>10 <u>dégâts purs</u> d'Ombre <img src=\"https://www.kigard.fr/images/elements/5.gif?v=2.15.06\" class=\"elements\" title=\"Ombre\" alt=\"\" /></b> et <b>+2 <img src=\"https://www.kigard.fr/images/modificateur/17.gif?v=2.15.06\" class=\"statut\" title=\"Saignement\" alt=\"\" /> Saignement</b>.<br>Réalise ensuite une <b>méditation</b>."
  },
  "102": {
    "name": "Incinération",
    "type": "Sortilège (Hostile)",
    "category": "sortilege",
    "subcategory": "hostile",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 3
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": "Feu",
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": {
      "formula": "4*target.Brûlure",
      "altFormula": null,
      "kind": "pure",
      "weaponDgtSource": null,
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 1 à 3 • <img src=\"https://www.kigard.fr/images/elements/1.gif?v=2.15.06\" class=\"elements\" title=\"Feu\" alt=\"\" />",
    "desc_html": "Inflige <b>(4x niv. <img src=\"https://www.kigard.fr/images/modificateur/16.gif?v=2.15.06\" class=\"statut\" title=\"Brûlure\" alt=\"\" /> Brûlure sur cible) <u>dégâts purs</u> de Feu <img src=\"https://www.kigard.fr/images/elements/1.gif?v=2.15.06\" class=\"elements\" title=\"Feu\" alt=\"\" /></b>.<br>Retire <b>toute la Brûlure</b>.<br><br> <b>Semi-réussite</b>: -50% dégâts<br> <b>Critique</b>: +50% dégâts"
  },
  "104": {
    "name": "Instinct",
    "type": "Sortilège (Soutien)",
    "category": "sortilege",
    "subcategory": "soutien",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 0,
      "max": 2
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": "MAG/5",
        "status": "Bonus de Précision",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 0 à 2",
    "desc_html": "Confère <b>(MAG/5) <img src=\"https://www.kigard.fr/images/modificateur/22.gif?v=2.15.06\" class=\"statut\" title=\"Bonus de Précision\" alt=\"\" /> Bonus de Précision</b>."
  },
  "105": {
    "name": "Piqûre",
    "type": "Sortilège (Hostile)",
    "category": "sortilege",
    "subcategory": "hostile",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 2
    },
    "area": null,
    "target": null,
    "isFreeAction": true,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": {
      "formula": "MAG",
      "altFormula": null,
      "kind": "magical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 1 à 2 • Action libre",
    "desc_html": "Inflige <b>(MAG) <u>dégâts magiques</u></b> avec <b>+20 de MM</b>."
  },
  "106": {
    "name": "Enchaîner",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": "weapon+2",
      "pm": 0
    },
    "range": {
      "type": "weapon"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": [
        "Épée",
        "Masse",
        "Lance",
        "Gant",
        "Fouet"
      ],
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "default",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [
      {
        "value": 4,
        "status": "Impact",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "(Coût Arme + 2) PA • Portée Arme • <span class='rouge'>Requis : Epée, Masse, Lance, Gant ou Fouet",
    "desc_html": "Deux attaques de l'<b>arme principale</b> avec <b>-15 en Précision</b>.<br><br>Le statut <b>Impact</b> n'est pas déclenché par ces attaques.<br><br>Confère <b>+4 <img src=\"https://www.kigard.fr/images/modificateur/28.gif?v=2.15.06\" class=\"statut\" title=\"Impact\" alt=\"\" /> Impact</b> si chaque attaque obtient <b>une réussite ou un <b>Critique</b></b>."
  },
  "109": {
    "name": "Mur de ronces",
    "type": "Sortilège (Spécial)",
    "category": "sortilege",
    "subcategory": "special",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 3
    },
    "area": null,
    "target": "Case libre",
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": 2,
        "status": "Poison",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Case libre • Portée 1 à 3",
    "desc_html": "Génère <b>des ronces</b> <img src=\"https://www.kigard.fr/images/vue/lieu/119.gif?v=2.15.06\" class=\"lieu\" title=\"des ronces\" alt=\"des ronces\" /> (dure environ 48h).<ul><li>Entrer sur une <b>case adjacente</b> inflige <b>+2 <img src=\"https://www.kigard.fr/images/modificateur/4.gif?v=2.15.06\" class=\"statut\" title=\"Poison\" alt=\"\" /> Poison</b><li><b>Arracher (1PA)</b> inflige <b>+4 <img src=\"https://www.kigard.fr/images/modificateur/4.gif?v=2.15.06\" class=\"statut\" title=\"Poison\" alt=\"\" /> Poison</b></ul><br> <b>Semi-réussite</b>: statuts -50%<br> <b>Critique</b>: statuts +50%"
  },
  "113": {
    "name": "Attaque hypnotique",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": "weapon",
      "pm": "same"
    },
    "range": {
      "type": "weapon"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "default",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": "Dissipe le statut Défense de la cible (sans déclencher d'actions automatiques)",
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": "PRE + MM/2",
      "precisionFormulaBonus": null,
      "ignoresStatus": [
        "Défense"
      ],
      "armorPenetration": null
    },
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "(Coût Arme) PA & PM • Portée Arme",
    "desc_html": "Attaque de l'<b>arme principale</b> avec <b>+(MM/2) en Précision</b>.<br><br>Ne déclenche pas les <b>réactions (Riposter, Protéger, Retraite)</b> ni le <b>statut <img src=\"https://www.kigard.fr/images/modificateur/10.gif?v=2.15.06\" class=\"statut\" title=\"Défense\" alt=\"\" /> Défense</b>.<br><br> <b>Critique</b>: déprogramme les <b>réactions</b> (de la cible) et retire <b>1 <img src=\"https://www.kigard.fr/images/modificateur/10.gif?v=2.15.06\" class=\"statut\" title=\"Défense\" alt=\"\" /> Défense</b>."
  },
  "117": {
    "name": "Lire l'avenir",
    "type": "Technique (Spécial)",
    "category": "technique",
    "subcategory": "special",
    "cost": {
      "pa": 0,
      "pm": 0
    },
    "range": {
      "min": 0,
      "max": 4
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": null,
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "0 PA • Portée 0 à 4",
    "desc_html": "Permet de connaître le <b>prochain tirage des dés de PA</b> de sa cible ainsi que <b>l'horaire de son prochain tour</b>.<br><br>Requiert de réussir une touche avec <b>(MM + Obs)</b>.<br>Si la cible n'est pas un allié, elle se défend avec <b>(DM + Dis)</b>.<br><br>Les dés les plus à droite seront ceux perdus si la cible est <b>en surcharge</b> ou <b>agonisante</b> à son activation."
  },
  "118": {
    "name": "Exaltation",
    "type": "Sortilège (Soutien)",
    "category": "sortilege",
    "subcategory": "soutien",
    "cost": {
      "pa": 3,
      "pm": "same"
    },
    "range": {
      "min": 0,
      "max": 3
    },
    "area": null,
    "target": null,
    "isFreeAction": true,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": 4,
        "status": "Exaltation",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "3 PA & PM • Portée 0 à 3 • Action libre",
    "desc_html": "Confère <b>4 <img src=\"https://www.kigard.fr/images/modificateur/30.gif?v=2.15.06\" class=\"statut\" title=\"Exaltation\" alt=\"\" /> Exaltation</b>.<br><br> <b>Semi-réussite</b>: -2 statuts<br> <b>Critique</b>: +2 statuts"
  },
  "119": {
    "name": "Envoûtement",
    "type": "Sortilège (Hostile)",
    "category": "sortilege",
    "subcategory": "hostile",
    "cost": {
      "pa": 3,
      "pm": 3
    },
    "range": {
      "min": 1,
      "max": 5
    },
    "area": null,
    "target": null,
    "isFreeAction": true,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": 2,
        "status": "Envoûtement",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "3 PA & 3PM • Portée 1 à 5 • Action libre",
    "desc_html": "Inflige <b>2 <img src=\"https://www.kigard.fr/images/modificateur/31.gif?v=2.15.06\" class=\"statut\" title=\"Envoûtement\" alt=\"\" /> Envoûtement</b>.<br>"
  },
  "120": {
    "name": "Exécuter",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": "weapon",
      "pm": 0
    },
    "range": {
      "type": "weapon"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "default",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "(Coût Arme) PA • Portée Arme",
    "desc_html": "Attaque de l'<b>arme principale</b>, avec un <b>Avantage</b> si la cible est <b>agonisante</b>.<br><br>Si la cible est <b>vaincue</b>, le <b>coût est réduit à 0 PA</b>."
  },
  "121": {
    "name": "Incanter",
    "type": "Technique (Spécial)",
    "category": "technique",
    "subcategory": "special",
    "cost": {
      "pa": 3,
      "pm": 0
    },
    "range": {
      "type": "self"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "3 PA • Soi-même",
    "desc_html": "Réalise une <b>méditation</b> et remplit un emplacement de <b>Mémoire</b> avec un <b>sort aléatoire</b>.<br><br><i>Note : les sorts possibles dépendent du Domaine où se trouve le personnage, mais incluent toujours <b>Piqûre</b>, <b>Exaltation</b> et <b>Envoûtement</b>."
  },
  "127": {
    "name": "Lance de cristal",
    "type": "Sortilège (Hostile)",
    "category": "sortilege",
    "subcategory": "hostile",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 2
    },
    "area": null,
    "target": null,
    "isFreeAction": true,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": 2,
        "status": "Bonus de Résistance",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 1 à 2 • Action libre",
    "desc_html": "Inflige des <u>dégâts magiques</u>.<br>Confère au lanceur <b>2 <img src=\"https://www.kigard.fr/images/modificateur/19.gif?v=2.15.06\" class=\"statut\" title=\"Bonus de Résistance\" alt=\"\" /> Bonus de Résistance</b>."
  },
  "128": {
    "name": "Mur de cristal",
    "type": "Sortilège (Spécial)",
    "category": "sortilege",
    "subcategory": "special",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 3
    },
    "area": null,
    "target": "Case libre",
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": 1,
        "status": "Bonus de Résistance",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Case libre • Portée 1 à 3",
    "desc_html": "Génère <b>un mur de cristal</b> <img src=\"https://www.kigard.fr/images/vue/lieu/123.gif?v=2.15.06\" class=\"lieu\" title=\"un mur de cristal\" alt=\"un mur de cristal\" /> (5PA pour Détruire, dure environ 48h).<br><br>Confère au lanceur <b>1 <img src=\"https://www.kigard.fr/images/modificateur/19.gif?v=2.15.06\" class=\"statut\" title=\"Bonus de Résistance\" alt=\"\" /> Bonus de Résistance</b>.<br><br> <b>Semi-réussite</b>: élément fragile (-1PA pour Détruire)<br> <b>Critique</b>: élément solide (+1PA pour Détruire)"
  },
  "129": {
    "name": "Subversion",
    "type": "Sortilège (Hostile)",
    "category": "sortilege",
    "subcategory": "hostile",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 3
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": "MAG/10",
        "status": "Terreur",
        "target": "enemy"
      },
      {
        "value": "MAG/10",
        "status": "Bonus de Volonté",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 1 à 3",
    "desc_html": "Inflige <b>(MAG/10) <img src=\"https://www.kigard.fr/images/modificateur/20.gif?v=2.15.06\" class=\"statut\" title=\"Terreur\" alt=\"\" /> Terreur</b> et confère au lanceur <b> autant de <img src=\"https://www.kigard.fr/images/modificateur/40.gif?v=2.15.06\" class=\"statut\" title=\"Bonus de Volonté\" alt=\"\" /> Bonus de Volonté</b>."
  },
  "133": {
    "name": "Attaque rapide",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": "weapon-2",
      "pm": 0
    },
    "range": {
      "type": "weapon"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": [
        "Dague",
        "Épée",
        "Arc"
      ],
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "default",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [
      {
        "value": 1,
        "status": "Exposition",
        "target": "enemy",
        "condition": "target.Exposition > 0"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "(Coût Arme - 2) PA • Portée Arme • <span class='rouge'>Requis : Dague, Epée ou Arc",
    "desc_html": "Attaque de l'<b>arme principale</b> avec <b>-30 en Précision</b>.<br><br>Si la cible a le <b>statut <img src=\"https://www.kigard.fr/images/modificateur/32.gif?v=2.15.06\" class=\"statut\" title=\"Exposition\" alt=\"\" /> Exposition</b>, inflige <b>1 <img src=\"https://www.kigard.fr/images/modificateur/32.gif?v=2.15.06\" class=\"statut\" title=\"Exposition\" alt=\"\" /> Exposition</b>."
  },
  "134": {
    "name": "Régénération",
    "type": "Sortilège (Soutien)",
    "category": "sortilege",
    "subcategory": "soutien",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 0,
      "max": 2
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": "MAG/5",
        "status": "Régénération",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 0 à 2",
    "desc_html": "Confère <b>(MAG/5) <img src=\"https://www.kigard.fr/images/modificateur/11.gif?v=2.15.06\" class=\"statut\" title=\"Régénération\" alt=\"\" /> Régénération</b>."
  },
  "135": {
    "name": "Discipline",
    "type": "Sortilège (Soutien)",
    "category": "sortilege",
    "subcategory": "soutien",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 0,
      "max": 2
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": "MAG/5",
        "status": "Bonus de Volonté",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 0 à 2",
    "desc_html": "Confère <b>[MAG/5] <img src=\"https://www.kigard.fr/images/modificateur/40.gif?v=2.15.06\" class=\"statut\" title=\"Bonus de Volonté\" alt=\"\" /> Bonus de Volonté</b>."
  },
  "136": {
    "name": "Réflexes",
    "type": "Sortilège (Soutien)",
    "category": "sortilege",
    "subcategory": "soutien",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 0,
      "max": 2
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": "MAG/5",
        "status": "Bonus d'Esquive",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 0 à 2",
    "desc_html": "Confère <b>(MAG/5) <img src=\"https://www.kigard.fr/images/modificateur/23.gif?v=2.15.06\" class=\"statut\" title=\"Bonus d'Esquive\" alt=\"\" /> Bonus d'Esquive</b>."
  },
  "137": {
    "name": "Egide",
    "type": "Sortilège (Soutien)",
    "category": "sortilege",
    "subcategory": "soutien",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 0,
      "max": 2
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": "MAG/5",
        "status": "Bonus de Résistance",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 0 à 2",
    "desc_html": "Confère <b>[MAG/5] <img src=\"https://www.kigard.fr/images/modificateur/19.gif?v=2.15.06\" class=\"statut\" title=\"Bonus de Résistance\" alt=\"\" /> Bonus de Résistance</b>."
  },
  "138": {
    "name": "Armure",
    "type": "Sortilège (Soutien)",
    "category": "sortilege",
    "subcategory": "soutien",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 0,
      "max": 2
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": "MAG/5",
        "status": "Bonus d'Armure",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 0 à 2",
    "desc_html": "Confère <b>[MAG/5] <img src=\"https://www.kigard.fr/images/modificateur/12.gif?v=2.15.06\" class=\"statut\" title=\"Bonus d'Armure\" alt=\"\" /> Bonus d'Armure</b>."
  },
  "139": {
    "name": "Cavalerie",
    "type": "Talent",
    "category": "talent",
    "subcategory": null,
    "cost": {
      "pa": 0,
      "pm": 0
    },
    "range": null,
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Équitation"
    },
    "damage": null,
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "",
    "desc_html": "Permet d'utiliser les <b>Sortilèges</b> et les <b>Techniques d'attaque</b> sur une monture.<br><br>Le malus de monture passe de -30% à <b>-15%</b>.<br><br>Pour chaque case parcourue (jusqu'à 3 maximum), la prochaine attaque ce tour aura <b>+15% de Précision</b> (jusqu'à +45% maximum).<br>Ce bonus requiert d'attaquer avec une <b>Epée</b>, une <b>Lance</b>, une <b>Masse</b>, une <b>Hache</b> ou un <b>Bouclier</b>."
  },
  "140": {
    "name": "Enflammer une flèche",
    "type": "Technique (Spécial)",
    "category": "technique",
    "subcategory": "special",
    "cost": {
      "pa": 2,
      "pm": 0
    },
    "range": {
      "min": 0,
      "max": 1
    },
    "area": null,
    "target": "Source de feu",
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": [
        "Arc"
      ],
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": null,
    "statuses": [
      {
        "value": null,
        "status": "Flèche enflammée",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "2 PA • Source de feu ou Soi-même • Portée 0 à 1 • <span class='rouge'>Requis : Arc",
    "desc_html": "Consomme une flèche de l'inventaire et prépare une munition <b><img src=\"https://www.kigard.fr/images/modificateur/45.gif?v=2.15.06\" class=\"statut\" title=\"Flèche enflammée\" alt=\"\" /> Flèche enflammée</b> pour 3 tours, qui sera automatiquement utilisée lors de la prochaine attaque avec l'arc à la place d'une flèche normale.<br><br>Sur une source de feu (Brasero, Campement, Incendie), le coût de cette action est <b>réduit à 0 PA</b>.<br><br><i>Note : la munition est perdue si le perso déséquipe ou échange son arme en main.</i>"
  },
  "141": {
    "name": "Ambidextrie",
    "type": "Talent",
    "category": "talent",
    "subcategory": null,
    "cost": {
      "pa": 0,
      "pm": 0
    },
    "range": null,
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": null,
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "",
    "desc_html": "Quand vous attaquez avec l'une de vos armes, la prochaine attaque ce tour avec l'autre arme vous coûte <b>1PA de moins</b> et bénéficie d'un <b>bonus de 15% Pré</b>.<br><br>Cet effet ne peut se déclencher <b>qu'une seule fois par main</b>.<br><br><i>Note : fonctionne avec les attaques de base et les techniques d'attaque</i>."
  },
  "143": {
    "name": "Surcharge magique",
    "type": "Technique (Spécial)",
    "category": "technique",
    "subcategory": "special",
    "cost": {
      "pa": 0,
      "pm": 3
    },
    "range": {
      "type": "self"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": null,
    "statuses": [
      {
        "value": "INT/5",
        "status": "Surcharge",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "0 PA & 3PM • Soi-même",
    "desc_html": "Confère <b>(INT/5) <img src=\"https://www.kigard.fr/images/modificateur/29.gif?v=2.15.06\" class=\"statut\" title=\"Surcharge\" alt=\"\" /> Surcharge</b>."
  },
  "144": {
    "name": "Magie de Combat",
    "type": "Talent",
    "category": "talent",
    "subcategory": null,
    "cost": {
      "pa": 0,
      "pm": 0
    },
    "range": null,
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": null,
    "statuses": [
      {
        "value": "dégâts infligés/5",
        "status": "Surcharge",
        "target": null
      },
      {
        "value": "dégâts infligés/5",
        "status": "Impact",
        "target": null
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "",
    "desc_html": "Quand vous infligez des <b>dégâts physiques</b>, vous gagnez <b>+[dégâts infligés/5] <img src=\"https://www.kigard.fr/images/modificateur/29.gif?v=2.15.06\" class=\"statut\" title=\"Surcharge\" alt=\"\" /> Surcharge</b>.<br>Quand vous infligez des <b>dégâts magiques</b>, vous gagnez <b>+[dégâts infligés/5] <img src=\"https://www.kigard.fr/images/modificateur/28.gif?v=2.15.06\" class=\"statut\" title=\"Impact\" alt=\"\" /> Impact</b>.<br><br>Chacun de ces effets se déclenche maximum une fois par tour."
  },
  "145": {
    "name": "Retraite",
    "type": "Technique (Réaction programmée)",
    "category": "technique",
    "subcategory": "reaction",
    "cost": {
      "pa": 2,
      "pm": 0
    },
    "range": {
      "type": "self"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Art de la guerre"
    },
    "damage": null,
    "statuses": [
      {
        "value": 2,
        "status": "Exposition",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "2PA • Soi-même",
    "desc_html": "Permet de préparer <b>une retraite</b> pour le tour en cours (expire à l'activation).<br><br>La prochaine fois que l'utilisateur est la cible d'une attaque ou d'un sort hostile, après la résolution des effets, il <b>se déplace dans la direction choisie, ou si impossible, dans une des deux directions adjacentes</b>.<br><br>En cas de blocage ou d'esquive, et si un déplacement a bien été effectué, l'attaquant subit <b>+2 <img src=\"https://www.kigard.fr/images/modificateur/32.gif?v=2.15.06\" class=\"statut\" title=\"Exposition\" alt=\"\" /> Exposition</b>."
  },
  "149": {
    "name": "Incendie",
    "type": "Sortilège (Hostile, Spécial)",
    "category": "sortilege",
    "subcategory": "hostile_special",
    "cost": {
      "pa": 6,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 3
    },
    "area": "Zone 3x3",
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": "Feu",
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": "MAG/5",
        "status": "Incendie",
        "target": "enemy"
      },
      {
        "value": "MAG/5",
        "status": "Brûlure",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "6 PA & PM • Case • Portée 1 à 3 • Zone 3 x 3 <img src=\"https://www.kigard.fr/images/forme/zone3x3.gif?v=2.15.06\" title=\"Zone 3 x 3\" alt=\"Zone 3 x 3\" /> • <img src=\"https://www.kigard.fr/images/elements/1.gif?v=2.15.06\" class=\"elements\" title=\"Feu\" alt=\"\" />",
    "desc_html": "<b>Sur case centrale, si libre:</b> Génère <b>un incendie</b> <img src=\"https://www.kigard.fr/images/vue/lieu/141.gif?v=2.15.06\" class=\"lieu\" title=\"un incendie\" alt=\"un incendie\" /> de <b>(MAG/5) <img src=\"https://www.kigard.fr/images/modificateur/44.gif?v=2.15.06\" class=\"statut\" title=\"Incendie\" alt=\"\" /> Incendie</b>.<br><br><b>Sur décor d'arbre ou d'herbe:</b> Devient <b>un incendie</b> <img src=\"https://www.kigard.fr/images/vue/lieu/141.gif?v=2.15.06\" class=\"lieu\" title=\"un incendie\" alt=\"un incendie\" />de <b>(MAG/5) <img src=\"https://www.kigard.fr/images/modificateur/44.gif?v=2.15.06\" class=\"statut\" title=\"Incendie\" alt=\"\" /> Incendie</b>.<br><br><b>Sur personnage:</b> Inflige <b>(MAG/5) <img src=\"https://www.kigard.fr/images/modificateur/16.gif?v=2.15.06\" class=\"statut\" title=\"Brûlure\" alt=\"\" /> Brûlure</b>."
  },
  "150": {
    "name": "Embuscade",
    "type": "Talent",
    "category": "talent",
    "subcategory": null,
    "cost": {
      "pa": 0,
      "pm": 0
    },
    "range": null,
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Furtivité"
    },
    "damage": null,
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "",
    "desc_html": "Opère si vous avez le statut <b><img src=\"https://www.kigard.fr/images/modificateur/13.gif?v=2.15.06\" class=\"statut\" title=\"Furtivité\" alt=\"\" /> Furtivité</b>.<br><br>Lors d'une attaque (physique ou magique), votre <b>[DIS/2]</b> s'ajoute à l'attribut pour attaquer ou pour défendre."
  },
  "151": {
    "name": "Attaque défensive",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": "weapon",
      "pm": 0
    },
    "range": {
      "type": "weapon"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "default",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": 1,
      "criticalNote": "Pas d'augmentation de dégâts. +1 Défense supplémentaire au lanceur.",
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [
      {
        "value": 1,
        "status": "Défense",
        "target": "self",
        "criticalBonus": 1
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "(Coût Arme) PA • Portée Arme",
    "desc_html": "Attaque de l'<b>arme principale</b> et gagne <b>1 <img src=\"https://www.kigard.fr/images/modificateur/10.gif?v=2.15.06\" class=\"statut\" title=\"Défense\" alt=\"\" /> Défense</b>.<br><br> <b>Critique</b>: au lieu des dégâts augmentés, <b>1 <img src=\"https://www.kigard.fr/images/modificateur/10.gif?v=2.15.06\" class=\"statut\" title=\"Défense\" alt=\"\" /> Défense</b> supplémentaire."
  },
  "152": {
    "name": "Siphonner",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": "weapon",
      "pm": 0
    },
    "range": {
      "type": "weapon"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": [
        "Arc",
        "Fusil"
      ],
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "default",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "(Coût Arme) PA • Portée Arme • <span class='rouge'>Requis : ni Arc ni Fusil",
    "desc_html": "Attaque de l'<b>arme principale</b> et vole <b>[ESP/5] PM</b>."
  },
  "162": {
    "name": "Assommer",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": "weapon+2",
      "pm": 0
    },
    "range": {
      "type": "weapon"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": [
        "Masse",
        "Gant",
        "Fusil"
      ],
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "default",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [
      {
        "value": 3,
        "status": "Assommé",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "(Coût Arme + 2) PA • Portée Arme • <span class='rouge'>Requis : Masse, Gant ou Fusil",
    "desc_html": "Attaque de l'<b>arme principale</b> avec <b>3 <img src=\"https://www.kigard.fr/images/modificateur/1.gif?v=2.15.06\" class=\"statut\" title=\"Assommé\" alt=\"\" /> Assommé</b>."
  },
  "163": {
    "name": "Vigilance",
    "type": "Talent",
    "category": "talent",
    "subcategory": null,
    "cost": {
      "pa": 0,
      "pm": 0
    },
    "range": null,
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": null,
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "",
    "desc_html": "Opère lorsque vous avez l'<b>Avantage</b> ou que votre adversaire a le <b>Désavantage</b>.<br><br>Lors d'une attaque (physique ou magique), votre <b>[OBS/2]</b> s'ajoute à l'attribut pour attaquer ou pour défendre."
  },
  "165": {
    "name": "Méditation défensive",
    "type": "Technique (Spécial)",
    "category": "technique",
    "subcategory": "special",
    "cost": {
      "pa": 3,
      "pm": 0
    },
    "range": {
      "type": "self"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": 1,
        "status": "Défense",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "3 PA • Soi-même",
    "desc_html": "Réalise une <b>méditation</b> et gagne <b>1 <img src=\"https://www.kigard.fr/images/modificateur/10.gif?v=2.15.06\" class=\"statut\" title=\"Défense\" alt=\"\" /> Défense</b>."
  },
  "166": {
    "name": "Soutien dévoué",
    "type": "Technique (Spécial)",
    "category": "technique",
    "subcategory": "special",
    "cost": {
      "pa": 3,
      "pm": 0
    },
    "range": {
      "min": 1,
      "max": 2
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Empathie"
    },
    "damage": null,
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "3 PA • Portée 1 à 2",
    "desc_html": "Réalise un <b>soutien</b> qui confère <b>(CHA/5) PA</b> au lieu de 2 (arrondi kigardien).<br><br><i>Note : le don <b>Entraide</b> fonctionne normalement."
  },
  "167": {
    "name": "Soin stimulant",
    "type": "Technique (Spécial)",
    "category": "technique",
    "subcategory": "special",
    "cost": {
      "pa": 4,
      "pm": 0
    },
    "range": {
      "min": 0,
      "max": 1
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Médecine"
    },
    "damage": {
      "formula": "INT",
      "altFormula": null,
      "kind": "heal",
      "weaponDgtSource": null,
      "preMod": null,
      "criticalMultiplier": 1,
      "criticalNote": "Pas d'augmentation des soins. +1 Défense supplémentaire au lanceur.",
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [
      {
        "value": 1,
        "status": "Défense",
        "target": "self",
        "criticalBonus": 1
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA • Portée 0 à 1",
    "desc_html": "Réalise un <b>soin</b> et confère <b>1 <img src=\"https://www.kigard.fr/images/modificateur/10.gif?v=2.15.06\" class=\"statut\" title=\"Défense\" alt=\"\" /> Défense</b> à la cible.<br><br> <b>Critique</b>: au lieu des soins augmentés, <b>1 <img src=\"https://www.kigard.fr/images/modificateur/10.gif?v=2.15.06\" class=\"statut\" title=\"Défense\" alt=\"\" /> Défense</b> supplémentaire."
  },
  "168": {
    "name": "Premiers soins",
    "type": "Technique (Spécial)",
    "category": "technique",
    "subcategory": "special",
    "cost": {
      "pa": 2,
      "pm": 0
    },
    "range": {
      "min": 0,
      "max": 1
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Médecine"
    },
    "damage": {
      "formula": "INT",
      "altFormula": null,
      "kind": "heal",
      "weaponDgtSource": null,
      "preMod": -30,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [
      {
        "value": null,
        "status": "Poison",
        "target": "self"
      },
      {
        "value": null,
        "status": "Poison rapide",
        "target": "self"
      },
      {
        "value": null,
        "status": "Brûlure",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "2 PA • Portée 0 à 1",
    "desc_html": "Réalise un <b>soin</b> avec <b>-30 de Précision</b>.<br><br><b>Réussite</b>: retire <b>1 de <img src=\"https://www.kigard.fr/images/modificateur/4.gif?v=2.15.06\" class=\"statut\" title=\"Poison\" alt=\"\" /> Poison, de <img src=\"https://www.kigard.fr/images/modificateur/46.gif?v=2.15.06\" class=\"statut\" title=\"Poison rapide\" alt=\"\" /> Poison rapide ou de <img src=\"https://www.kigard.fr/images/modificateur/16.gif?v=2.15.06\" class=\"statut\" title=\"Brûlure\" alt=\"\" /> Brûlure</b> (le plus haut niveau)."
  },
  "169": {
    "name": "Recherche intuitive",
    "type": "Technique (Spécial)",
    "category": "technique",
    "subcategory": "special",
    "cost": {
      "pa": 1,
      "pm": 0
    },
    "range": {
      "type": "self"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": true,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": null,
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "1 PA • Soi-même • Action discrète",
    "desc_html": "Réalise une <b>recherche</b>."
  },
  "170": {
    "name": "Maîtrise des Bêtes",
    "type": "Talent",
    "category": "talent",
    "subcategory": null,
    "cost": {
      "pa": 0,
      "pm": 0
    },
    "range": null,
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": null,
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "",
    "desc_html": "Vous pouvez déployer un maximum de <b>3 compagnons animaux</b> (au lieu de 1 seul)."
  },
  "171": {
    "name": "Disloquer",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": "weapon+2",
      "pm": 0
    },
    "range": {
      "type": "weapon"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": [
        "Masse",
        "Hache",
        "Lance",
        "Fusil"
      ],
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "default",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [
      {
        "value": 3,
        "status": "Faille",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "(Coût Arme + 2) PA • Portée Arme • <span class='rouge'>Requis : Masse, Hache, Lance ou Fusil",
    "desc_html": "Attaque de l'<b>arme principale</b> avec <b>3 <img src=\"https://www.kigard.fr/images/modificateur/3.gif?v=2.15.06\" class=\"statut\" title=\"Faille\" alt=\"\" /> Faille</b>."
  },
  "172": {
    "name": "Entailler",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": "weapon+2",
      "pm": 0
    },
    "range": {
      "type": "weapon"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": [
        "Dague",
        "Épée",
        "Hache"
      ],
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "default",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [
      {
        "value": 3,
        "status": "Saignement",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "(Coût Arme + 2) PA • Portée Arme • <span class='rouge'>Requis : Dague, Epée ou Hache",
    "desc_html": "Attaque de l'<b>arme principale</b> avec <b>3 <img src=\"https://www.kigard.fr/images/modificateur/17.gif?v=2.15.06\" class=\"statut\" title=\"Saignement\" alt=\"\" /> Saignement</b>."
  },
  "173": {
    "name": "Tir lointain",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": "weapon+2",
      "pm": 0
    },
    "range": {
      "type": "weapon+1"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": [
        "Arc",
        "Fusil"
      ],
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "default",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "(Coût Arme + 2) PA • Portée Arme + 1 • <span class='rouge'>Requis : Arc ou Fusil",
    "desc_html": "Attaque de l'<b>arme principale</b> avec une <b>portée maximale augmentée de 1 case</b>."
  },
  "174": {
    "name": "Balayer",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": "weapon+2",
      "pm": 0
    },
    "range": {
      "min": 1,
      "max": 1
    },
    "area": "Arc de 3",
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": "melee_2h",
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "default",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "(Coût Arme + 2) PA • Portée 1 • Arc de 3 <img src=\"https://www.kigard.fr/images/forme/balayer0.gif?v=2.15.06\" title=\"Arc 3\" alt=\"Arc 3\" /> <img src=\"https://www.kigard.fr/images/forme/balayer1.gif?v=2.15.06\" title=\"Arc 3\" alt=\"Arc 3\" /> • <span class=\"rouge\">Requis : Arme 2-mains de contact",
    "desc_html": "Attaques de l'<b>arme principale</b> sur <b>un arc de 3 cases</b>, dans le sens horaire."
  },
  "175": {
    "name": "Ravager",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": "weapon+2",
      "pm": 0
    },
    "range": {
      "type": "weapon"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "default",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [],
    "effects": [],
    "specialEffects": [
      {
        "type": "double_status_temp",
        "target": "enemy",
        "statuses": [
          "Assommé",
          "Faille"
        ]
      },
      {
        "type": "double_status_temp",
        "target": "self",
        "statuses": [
          "Impact"
        ]
      }
    ],
    "info_html": "(Coût Arme + 2) PA • Portée Arme",
    "desc_html": "Attaque de l'<b>arme principale</b>.<br><br>Les statuts suivants ont leurs effets <b>doublés pendant l'action</b>: <img src=\"https://www.kigard.fr/images/modificateur/1.gif?v=2.15.06\" class=\"statut\" title=\"Assommé\" alt=\"\" /><img src=\"https://www.kigard.fr/images/modificateur/3.gif?v=2.15.06\" class=\"statut\" title=\"Faille\" alt=\"\" /><img src=\"https://www.kigard.fr/images/modificateur/28.gif?v=2.15.06\" class=\"statut\" title=\"Impact\" alt=\"\" />"
  },
  "176": {
    "name": "Permutation",
    "type": "Sortilège (Hostile)",
    "category": "sortilege",
    "subcategory": "hostile",
    "cost": {
      "pa": "distance*3",
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 2
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "(Distance x 3) PA & PM • Portée 1 à 2",
    "desc_html": "Echange sa position avec celle de sa cible.<br><br> <b>Semi-réussite</b>: comme <b>Echec</b><br> <b>Critique</b>: comme <b>Réussite</b>"
  },
  "177": {
    "name": "Attaque mystique",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": "weapon",
      "pm": "same"
    },
    "range": {
      "type": "weapon"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "default",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [],
    "effects": [],
    "specialEffects": [
      {
        "type": "boost_chosen_buff",
        "target": "self",
        "availableStatuses": [
          "Bonus de Résistance",
          "Bonus d'Armure",
          "Bonus de Précision",
          "Immunité",
          "Impact",
          "Inspiration",
          "Régénération",
          "Subterfuge mystique",
          "Bonus de Dégâts",
          "Bonus d'Esquive",
          "Bonus de Volonté",
          "Surcharge"
        ],
        "note": "Le lanceur choisit parmi ses buffs présents lesquels seront renforcés"
      }
    ],
    "info_html": "(Coût Arme) PA & PM • Portée Arme",
    "desc_html": "Gagne <b>2 niveaux de statut</b> au choix parmi ceux actifs sur l'attaquant, ou <b>3</b> sur un <b>jet de (DM) réussi</b>.<br><br>Attaque ensuite de l'<b>arme principale</b>.<br><br><i>Note : l'augmentation de statut est facultative.<br>Statuts éligibles : <img src=\"https://www.kigard.fr/images/modificateur/19.gif?v=2.15.06\" class=\"statut\" title=\"Bonus de Résistance\" alt=\"\" /> <img src=\"https://www.kigard.fr/images/modificateur/12.gif?v=2.15.06\" class=\"statut\" title=\"Bonus d'Armure\" alt=\"\" /> <img src=\"https://www.kigard.fr/images/modificateur/22.gif?v=2.15.06\" class=\"statut\" title=\"Bonus de Précision\" alt=\"\" /> <img src=\"https://www.kigard.fr/images/modificateur/21.gif?v=2.15.06\" class=\"statut\" title=\"Immunité\" alt=\"\" /> <img src=\"https://www.kigard.fr/images/modificateur/28.gif?v=2.15.06\" class=\"statut\" title=\"Impact\" alt=\"\" /> <img src=\"https://www.kigard.fr/images/modificateur/5.gif?v=2.15.06\" class=\"statut\" title=\"Inspiration\" alt=\"\" /> <img src=\"https://www.kigard.fr/images/modificateur/11.gif?v=2.15.06\" class=\"statut\" title=\"Régénération\" alt=\"\" /> <img src=\"https://www.kigard.fr/images/modificateur/15.gif?v=2.15.06\" class=\"statut\" title=\"Subterfuge mystique\" alt=\"\" /> <img src=\"https://www.kigard.fr/images/modificateur/8.gif?v=2.15.06\" class=\"statut\" title=\"Bonus de Dégâts\" alt=\"\" /> <img src=\"https://www.kigard.fr/images/modificateur/23.gif?v=2.15.06\" class=\"statut\" title=\"Bonus d'Esquive\" alt=\"\" /> <img src=\"https://www.kigard.fr/images/modificateur/40.gif?v=2.15.06\" class=\"statut\" title=\"Bonus de Volonté\" alt=\"\" /> <img src=\"https://www.kigard.fr/images/modificateur/29.gif?v=2.15.06\" class=\"statut\" title=\"Surcharge\" alt=\"\" />"
  },
  "178": {
    "name": "Invisibilité",
    "type": "Sortilège (Soutien)",
    "category": "sortilege",
    "subcategory": "soutien",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 0,
      "max": 2
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": true,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": 4,
        "status": "Furtivité",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 0 à 2 • Action discrète",
    "desc_html": "Confère <b>4 <img src=\"https://www.kigard.fr/images/modificateur/13.gif?v=2.15.06\" class=\"statut\" title=\"Furtivité\" alt=\"\" /> Furtivité</b>.<br><br> <b>Semi-réussite</b>: -2 statuts<br> <b>Critique</b>: +2 statuts<br><br><i>Note : ne fonctionne pas sur un personnage sur une monture.</i>"
  },
  "179": {
    "name": "Attaque incisive",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": "weapon+2",
      "pm": 0
    },
    "range": {
      "min": 1,
      "max": 1
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": [
        "Dague",
        "Épée",
        "Lance"
      ],
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "default",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": {
        "formula": "(OBS+DIS)/10",
        "criticalFormula": "(OBS+DIS)/5",
        "kigardianRound": true,
        "armFloor": 0,
        "note": "ARM cible plafonnée à 0 (jamais négative). Au critique, le double d'ARM ignoré (équivaut à (OBS+DIS)/5)."
      }
    },
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "(Coût Arme + 2) PA • Portée 1 • <span class='rouge'>Requis : Dague, Epée ou Lance",
    "desc_html": "Attaque de l'<b>arme principale</b>.<br><br><b>Réussite</b>: ignore <b>(Obs+Dis)/10 d'ARM</b> (arrondi kigardien)<br> <b>Critique</b>: ignore le double d'ARM (= (Obs+Dis)/5)"
  },
  "180": {
    "name": "Tourmenter",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": "weapon",
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 1
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": "melee",
      "weaponExclude": null,
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "default",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [
      {
        "value": 3,
        "status": "Terreur",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "(Coût Arme) PA & PM • Portée 1 • <span class='rouge'>Requis : Arme de contact",
    "desc_html": "Attaque <b>de Ténèbres <img src=\"https://www.kigard.fr/images/elements/5.gif?v=2.15.06\" class=\"elements\" title=\"Ombre\" alt=\"\" /></b> de l'<b>arme principale</b> avec <b>3 <img src=\"https://www.kigard.fr/images/modificateur/20.gif?v=2.15.06\" class=\"statut\" title=\"Terreur\" alt=\"\" /> Terreur</b>.<br><br>Chaque niveau de <b>Terreur</b> déjà présent donne <b>+5 de Précision (maximum +30)</b>."
  },
  "181": {
    "name": "Maléfice de saignement",
    "type": "Sortilège (Hostile)",
    "category": "sortilege",
    "subcategory": "hostile",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 0,
      "max": 3
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": "MAG/5",
        "status": "Saignement",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 0 à 3",
    "desc_html": "Inflige <b>(MAG/5) <img src=\"https://www.kigard.fr/images/modificateur/17.gif?v=2.15.06\" class=\"statut\" title=\"Saignement\" alt=\"\" /> Saignement</b>."
  },
  "182": {
    "name": "Maléfice de nécrose",
    "type": "Sortilège (Hostile)",
    "category": "sortilege",
    "subcategory": "hostile",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 0,
      "max": 3
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": "MAG/5",
        "status": "Nécrose",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 0 à 3",
    "desc_html": "Inflige <b>(MAG/5) <img src=\"https://www.kigard.fr/images/modificateur/9.gif?v=2.15.06\" class=\"statut\" title=\"Nécrose\" alt=\"\" /> Nécrose</b>."
  },
  "183": {
    "name": "Réveil des chairs",
    "type": "Sortilège (Invocation)",
    "category": "sortilege",
    "subcategory": "invocation",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 2
    },
    "area": null,
    "target": "Dépouille",
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": 1,
        "status": "Nécrose",
        "target": "enemy"
      },
      {
        "value": 1,
        "status": "Terreur",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Dépouille • Portée 1 à 2",
    "desc_html": "Relève une <b><img src=\"https://www.kigard.fr/images/vue/monstre/77.gif?v=2.15.06\" class=\"vue\" title=\"\" alt=\"\" /> Goule</b>.<br><br><div style='background-color:white;padding:20px'><b>Profil de la <img src=\"https://www.kigard.fr/images/vue/monstre/77.gif?v=2.15.06\" class=\"vue\" title=\"\" alt=\"\" /> Goule</b><br>Invocation mineure<br><br>FOR <b>0.6 x MAG</b><br>CON <b>0.3 x MAG</b><br>ESP <b>0.2 x MAG</b><br>Pre <b>1.0 x MAG</b><br><br><b>Vulnérabilité Lumière <img src=\"https://www.kigard.fr/images/elements/4.gif?v=2.15.06\" class=\"elements\" title=\"Lumière\" alt=\"\" /> 30%</b><br><b>Inflige 1 <img src=\"https://www.kigard.fr/images/modificateur/9.gif?v=2.15.06\" class=\"statut\" title=\"Nécrose\" alt=\"\" /> Nécrose</b><br><br><u>Bonus <b>Critique</b>:</u><br><b>Attaque défensive</b><br><b>Inflige 1 <img src=\"https://www.kigard.fr/images/modificateur/20.gif?v=2.15.06\" class=\"statut\" title=\"Terreur\" alt=\"\" /> Terreur</b></div><br> <b>Semi-réussite</b>: aucun effet (comme <b>Echec</b>)<br> <b>Critique</b>: gagne <b>un trait</b> et les <b>bonus listés</b> <i>(valeur de MAG non augmentée)</i><br><br>Note : le contenu de la <b>dépouille</b> est ramassé."
  },
  "184": {
    "name": "Réveil des âmes",
    "type": "Sortilège (Invocation)",
    "category": "sortilege",
    "subcategory": "invocation",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 2
    },
    "area": null,
    "target": "Dépouille",
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": 1,
        "status": "Terreur",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Dépouille • Portée 1 à 2",
    "desc_html": "Relève un <b><img src=\"https://www.kigard.fr/images/vue/monstre/72.gif?v=2.15.06\" class=\"vue\" title=\"\" alt=\"\" /> Fantôme</b>.<br><br><div style='background-color:white;padding:20px'><b>Profil du <img src=\"https://www.kigard.fr/images/vue/monstre/72.gif?v=2.15.06\" class=\"vue\" title=\"\" alt=\"\" /> Fantôme</b><br>Invocation mineure<br><br>FOR <b>0.4 x MAG</b><br>INT <b>0.4 x MAG</b><br>CON <b>0.2 x MAG</b><br>ESP <b>0.4 x MAG</b><br>Pre <b>1.0 x MAG</b><br>MM <b>1.0 x MAG</b><br>Esq <b>0.5 x MAG</b><br>DM <b>0.5 x MAG</b><br><br><b>Vulnérabilité Lumière <img src=\"https://www.kigard.fr/images/elements/4.gif?v=2.15.06\" class=\"elements\" title=\"Lumière\" alt=\"\" /> 30%</b><br><b>Siphonner</b><br><br><u>Bonus <b>Critique</b>:</u><br><b>Vol de magie</b><br><b>Inflige 1 <img src=\"https://www.kigard.fr/images/modificateur/20.gif?v=2.15.06\" class=\"statut\" title=\"Terreur\" alt=\"\" /> Terreur</b></div><br> <b>Semi-réussite</b>: aucun effet (comme <b>Echec</b>)<br> <b>Critique</b>: gagne <b>un trait</b> et les <b>bonus listés</b> <i>(valeur de MAG non augmentée)</i><br><br>Note : le contenu de la <b>dépouille</b> est ramassé."
  },
  "185": {
    "name": "Invocation de la roche",
    "type": "Sortilège (Invocation)",
    "category": "sortilege",
    "subcategory": "invocation",
    "cost": {
      "pa": 8,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 2
    },
    "area": null,
    "target": "Rocher",
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": 1,
        "status": "Assommé",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "8 PA & PM • Rocher • Portée 1 à 2",
    "desc_html": "Transforme un rocher en un <b> <img src=\"https://www.kigard.fr/images/vue/monstre/16.gif?v=2.15.06\" class=\"vue\" title=\"\" alt=\"\" /> Golem de pierre</b>.<br><br><div style='background-color:white;padding:20px'><b>Profil du <img src=\"https://www.kigard.fr/images/vue/monstre/16.gif?v=2.15.06\" class=\"vue\" title=\"\" alt=\"\" /> Golem de pierre</b><br>Invocation majeure<br><br>FOR <b>0.6 x MAG</b><br>CON <b>0.6 x MAG</b><br>ESP <b>0.5 x MAG</b><br>Pre <b>1.0 x MAG</b><br><br>ARM <b>+6</b><br><br><u>Bonus <b>Critique</b>:</u><br>ARM <b>+3</b><br><b>Inflige 1 <img src=\"https://www.kigard.fr/images/modificateur/1.gif?v=2.15.06\" class=\"statut\" title=\"Assommé\" alt=\"\" /> Assommé</b></div><br> <b>Semi-réussite</b>: aucun effet (comme <b>Echec</b>)<br> <b>Critique</b>: gagne <b>un trait</b> et les <b>bonus listés</b> <i>(valeur de MAG non augmentée)</i>"
  },
  "186": {
    "name": "Invocation du givre",
    "type": "Sortilège (Invocation)",
    "category": "sortilege",
    "subcategory": "invocation",
    "cost": {
      "pa": 8,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 2
    },
    "area": null,
    "target": "Mur de glace",
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": "Glace",
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": 1,
        "status": "Gel",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "8 PA & PM • Mur de glace • Portée 1 à 2 • <img src=\"https://www.kigard.fr/images/elements/2.gif?v=2.15.06\" class=\"elements\" title=\"Glace\" alt=\"\" />",
    "desc_html": "Transforme le mur de glace en un <b><img src=\"https://www.kigard.fr/images/vue/monstre/63.gif?v=2.15.06\" class=\"vue\" title=\"\" alt=\"\" /> Elémentaire de glace</b>.<br><br><div style='background-color:white;padding:20px'><b>Profil de <img src=\"https://www.kigard.fr/images/vue/monstre/63.gif?v=2.15.06\" class=\"vue\" title=\"\" alt=\"\" /> Elémentaire de glace</b><br>Invocation majeure<br><br>FOR <b>0.5 x MAG</b><br>INT <b>0.5 x MAG</b><br>CON <b>0.5 x MAG</b><br>ESP <b>0.5 x MAG</b><br>Pre <b>1.5 x MAG</b><br>MM <b>1.5 x MAG</b><br><br>MAG <b>+4</b><br><b>Résistance Glace <img src=\"https://www.kigard.fr/images/elements/2.gif?v=2.15.06\" class=\"elements\" title=\"Glace\" alt=\"\" /> 20%</b><br><b>Rafale de givre</b><br><br><u>Bonus <b>Critique</b>:</u><br>MAG <b>+2</b><br><b>Résistance Glace <img src=\"https://www.kigard.fr/images/elements/2.gif?v=2.15.06\" class=\"elements\" title=\"Glace\" alt=\"\" /> 20%</b><br><b>Inflige 1 <img src=\"https://www.kigard.fr/images/modificateur/39.gif?v=2.15.06\" class=\"statut\" title=\"Gel\" alt=\"\" /> Gel</b></div><br> <b>Semi-réussite</b>: aucun effet (comme <b>Echec</b>)<br> <b>Critique</b>: gagne <b>un trait</b> et les <b>bonus listés</b> <i>(valeur de MAG non augmentée)</i>"
  },
  "187": {
    "name": "Invocation du cristal",
    "type": "Sortilège (Invocation)",
    "category": "sortilege",
    "subcategory": "invocation",
    "cost": {
      "pa": 8,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 2
    },
    "area": null,
    "target": "Mur de cristal",
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "8 PA & PM • Mur de cristal • Portée 1 à 2",
    "desc_html": "Transforme un mur de cristal en un <b><img src=\"https://www.kigard.fr/images/vue/monstre/89.gif?v=2.15.06\" class=\"vue\" title=\"\" alt=\"\" /> Gardien de cristal</b>.<br><br><div style='background-color:white;padding:20px'><b>Profil du <img src=\"https://www.kigard.fr/images/vue/monstre/89.gif?v=2.15.06\" class=\"vue\" title=\"\" alt=\"\" /> Gardien de cristal</b><br>Invocation majeure<br><br>FOR <b>0.5 x MAG</b><br>INT <b>0.5 x MAG</b><br>CON <b>0.5 x MAG</b><br>ESP <b>0.5 x MAG</b><br>Pre <b>1.0 x MAG</b><br>MM <b>1.0 x MAG</b><br>DM <b>1.0 x MAG</b><br><br>MAG <b>+4</b><br>RES <b>+4</b><br><b>Lance de cristal</b><br><br><u>Bonus <b>Critique</b>:</u><br>MAG <b>+2</b><br>RES <b>+2</b><br><b>Résonance</b>: les statuts positifs reçus sont également appliqués à son maître</div><br> <b>Semi-réussite</b>: aucun effet (comme <b>Echec</b>)<br> <b>Critique</b>: gagne <b>un trait</b> et les <b>bonus listés</b> <i>(valeur de MAG non augmentée)</i>"
  },
  "189": {
    "name": "Attaque explosive",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": "weapon",
      "pm": 0
    },
    "range": {
      "type": "weapon"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": "Feu",
    "prereq": {
      "weaponType": [
        "Gant",
        "Fusil"
      ],
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": null,
      "notes": "Interdit si Agonisant"
    },
    "damage": {
      "formula": "default",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [
      {
        "value": 3,
        "status": "Brûlure",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "(Coût Arme) PA • Portée Arme • <span class='rouge'>Requis : Gant, Fusil ou Arme de Feu <img src=\"https://www.kigard.fr/images/elements/1.gif?v=2.15.06\" class=\"elements\" title=\"Feu\" alt=\"\" /> • <span class='rouge'>Interdit si Agonisant",
    "desc_html": "Inflige à l'utilisateur <b>10 <u>dégâts purs</u> de Feu <img src=\"https://www.kigard.fr/images/elements/1.gif?v=2.15.06\" class=\"elements\" title=\"Feu\" alt=\"\" /></b>.<br>Attaque de l'<b>arme principale</b> avec <b>+15 en Précision</b> et <b>+3 Dégâts</b>.<br><br>Un objet (au choix) peut être utilisé :<ul><li>Une <img src=\"https://www.kigard.fr/images/items/359.gif?v=2.15.06\" class=\"item\" title=\"\" alt=\"\" /> <b>fiole incendiaire</b> ajoute <b>l'élément du Feu <img src=\"https://www.kigard.fr/images/elements/1.gif?v=2.15.06\" class=\"elements\" title=\"Feu\" alt=\"\" /></b> et <b>+3 <img src=\"https://www.kigard.fr/images/modificateur/16.gif?v=2.15.06\" class=\"statut\" title=\"Brûlure\" alt=\"\" /> Brûlure</b>.<li>Une <img src=\"https://www.kigard.fr/images/items/343.gif?v=2.15.06\" class=\"item\" title=\"\" alt=\"\" /> <b>poudre noire</b> ajoute <b>+15 en Précision</b> et <b>+3 Dégâts</b>.</ul>"
  },
  "190": {
    "name": "Electrocution",
    "type": "Sortilège (Hostile)",
    "category": "sortilege",
    "subcategory": "hostile",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 3
    },
    "area": null,
    "target": null,
    "isFreeAction": true,
    "isDiscreetAction": false,
    "element": "Foudre",
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": null,
    "statuses": [
      {
        "value": 2,
        "status": "Surcharge",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 1 à 3 • Action libre • <img src=\"https://www.kigard.fr/images/elements/3.gif?v=2.15.06\" class=\"elements\" title=\"Foudre\" alt=\"\" />",
    "desc_html": "Inflige des <u>dégâts magiques</u> de Foudre <img src=\"https://www.kigard.fr/images/elements/3.gif?v=2.15.06\" class=\"elements\" title=\"Foudre\" alt=\"\" /></b>.<br>Confère au lanceur <b>2 <img src=\"https://www.kigard.fr/images/modificateur/29.gif?v=2.15.06\" class=\"statut\" title=\"Surcharge\" alt=\"\" /> Surcharge</b>.<br><br>Le statut <b>Surcharge</b> n'est pas déclenché par ce sortilège."
  },
  "191": {
    "name": "Défense obstinée",
    "type": "Technique (Spécial)",
    "category": "technique",
    "subcategory": "special",
    "cost": {
      "pa": 4,
      "pm": 0
    },
    "range": {
      "type": "self"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": [
        "Bouclier",
        "Gant"
      ],
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": "weaponOff",
      "vocation": null
    },
    "damage": null,
    "statuses": [
      {
        "value": 3,
        "status": "Défense",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA • Soi-même • <span class='rouge'>Requis : Bouclier ou Gant (main gauche)",
    "desc_html": "Gagne <b>3 <img src=\"https://www.kigard.fr/images/modificateur/10.gif?v=2.15.06\" class=\"statut\" title=\"Défense\" alt=\"\" /> Défense</b>.<br><br>Jusqu'à la prochaine activation, le statut Défense <b>immunise</b> aux actions <b>Pousser</b> et <b>Exposer</b>."
  },
  "192": {
    "name": "Opérer les blessures",
    "type": "Technique (Spécial)",
    "category": "technique",
    "subcategory": "special",
    "cost": {
      "pa": 4,
      "pm": 0
    },
    "range": {
      "min": 0,
      "max": 1
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Médecine"
    },
    "damage": {
      "formula": "INT",
      "altFormula": null,
      "kind": "heal",
      "weaponDgtSource": null,
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": "+15 précision sur cible blessée, +30 sur cible agonisante. Avec fil à coudre : +15 précision et ignore Saignement.",
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [
      {
        "value": null,
        "status": "Saignement",
        "target": "self"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA • Portée 0 à 1",
    "desc_html": "Réalise un <b>soin</b> avec <b>+15 de précision sur une cible blessée</b> ou <b>+30 sur une cible agonisante</b></b>.<br><br>Pour ce soin, l'effet du <b> <img src=\"https://www.kigard.fr/images/modificateur/17.gif?v=2.15.06\" class=\"statut\" title=\"Saignement\" alt=\"\" /> Saignement</b> est <b>réduit de moitié</b> <i>(le statut réduit les soins de X au lieu de 2X)</i>.<br><br>Un <img src=\"https://www.kigard.fr/images/items/223.gif?v=2.15.06\" class=\"item\" title=\"\" alt=\"\" /> <b>fil à coudre</b> peut être utilisé pour obtenir <b>+15 de précision</b> et <b>ignorer le Saignement</b>."
  },
  "193": {
    "name": "Administrer une potion",
    "type": "Technique (Spécial)",
    "category": "technique",
    "subcategory": "special",
    "cost": {
      "pa": 4,
      "pm": 0
    },
    "range": {
      "min": 0,
      "max": 1
    },
    "area": null,
    "target": "Cible alliée",
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Médecine"
    },
    "damage": {
      "formula": "INT",
      "altFormula": null,
      "kind": "heal",
      "weaponDgtSource": null,
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": "Fait également boire une potion à la cible (hors limite par tour).",
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA • Cible alliée • Portée 0 à 1",
    "desc_html": "Réalise un <b>soin</b> et fait <b>boire une potion</b> à la cible.<br><br>Ne compte pas dans la limite par tour de l'action <b>boire</b>.<br><br><i>Note : impossible d'utiliser un <img src=\"https://www.kigard.fr/images/items/340.gif?v=2.15.06\" class=\"item\" title=\"\" alt=\"\" /> <b>philtre d'oubli</b>, une <img src=\"https://www.kigard.fr/images/items/305.gif?v=2.15.06\" class=\"item\" title=\"\" alt=\"\" /> <b>potion de rappel</b> ou une <img src=\"https://www.kigard.fr/images/items/15.gif?v=2.15.06\" class=\"item\" title=\"\" alt=\"\" /> <b>potion d'expérience</b>."
  },
  "194": {
    "name": "Attaque provocante",
    "type": "Technique (Attaque)",
    "category": "technique",
    "subcategory": "attaque",
    "cost": {
      "pa": "weapon",
      "pm": 0
    },
    "range": {
      "type": "weapon"
    },
    "area": null,
    "target": null,
    "isFreeAction": false,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": [
        "Arc",
        "Fusil"
      ],
      "slot": null,
      "vocation": null
    },
    "damage": {
      "formula": "default",
      "altFormula": null,
      "kind": "physical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [
      {
        "value": 2,
        "status": "Provocation",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "(Coût Arme) PA • Portée Arme • <span class='rouge'>Requis : ni Arc ni Fusil",
    "desc_html": "Attaque de l'<b>arme principale</b>.<br><br>Si <b>[CHA] > PV/10 de la cible</b> :<br> <b>Réussite</b> : inflige <b>2 <img src=\"https://www.kigard.fr/images/modificateur/47.gif?v=2.15.06\" class=\"statut\" title=\"Provocation\" alt=\"\" /> Provocation</b> (non cumulatif)<br> <b>Critique</b> : inflige <b>3</b>"
  },
  "195": {
    "name": "Choc mental",
    "type": "Sortilège (Hostile)",
    "category": "sortilege",
    "subcategory": "hostile",
    "cost": {
      "pa": 4,
      "pm": "same"
    },
    "range": {
      "min": 1,
      "max": 2
    },
    "area": null,
    "target": null,
    "isFreeAction": true,
    "isDiscreetAction": false,
    "element": null,
    "prereq": {
      "weaponType": null,
      "weaponCategory": null,
      "weaponExclude": null,
      "slot": null,
      "vocation": "Mysticisme"
    },
    "damage": {
      "formula": "MAG",
      "altFormula": null,
      "kind": "magical",
      "weaponDgtSource": "main",
      "preMod": null,
      "criticalMultiplier": null,
      "criticalNote": null,
      "advantage": null,
      "confersAdvantage": null,
      "precisionFormula": null,
      "precisionFormulaBonus": null,
      "ignoresStatus": null,
      "armorPenetration": null
    },
    "statuses": [
      {
        "value": 2,
        "status": "Envoûtement",
        "target": "enemy"
      }
    ],
    "effects": [],
    "specialEffects": [],
    "info_html": "4 PA & PM • Portée 1 à 2 • Action libre",
    "desc_html": "Inflige <b>(MAG) <u>dégâts magiques</u></b> et <b>2 <img src=\"https://www.kigard.fr/images/modificateur/31.gif?v=2.15.06\" class=\"statut\" title=\"Envoûtement\" alt=\"\" /> Envoûtement</b>."
  }
};
