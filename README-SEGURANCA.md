# Sistema de Segurança - Édaquí Studio

## Proteção da Página de Gerenciamento

A página de gerenciamento de conteúdo está protegida por um sistema de autenticação por senha.

## Como Funciona

### Primeira Configuração

1. Acesse o link **"Gerir"** no menu do site
2. Você será redirecionado para a página de login
3. Clique em **"Primeira vez? Configurar senha"**
4. Digite uma senha (mínimo 6 caracteres)
5. Confirme a senha
6. A senha será armazenada de forma segura (hash SHA-256)

### Fazer Login

1. Acesse o link **"Gerir"** no menu
2. Digite a senha configurada
3. Clique em **"Entrar"**
4. Você terá acesso por 24 horas sem precisar fazer login novamente

### Sair (Logout)

- Na página de gerenciamento, clique no botão **"Sair"** no topo
- Ou aguarde 24 horas para a sessão expirar automaticamente

## Segurança

### Características de Segurança

- **Hash SHA-256**: A senha nunca é armazenada em texto plano, apenas o hash
- **Sessão com expiração**: A sessão expira após 24 horas
- **Proteção de página**: A página `gerir.html` verifica autenticação antes de carregar
- **Redirecionamento automático**: Usuários não autenticados são redirecionados para login

### Limitações

⚠️ **Importante**: Este é um sistema de segurança básico adequado para uso pessoal. Para ambientes de produção com dados sensíveis, considere:

- Implementar autenticação de dois fatores (2FA)
- Usar um sistema de backend com tokens JWT
- Adicionar rate limiting para prevenir ataques de força bruta
- Implementar logs de auditoria

## Recuperação de Senha

Se você esquecer a senha:

1. Abra o Console do navegador (F12)
2. Execute: `localStorage.removeItem('edaqui_admin_password_hash')`
3. Acesse novamente e configure uma nova senha

## Dicas de Segurança

1. **Use uma senha forte**: Mínimo 8 caracteres, com letras, números e símbolos
2. **Não compartilhe a senha**: Mantenha a senha em segredo
3. **Faça logout**: Sempre saia quando terminar de usar, especialmente em computadores compartilhados
4. **Backup regular**: Exporte os dados regularmente para não perder informações

## Nota Técnica

- A senha é hasheada usando Web Crypto API (SHA-256)
- A sessão é armazenada no localStorage com timestamp de expiração
- Não há comunicação com servidor - tudo funciona localmente

