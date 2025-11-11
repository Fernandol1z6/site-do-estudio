# Sistema de Gerenciamento de Conteúdo - Édaquí Studio

## Como Usar

### Acessar a Página de Gerenciamento

1. Acesse o site e clique em **"Gerir"** no menu de navegação
2. Ou acesse diretamente: `gerir.html`

### Adicionar Fotos na Galeria

1. **Fazer Upload da Imagem:**
   - Use um serviço gratuito como [ImgBB](https://imgbb.com)
   - Faça upload da sua imagem
   - Copie o link direto da imagem (URL completa que termina em .jpg, .png, etc.)

2. **Adicionar no Site:**
   - Na página "Gerir", preencha o formulário:
     - **URL da Imagem**: Cole o link direto da imagem
     - **Descrição**: Nome ou descrição da foto
     - **Categoria**: Escolha entre Casamentos, Retratos, Produto ou Eventos
     - **Título** (opcional): Título adicional
   - Clique em "Adicionar Foto"

3. **Visualizar:**
   - As fotos aparecerão automaticamente na galeria
   - Elas serão exibidas na página "Portfólio" do site

### Configurar o Site

Na seção "Configurações do Site", você pode alterar:
- Título e subtítulo da página inicial
- Imagem de fundo do hero
- Telefones e email de contacto

### Exportar e Importar Dados

**Exportar (Fazer Backup):**
- Clique em "Exportar Dados"
- Um arquivo JSON será baixado com todas as suas fotos e configurações
- Guarde este arquivo em segurança

**Importar (Restaurar Backup):**
- Clique em "Importar Dados"
- Selecione o arquivo JSON que exportou anteriormente
- Todas as fotos e configurações serão restauradas

### Eliminar Fotos

- Na galeria de fotos, clique no ícone de lixeira (🗑️) na foto que deseja eliminar
- Confirme a eliminação

## Dicas

1. **Para melhores resultados:**
   - Use imagens de boa qualidade
   - Certifique-se de que o link da imagem é direto (não uma página, mas o arquivo da imagem)
   - Use serviços confiáveis como ImgBB para hospedar as imagens

2. **Backup Regular:**
   - Faça backup regularmente exportando os dados
   - Isso garante que não perca suas fotos se algo acontecer

3. **Organização:**
   - Use categorias consistentes para facilitar a organização
   - Adicione descrições claras para cada foto

## Nota Técnica

Os dados são armazenados no navegador (localStorage). Para que as alterações sejam visíveis em todos os dispositivos, você precisará:
- Exportar os dados do dispositivo onde fez as alterações
- Importar no outro dispositivo

Ou, para um site em produção, considere usar um sistema de backend para sincronizar os dados.

