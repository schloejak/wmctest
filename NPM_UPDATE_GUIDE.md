# NPM Package Update Guide

## Schnellanleitung

```bash
# 1. Änderungen machen
# 2. Version erhöhen
npm version patch    # 1.0.0 -> 1.0.1

# 3. Library bauen
npm run build:lib

# 4. Publishen
npm publish
```

---

## Detaillierte Anleitung: Package Update

### Schritt 1: Änderungen machen

Mache deine Code-Änderungen wie gewohnt. Für dieses Update wurde hinzugefügt:
- ✅ `BackendService` für API-Kommunikation
- ✅ `BackendDemoComponent` als Beispiel
- ✅ Neue Route `/demo`

### Schritt 2: Version erhöhen

Semantic Versioning verwenden:

```bash
# Patch (Bug fixes): 1.0.0 -> 1.0.1
npm version patch

# Minor (Neue Features): 1.0.0 -> 1.1.0
npm version minor

# Major (Breaking Changes): 1.0.0 -> 2.0.0
npm version major
```

**Für dieses Update:** Neue Features = Minor Update
```bash
npm version minor
# Wird 1.0.0 -> 1.1.0
```

Oder manuell in `package.json`:
```json
{
  "version": "1.0.1"
}
```

### Schritt 3: CHANGELOG.md aktualisieren

Dokumentiere deine Änderungen:

```markdown
## [1.0.1] - 2026-04-06

### Added
- BackendService für API-Kommunikation
- Neue HTTP-Methoden (GET, POST, PUT, PATCH, DELETE)

### Changed
- Home Component mit Demo-Link erweitert
```

### Schritt 4: Library bauen

```bash
npm run build:lib
```

Dies kompiliert den Code nach `dist/`:
```
dist/
├── public-api.js
├── public-api.d.ts
└── app/
    ├── auth/
    ├── guards/
    ├── backend/     ← NEU
    ├── login/
    └── home/
```

**Wichtig:** Überprüfe, dass keine Fehler auftreten!

### Schritt 5: Testen (optional aber empfohlen)

```bash
# Pack das Package lokal
npm pack

# Dies erstellt: yourusername-angular-auth-template-1.0.1.tgz
```

Teste in einem anderen Projekt:
```bash
cd ../test-project
npm install ../wmctest/yourusername-angular-auth-template-1.0.1.tgz
```

### Schritt 6: Publishen

```bash
# Einloggen (falls noch nicht)
npm login

# Publishen
npm publish
```

Für scoped packages:
```bash
npm publish --access public
```

### Schritt 7: Verifizieren

1. Auf npm.js prüfen:
   ```
   https://www.npmjs.com/package/@yourusername/angular-auth-template
   ```

2. Version sollte aktualisiert sein
3. README sollte korrekt angezeigt werden

### Schritt 8: Git Tag (optional)

```bash
git add .
git commit -m "Release v1.0.1: Add BackendService"
git tag v1.0.1
git push origin main --tags
```

---

## Was wurde in Version 1.0.1 hinzugefügt?

### BackendService

Ein minimalistischer Service für Backend-Kommunikation:

```typescript
import { BackendService } from '@yourusername/angular-auth-template';

// In deiner Komponente
backendService = inject(BackendService);

// GET Request
this.backendService.get<User[]>('/users').subscribe(users => {
  console.log(users);
});

// POST Request
this.backendService.post<User>('/users', { name: 'John' }).subscribe(user => {
  console.log(user);
});

// Mit Query Parameters
this.backendService.get<User[]>('/users', { page: 1, limit: 10 }).subscribe();

// File Upload
this.backendService.uploadFile('/upload', file).subscribe();

// File Download
this.backendService.downloadFile('/export').subscribe(blob => {
  // Download blob
});
```

### Features

- ✅ **Generische HTTP-Methoden**: GET, POST, PUT, PATCH, DELETE
- ✅ **Query Parameters**: Einfache Parameter-Übergabe
- ✅ **File Upload/Download**: Built-in Support
- ✅ **TypeScript Generics**: Type-safe responses
- ✅ **Automatischer Token**: Nutzt authInterceptor
- ✅ **ApiResponse Interface**: Standardisierte Responses

### Verwendung

```typescript
import { Component, inject } from '@angular/core';
import { BackendService } from '@yourusername/angular-auth-template';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-products',
  template: `
    @for (product of products(); track product.id) {
      <div>{{ product.name }} - {{ product.price }}</div>
    }
  `
})
export class ProductsComponent {
  backendService = inject(BackendService);
  products = signal<Product[]>([]);

  ngOnInit() {
    // Automatisch mit JWT Token
    this.backendService.get<Product[]>('/products').subscribe(
      products => this.products.set(products)
    );
  }
}
```

---

## Häufige Fragen

### Muss ich die Version manuell erhöhen?

Nein, verwende `npm version`:
```bash
npm version patch  # Automatisch erhöhen + Git commit/tag
```

### Wie teste ich vor dem Publish?

```bash
npm pack
# Dann .tgz in anderem Projekt installieren
```

### Kann ich ein Publish rückgängig machen?

Nur innerhalb von 72h:
```bash
npm unpublish @yourusername/package@1.0.1
```

⚠️ **Achtung**: Besser ist es, eine neue Version zu publishen!

### Was wenn der Build fehlschlägt?

```bash
# TypeScript-Fehler prüfen
npx tsc --noEmit

# Cache löschen
rm -rf dist/
npm run build:lib
```

### Wie aktualisieren User das Package?

```bash
npm update @yourusername/angular-auth-template

# Oder spezifische Version
npm install @yourusername/angular-auth-template@1.0.1
```

---

## Best Practices

1. **Immer CHANGELOG.md aktualisieren**
2. **Semantic Versioning befolgen**
3. **Tests vor Publish durchführen**
4. **Git Tags erstellen**
5. **README aktualisieren bei Breaking Changes**

---

## Automation (Optional)

### package.json Scripts

```json
{
  "scripts": {
    "release:patch": "npm version patch && npm run build:lib && npm publish",
    "release:minor": "npm version minor && npm run build:lib && npm publish",
    "release:major": "npm version major && npm run build:lib && npm publish"
  }
}
```

Dann einfach:
```bash
npm run release:patch
```

### GitHub Actions (Optional)

Erstelle `.github/workflows/publish.yml` für automatisches Publishing bei Git Tags.

---

## Zusammenfassung für dieses Update

```bash
# 1. Version erhöhen
npm version minor  # 1.0.0 -> 1.1.0

# 2. CHANGELOG aktualisiert ✓

# 3. Build
npm run build:lib

# 4. Publish
npm publish --access public

# 5. Git
git push origin main --tags
```

**Fertig!** 🎉

Das Package ist nun auf npm mit BackendService verfügbar!
