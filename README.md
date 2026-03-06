# Mini Kanban Portal (Frontend)

SPA React para gerenciamento visual de Quadros, Colunas e Cartões, integrando com a Mini Kanban API.

## 🚀 Rodando o projeto localmente (Docker)

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/Pablo-Francisco-Moura/mini-kanban-portal.git
   cd mini-kanban-portal
   ```

2. **Configure as variáveis de ambiente:**
   - O arquivo `.env` já está configurado para uso local.

3. **Suba o frontend em Docker:**

   ```bash
   docker compose up --build
   ```

   - O frontend estará disponível em http://localhost:5173
   - O hot reload estará ativo para desenvolvimento.

4. **(Opcional) Rodando localmente sem Docker:**

   ```bash
   npm install
   npm run dev
   ```

   - Acesse http://localhost:5173

## 🧪 Executando os testes

1. **Instale as dependências:**
   ```bash
   npm install
   ```
2. **Execute os testes unitários:**
   ```bash
   npx vitest run
   ```
   Ou, para interface interativa:
   ```bash
   npx vitest --ui
   ```

## 🚀 Produção

- Portal:
  https://mini-kanban-portal.vercel.app/
