# Arquitetura Modular - Scripts JavaScript

## 📁 Estrutura de Arquivos

O arquivo `script.js` original (>1000 linhas) foi dividido em módulos temáticos:

### 📄 Arquivos Criados

1. **utils.js** (Utilitários)
   - `calcularValorLocacao()` - Calcula valor da locação baseado nas datas
   - `getVal()` - Helper para obter valores de inputs
   - Variável global `currentUserRole` - Armazena o papel do usuário

2. **dashboard.js** (Dashboard)
   - `loadDashboardData()` - Carrega KPIs e dados do dashboard
   - `renderDashboardCharts()` - Renderiza gráficos com Chart.js
   - Variável global `graficoFrota` - Referência ao gráfico

3. **tables.js** (Tabelas e Renderização)
   - `renderContratosView()` - Renderiza view de contratos
   - `renderDataView()` - Renderiza views genéricas (clientes, funcionários, carros)
   - `fetchDataAndRenderTable()` - Busca dados e popula tabelas
   - `getTableHeader()` - Gera cabeçalho da tabela por entidade
   - `getTableRows()` - Gera linhas da tabela com lógica de cores (semáforo)

4. **forms.js** (Formulários)
   - `showForm()` - Exibe modal de formulário (create/edit/view)
   - `hideForm()` - Oculta modal
   - `loadClienteForm()` - Carrega dados de cliente
   - `loadFuncionarioForm()` - Carrega dados de funcionário
   - `loadCarroForm()` - Carrega dados de carro
   - `loadContratoFormData()` - Carrega dados iniciais de contrato

5. **crud.js** (Operações CRUD)
   - `handleConcluirContrato()` - Conclui um contrato
   - `handleCarroSubmit()` - Submit do formulário de carro
   - `handleClienteSubmit()` - Submit do formulário de cliente
   - `handleFuncionarioSubmit()` - Submit do formulário de funcionário
   - `handleContratoSubmit()` - Submit do formulário de contrato
   - `confirmDelete()` - Confirmação e exclusão de entidade

6. **menu.js** (Menu e Navegação)
   - `setupDynamicMenu()` - Configura menu baseado no papel do usuário
   - `changeView()` - Muda a view (aba) ativa
   - `logout()` - Realiza logout do sistema

7. **main.js** (Inicialização Principal)
   - `DOMContentLoaded` - Event listener que inicializa tudo
   - Carrega todos os módulos em ordem

## 🔄 Ordem de Carregamento

No `index.html`, os scripts são carregados na seguinte ordem:

```html
<script src="utils.js"></script>       <!-- 1. Utilitários e variáveis globais -->
<script src="dashboard.js"></script>   <!-- 2. Dashboard (usa utils) -->
<script src="tables.js"></script>      <!-- 3. Tabelas (usa dashboard e utils) -->
<script src="forms.js"></script>       <!-- 4. Formulários -->
<script src="crud.js"></script>        <!-- 5. CRUD (usa forms e tables) -->
<script src="menu.js"></script>        <!-- 6. Menu (usa tablecom e crud) -->
<script src="main.js"></script>        <!-- 7. Inicialização (usa todos) -->
```

## 📊 Dependências

```
main.js
  └─ Depende de: menu.js, forms.js, crud.js, tables.js, dashboard.js, utils.js
     
menu.js
  ├─ Usa: currentUserRole (utils.js)
  ├─ Usa: changeView (depende de outras funções)
  └─ Usa: loadDashboardData (dashboard.js)

tables.js
  ├─ Usa: currentUserRole (utils.js)
  └─ Usa: getVal (utils.js)

forms.js
  └─ Usa: getVal (utils.js)

crud.js
  ├─ Usa: getVal (utils.js)
  ├─ Usa: changeView (menu.js)
  ├─ Usa: hideForm (forms.js)
  └─ Usa: loadDashboardData (dashboard.js)

dashboard.js
  └─ Usa: currentUserRole (utils.js)
```

## ✅ Funcionalidades Mantidas

- ✅ Dashboard com KPIs e gráficos
- ✅ Renderização de tabelas dinâmicas
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Formulários modais
- ✅ Menu dinâmico por papel de usuário
- ✅ Busca e filtros
- ✅ Lógica de semáforo para contratos
- ✅ Cálculo de valor de locação

## 🚀 Como Adicionar Novas Funcionalidades

Se precisar adicionar novas funções:

1. **Para utilitários**: Adicione em `utils.js`
2. **Para dashboard**: Adicione em `dashboard.js`
3. **Para renderização**: Adicione em `tables.js`
4. **Para formulários**: Adicione em `forms.js`
5. **Para operações**: Adicione em `crud.js`
6. **Para navegação**: Adicione em `menu.js`

Sempre mantenha a lógica separada por responsabilidade!

## 📝 Notas

- Variáveis globais (`currentUserRole`, `graficoFrota`) estão em seus respectivos módulos
- Todas as funções `window.*` continuam acessíveis globalmente
- Não há conflitos de escopo
- Total de linhas distribuído entre 7 arquivos organizados
