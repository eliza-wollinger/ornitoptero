# Codex do Voo — Ornitóptero de Leonardo da Vinci

Museu virtual educativo em português com modelo 3D interativo, inspirado nos estudos de Leonardo da Vinci sobre máquinas de asas batentes (c. 1486).

## Executar

Requisitos: Node.js recente e npm.

```bash
npm install
npm run dev
```

Abra a URL indicada pelo Vite (normalmente http://localhost:5173).

Gerar versão de publicação:

```bash
npm run build
npm run preview
```

O diretório `dist/` contém a versão estática pronta para hospedagem. O Vite usa `base: './'` para facilitar publicação em subdiretórios (como GitHub Pages).

## Arquitetura

- `src/App.jsx`: narrativa, painel informativo, controles, seções de física e fontes.
- `src/components/Ornithopter.jsx`: modelo 3D procedural em React Three Fiber.
- `src/style.css`: tema caderno renascentista/pergaminho e responsividade.
- `vite.config.js`: configuração de build e URLs relativas.

## Funcionalidades (versão 0.1)

- Modelo 3D procedural, sem modelos externos.
- Câmera orbital com mouse/toque, zoom e reposicionamento.
- Batimento alternado das asas com frequência e amplitude ajustáveis.
- Peças clicáveis e texto explicativo correspondente.
- Identificações opcionais, seção introdutória de princípios físicos e fontes museológicas.
- Interface responsiva e layout de pergaminho.

## Limitações e rigor histórico

**É uma interpretação didática, e NÃO uma reconstrução geométrica exata ou uma simulação aerodinâmica.** O modelo 3D não tem escala validada, os cabos não transmitem força fisicamente, os pedais se movem de forma ilustrativa e a membrana não modela torção aerodinâmica. A frequência e a amplitude alteram apenas a animação. A equação de sustentação apresentada é introdutória para condições aproximadamente estacionárias; asas batentes exigem análise não estacionária. Não há previsão de voo real.

## Referências

- Museo Leonardiano: https://museoleonardiano.it/en/opera/flying-machine/
- Science Museum Group: https://collection.sciencemuseumgroup.org.uk/objects/co29417/leonardo-da-vincis-design-for-an-ornithopter-c-1486
- Manuscrito B, fólio 74v: https://www.leonardodigitale.com/en/browse/manuscript-b-in-the-Institut-de-France/0074-v/

## Próximos passos

1. Remodelar a estrutura com base em folios específicos e reconstruções confiáveis, documentando correspondências.
2. Criar cinemática acoplada de pedal → cabo/roldana → asa com parametrização geométrica.
3. Incluir torção da asa, vista explodida, cortes e legendas de peças.
4. Desenvolver módulo aerodinâmico com hipóteses declaradas e validação física.
5. Adicionar testes de interação, acessibilidade e otimização para celulares.
