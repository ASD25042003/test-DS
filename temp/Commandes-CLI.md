


## ⚙️ Commandes CLI (terminal principal)

Ces commandes s’exécutent directement dans un terminal avant d’accéder à l’interface interactive :

* `npm install -g @anthropic-ai/claude-code` : installe Claude Code globalement ([Anthropic][1])
* `claude` : lance une session interactive REPL ([Anthropic][2])
* `claude "votre requête"` : lance REPL avec un prompt initial ([Anthropic][2])
* `claude -p "votre requête"` : exécute une requête une seule fois puis quitte (mode non interactif) ([Anthropic][3])
* `cat fichier | claude -p "req"` : pipe du contenu pour Claude à analyser ([Anthropic][3])
* `claude -c` : continue la dernière conversation ([Anthropic][2])
* `claude -r <session‑id> "requête"` : reprend une session donnée ([Anthropic][3])
* `claude update` : met à jour vers la dernière version ([Anthropic][3])
* `claude config` (ou `claude config set <clé> <valeur>`) : configurer les paramètres ([zebbern.github.io][4])
* `claude mcp` : gérer les serveurs MCP (Model Context Protocol) pour l’extension de capacités ([Anthropic][3])

💡 **Flags CLI utiles** :

* `--print` (`-p`) : mode sortie sans interface
* `--json` : format JSON de sortie
* `--verbose` : journalisation détaillée
* `--dangerously-skip-permissions` : désactive les invites de permission ([Anthropic][3], [Anthropic][5])

---

## 🧠 Slash commands (à taper dans une session `claude`)

Ces commandes agissent directement dans la session interactive (préfixées par `/`) :

* `/help` : affiche l’aide et les commandes disponibles ([Anthropic][5], [Anthropic][6])
* `/init` : initialise l’analyse du projet et génère le fichier **CLAUDE.md** ([Anthropic][6])
* `/clear` : efface l’historique de conversation (utile pour économiser des tokens) ([Anthropic][6])
* `/config` : voir/modifier la configuration à chaud ([Anthropic][6])
* `/model` : changer le modèle utilisé en session (e.g. Sonnet, Opus) ([Anthropic][6])
* `/permissions` : gérer les accès du système (fichiers, outils…) ([Claude Code 云原生][7])
* `/doctor` : vérifie l’état de l’installation de Claude Code ([Anthropic][6])
* `/cost` : montre l’utilisation des tokens et coût estimé ([Anthropic][5])
* `/review` : demande une relecture de code automatisée ([Anthropic][6], [MCPcat][8])
* `/terminal-setup` : installe les raccourcis Shift+Enter pour les entrées multi‑ligne ([Anthropic][6])
* `/vim` : active le mode vim dans Claude Code (navigation/édition) ([Anthropic][6])
* `/memory` : éditer les fichiers **CLAUDE.md** (mémoire, préférences, etc.) ([Anthropic][6])
* `/bug` : signale un bug à Anthropic ([Anthropic][6])
* `/pr_comments` : consulter les commentaires sur une PR ([Anthropic][6])
* `/compact [instructions]` : compacter une conversation pour réduire le contexte ([Anthropic][6])

---

## 📎 Personnalisation : commandes slash « personnelles » ou « projet »

Vous pouvez créer vos propres commandes depuis des fichiers Markdown :

* **Commandes projet** : `.claude/commands/nom.md` → `/nom` (décrit « (projet) »)
* **Commandes utilisateur globales** : `~/.claude/commands/nom.md` → `/nom` (décrit « (user) »)
* Arguments dynamiques avec `$ARGUMENTS` dans le template Markdown ([Claude Code 云原生][7], [Anthropic][6])

👥 **Exemple de personnalisation** :

```
mkdir -p ~/.claude/commands
echo "Review this code for security vulnerabilities: $ARGUMENTS" > ~/.claude/commands/security-review.md
```

Puis en session : `> /security-review path/to/file` ([Anthropic][6])

