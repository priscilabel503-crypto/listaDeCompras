# listaDeCompras

## Descrição

Aplicativo simples para organizar suas compras: permite adicionar itens com quantidade e setor, agrupa automaticamente por setor (ex.: Frios, Carnes, Hortifruti) e ordena os itens alfabeticamente dentro de cada grupo. Marque itens como comprados, filtre por Pendentes/Comprados/Todos e personalize a cor do tema; todas as informações são salvas no `localStorage` do navegador.

Pequeno app de exemplo que salva uma lista de compras no navegador usando `localStorage`.

Como usar:

- Abra [index.html](index.html) no navegador.
- Adicione itens no campo e clique em "Adicionar".
- Marque a checkbox para indicar comprado, edite ou exclua itens com os botões.
- Use "Limpar tudo" para apagar todos os itens.

Campo adicional:

- Quantidade: ao adicionar um item informe a quantidade (padrão = 1). Ao editar, será solicitado atualizar nome e quantidade.

 - Tema:
 
 - Use o seletor de cor "Tema" para alterar a cor de destaque do app; a escolha é salva no `localStorage`.

Agrupamento e ordenação:

 - Os itens agora possuem um campo `Setor` (ex.: `Frios`, `Carnes`, `Hortifruti`).
 - A lista é exibida agrupada por setor e, dentro de cada setor, os itens são ordenados alfabeticamente.

Playlist:

 - A interface inclui uma seção "Playlist" para adicionar músicas (Título e URL opcional).
 - Se o URL for um arquivo de áudio (.mp3, .wav, .ogg, .m4a), a música toca no player embutido; se for outro link, abre em nova aba; sem URL, o app realiza uma busca no YouTube pelo título.
 - A playlist também é salva no `localStorage`.

Abrir no Spotify:

 - Se o campo URL da música contém um link do Spotify (por exemplo `https://open.spotify.com/track/...`) ou um URI `spotify:track:<id>`, o app abrirá essa faixa no Spotify (cliente web/desktop/móvel), se instalado.
 - Se nenhum URL for informado, ao clicar em ▶ o app fará uma busca por esse título diretamente no Spotify.

Tocar tudo:

 - O botão "Tocar tudo" reproduz sequencialmente todas as faixas que têm URL de arquivo de áudio (.mp3, .wav, .ogg, .m4a) usando o player embutido.
 - Para faixas que têm link do Spotify ou outros links (ou sem URL), o app oferece abrir essas faixas no Spotify/links em novas abas antes de reproduzir os áudios locais.

- Use o seletor de cor "Tema" para alterar a cor de destaque do app; a escolha é salva no `localStorage`.

Arquivos principais:

- [index.html](index.html)
- [styles.css](styles.css)
- [app.js](app.js)
