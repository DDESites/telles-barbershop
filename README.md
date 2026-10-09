# Telles Barbershop — Site institucional

Site moderno, elegante e responsivo da **Telles Barbershop**, construído a partir do PRD em `docs/PRD.md`.
Identidade visual: leão coroado com tesouras cruzadas, dourado metálico e vermelho queimado.

**Site no ar:** https://ddesites.github.io/telles-barbershop/
**Repositório:** https://github.com/DDESites/telles-barbershop

Construído em **HTML, CSS e JavaScript puros** — sem dependências, sem build.

## Como ver o site

Opção 1 — servidor local (recomendado):

```powershell
.\server.ps1
# abre http://localhost:8095
```

Opção 2: abrir `index.html` direto no navegador (funciona, mas sem servidor local).

## Estrutura

```
telles-barbershop\
├── index.html          Início (hero, destaques, serviços, sobre, galeria, avaliações, localização, CTA)
├── servicos.html       Lista de serviços com CTA de agendamento por serviço
├── sobre.html          A barbearia (história, diferenciais, equipe)
├── galeria.html        Galeria com lightbox (ampliar imagem)
├── contato.html        Contatos, mapa, horários e formulário → WhatsApp
├── css\style.css       Todo o visual (tokens da paleta no topo)
├── js\main.js          WhatsApp, menu, animações, lightbox e formulário
├── img\                Emblema, favicon, cartaz do hero e artes da galeria (SVG)
├── docs\PRD.md         Briefing original
├── server.ps1          Servidor local na porta 8095
├── capturar.ps1        Gera capturas desktop+mobile em .capturas\ (requer server.ps1 rodando)
└── _mobile-shot.html   Auxiliar do capturar.ps1 (iframe de 390px para prints mobile fiéis)
```

## Identidade visual

| Cor | Hex | Uso |
|---|---|---|
| Vermelho queimado | `#8F2B13` | Botões, assinaturas, painel CTA |
| Dourado claro | `#F2D47B` | Títulos, detalhes, ornamentos |
| Dourado escuro | `#A96024` | Bordas, sombras do dourado |
| Preto quente | `#171310` | Fundos e texto de alto contraste |
| Marfim | `#E8D8A7` | Detalhes e superfícies claras |
| Branco suave | `#F5F2EC` | Texto sobre fundos escuros |

- Títulos: **Playfair Display** (serifada elegante).
- Textos: **Inter** (sans-serif legível).
- Rótulo “BARBERSHOP”: caixa alta com espaçamento amplo (`marca__sub`).
- Emblema: `img/emblema.svg` (leão coroado + tesouras cruzadas) e `img/favicon.svg` (versão compacta). **Arte vetorial provisória** — substituir pelo arquivo oficial da marca quando disponível, mantendo o mesmo espaço no cabeçalho/rodapé.

## ⚠️ Checklist antes de publicar

Nenhum dado real foi inventado: tudo o que depende da barbearia está marcado como **“a confirmar”** na interface.

- [ ] **WhatsApp/número real** — trocar em `js/main.js` (`WHATSAPP_NUMERO` e `TELEFONO_FALLBACK`) e nos links `tel:` de todos os HTML.
- [ ] **Endereço completo** — preencher em `index.html` e `contato.html`; incorporar o mapa (Google Maps iframe) em `contato.html#mapa` e ajustar o link “Como chegar”.
- [ ] **Horários de funcionamento** — atualizar as tabelas de `index.html` e `contato.html`.
- [ ] **Preços e durações dos serviços** — substituir os chips “a confirmar” nos cards de serviço (remover os chips e publicar os valores aprovados).
- [ ] **Instagram/redes oficiais** — confirmar `@tellesbarbearia` ou trocar o handle em todas as páginas.
- [ ] **Logo oficial** — substituir `img/emblema.svg` e `img/favicon.svg` pelo arquivo oficial (vetor com fundo transparente), mantendo proporções.
- [ ] **Fotos reais** — substituir as artes da galeria (`img/galeria-*.svg`) e as ilustrações `img/espaco.svg` e `img/ferramentas.svg` por fotos reais (WebP/JPG otimizados).
- [ ] **Depoimentos** — publicar somente com autorização; preencher o painel reservado em `index.html`.
- [ ] **Plataforma de avaliações** — inserir o link público em `index.html`, se houver.
- [ ] **Textos institucionais** — revisar história e diferenciais com a barbearia.
- [ ] Remover os comentários “⚠️ SUBSTITUIR” de `js/main.js` após a configuração.

## Mensagens do WhatsApp

Cada botão usa `data-zap="mensagem"` no HTML; o JavaScript monta o link `https://wa.me/...?text=...`.
Para mudar um texto de contato, edite o atributo `data-zap` do botão correspondente.

## Acessibilidade e SEO

- Navegação por teclado, foco visível, “pular para o conteúdo”.
- Textos alternativos em todas as imagens informativas.
- Lightbox com navegação por setas e fechamento por `Esc`.
- Títulos e meta descriptions de cada página.
- Respeita `prefers-reduced-motion`.
