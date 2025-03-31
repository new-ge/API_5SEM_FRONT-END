# API_5SEM_FRONT-END

## 📌 Definição dos Indicadores e seus Respectivos Gráficos

Para a criação do dashboard, os indicadores e os respectivos gráficos a serem considerados são:

### 📊 Quantidade de Cards por Etiqueta
- **Gráfico sugerido:** Barras horizontais
  - Permite comparar o número de cards por etiqueta de forma clara.
  - **Operador:** Visualiza apenas seus próprios cards.
  - **Gestor:** Visualiza os cards da equipe.
  - **Admin:** Visualiza os cards de todos.

### 📈 Quantidade de Cards Criados por Período
- **Gráfico sugerido:** Linhas ou barras verticais
  - Demonstra a evolução ao longo do tempo.
  - **Operador:** Visualiza apenas os cards que criou.
  - **Gestor:** Visualiza os cards da equipe.
  - **Admin:** Visão total de todos os times.

### 📊 Quantidade de Cards Finalizados por Período
- **Gráfico sugerido:** Linhas ou barras empilhadas
  - É possível incluir uma comparação entre "Planejado X Realizado". Dessa forma, para ver categorias separadas, barras empilhadas são mais indicadas.
  - **Operador:** Visualiza o "Planejado X Realizado" apenas sobre seus cards.
  - **Gestor:** Visualiza o "Planejado X Realizado" da equipe.
  - **Admin:** Visualiza o "Planejado X Realizado" de todos os times.

### 📊 Quantidade de Cards por Status (Coluna do Kanban)
- **Gráfico sugerido:** Barras verticais empilhadas
  - Mostra quantos cards estão em cada status (To Do, In Progress, Done).
  - **Operador:** Visualiza os próprios cards.
  - **Gestor:** Visualiza os cards da equipe.
  - **Admin:** Visualiza todos os cards de acordo com o status.

### ⏳ Tempo Médio de Execução do Card
- **Gráfico sugerido:** Barras horizontais
  - Para comparar tempos médios de execução.
  - **Operador:** Visualiza o tempo médio de execução das próprias tarefas.
  - **Gestor:** Visualiza o tempo médio de execução das tarefas da equipe.
  - **Admin:** Visualiza o tempo médio de execução de todas as tarefas.

### 👥 Cards por Colaborador
- **Gráfico sugerido:** Barras horizontais
  - Comparação direta da carga de trabalho entre os colaboradores.
  - **Operador:** Visualiza seus próprios cards.
  - **Gestor:** Visualiza os cards da equipe.
  - **Admin:** Visualiza os cards de todos os colaboradores.

### 🔄 Retrabalhos
#### Sugestão 1: Gráfico de Pizza
- Demonstra a porcentagem de retrabalhos em relação ao total de entregas.

#### Sugestão 2: Barras Empilhadas (Histórico)
- É possível visualizar a quantidade de retrabalho ao longo do tempo.

- Para as duas sugestões, as visões por níveis são:
- **Operador:** Visualiza os cards que ele finalizou e retornaram.
- **Gestor:** Visualiza os cards finalizados e que retornaram da equipe.
- **Admin:** Visualiza todos os cards finalizados e que retornaram.

