# use-manager

Um hook React simples e eficiente para gerenciar múltiplos estados em um único lugar, reduzindo a repetição de código e melhorando a organização.

## Instalação

```bash
npm install use-manager
# ou
yarn add use-manager
# ou
pnpm add use-manager
```

## Características

- Gerencia múltiplos estados em um único hook
- Função de atualização individual para cada estado
- Atualização em massa de múltiplos estados
- Função de reset para restaurar estados ao valor inicial
- Tipagem TypeScript completa
- Zero dependências externas
- Compatível com React 16.8+ (hooks)

## Uso Básico

```tsx
import { useManager } from "use-manager";

function MyComponent() {
  const initialState = {
    count: 0,
    name: "",
    isLoading: false,
    items: [],
  };

  const { state, updateState, resetState, bulkUpdate } =
    useManager(initialState);

  console.log(state.count);

  updateState("count", state.count + 1);

  updateState("count", (prevCount) => prevCount + 1);

  bulkUpdate({
    count: 10,
    name: "John",
    isLoading: true,
  });

  resetState();

  resetState({ count: 5 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <input
        value={state.name}
        onChange={(e) => updateState("name", e.target.value)}
      />
      <button onClick={() => updateState("count", state.count + 1)}>
        Increment
      </button>
      <button onClick={resetState}>Reset</button>
    </div>
  );
}
```

## API

### `useManager<T>(initialState: T)`

#### Parâmetros

- `initialState`: Um objeto contendo os estados iniciais

#### Retorno

Um objeto com as seguintes propriedades:

- `state`: O objeto de estado atual
- `updateState(key, value)`: Função para atualizar um único estado
  - `key`: A chave do estado a ser atualizado
  - `value`: O novo valor ou função que recebe o valor anterior e retorna o novo
- `resetState(newState?)`: Função para resetar todos os estados ao valor inicial
  - `newState?`: (Opcional) Um objeto parcial para substituir alguns valores iniciais
- `bulkUpdate(updates)`: Função para atualizar múltiplos estados de uma vez
  - `updates`: Um objeto parcial contendo as chaves/valores a serem atualizados
- `getState()`: Função para obter o estado atual (útil em callbacks assíncronos)

## Exemplo Prático

Veja como você pode simplificar um componente com vários estados:

### Antes:

```tsx
function MyForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
}
```

### Depois:

```tsx
function MyForm() {
  const { state, updateState, resetState, bulkUpdate } = useManager({
    name: "",
    email: "",
    isLoading: false,
    errors: {},
    submitted: false,
  });

  const handleSubmit = async () => {
    bulkUpdate({ isLoading: true, errors: {} });

    try {
      bulkUpdate({ submitted: true, isLoading: false });
    } catch (error) {
      bulkUpdate({
        errors: { general: error.message },
        isLoading: false,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={state.name}
        onChange={(e) => updateState("name", e.target.value)}
      />
    </form>
  );
}
```

## Dicas de Uso

1. **Organize por contexto**: Crie hooks customizados para diferentes partes do seu aplicativo
2. **Use TypeScript**: Garanta tipagem forte para evitar erros de tempo de execução
3. **Evite mutações diretas**: Sempre use `updateState` ou `bulkUpdate` para garantir rerenderizações apropriadas
4. **Divida estados complexos**: Para aplicações maiores, considere usar múltiplos `useManager` para diferentes partes da UI

## Licença

MIT
