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
- Atualização profunda (deep update) para estados aninhados
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
    user: {
      profile: {
        name: "John",
        preferences: {
          theme: "light",
        },
      },
      friends: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
    },
  };

  const { state, updateState, deepUpdateState, resetState, bulkUpdate } =
    useManager(initialState);

  console.log(state.count);

  updateState("count", state.count + 1);
  updateState("count", (prevCount) => prevCount + 1);

  deepUpdateState("user.profile.preferences.theme", "dark");
  deepUpdateState("user.friends[1].name", "Robert");
  deepUpdateState("user.friends[0].visits", (prev = 0) => prev + 1);

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
      <p>Theme: {state.user.profile.preferences.theme}</p>
      <input
        value={state.name}
        onChange={(e) => updateState("name", e.target.value)}
      />
      <button onClick={() => updateState("count", state.count + 1)}>
        Increment
      </button>
      <button
        onClick={() =>
          deepUpdateState(
            "user.profile.preferences.theme",
            state.user.profile.preferences.theme === "light" ? "dark" : "light"
          )
        }
      >
        Toggle Theme
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
- `deepUpdateState(path, value)`: Função para atualizar estados aninhados
  - `path`: Caminho usando notação de ponto ou colchetes (ex: "user.address.street" ou "users[0].name")
  - `value`: O novo valor ou função que recebe o valor anterior e retorna o novo
- `resetState(newState?)`: Função para resetar todos os estados ao valor inicial
  - `newState?`: (Opcional) Um objeto parcial para substituir alguns valores iniciais
- `bulkUpdate(updates)`: Função para atualizar múltiplos estados de uma vez
  - `updates`: Um objeto parcial contendo as chaves/valores a serem atualizados
- `getState()`: Função para obter o estado atual (útil em callbacks assíncronos)

## Exemplo Prático com Deep Update

Veja como você pode gerenciar estados complexos e aninhados facilmente:

```tsx
function UserProfileManager() {
  const { state, updateState, deepUpdateState, resetState } = useManager({
    user: {
      profile: {
        firstName: "João",
        lastName: "Silva",
        contact: {
          email: "joao@exemplo.com",
          phone: "123456789",
        },
      },
      settings: {
        notifications: {
          email: true,
          push: false,
        },
        privacy: {
          publicProfile: true,
        },
      },
      friends: [
        { id: 1, name: "Carlos", status: "active" },
        { id: 2, name: "Ana", status: "inactive" },
      ],
    },
    ui: {
      theme: "light",
      sidebar: {
        expanded: true,
      },
    },
  });

  const updateEmail = (newEmail) => {
    deepUpdateState("user.profile.contact.email", newEmail);
  };

  const enablePushNotifications = () => {
    deepUpdateState("user.settings.notifications.push", true);
  };

  const updateFriendStatus = (friendIndex, newStatus) => {
    deepUpdateState(`user.friends[${friendIndex}].status`, newStatus);
  };

  const toggleTheme = () => {
    deepUpdateState("ui.theme", (currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  };

  return <></>;
}
```

## Dicas de Uso

1. **Organize por contexto**: Crie hooks customizados para diferentes partes do seu aplicativo
2. **Use TypeScript**: Garanta tipagem forte para evitar erros de tempo de execução
3. **Evite mutações diretas**: Sempre use `updateState`, `deepUpdateState` ou `bulkUpdate` para garantir rerenderizações apropriadas
4. **Use deep update para estados aninhados**: Para objetos complexos, `deepUpdateState` preserva a imutabilidade em todos os níveis
5. **Divida estados complexos**: Para aplicações maiores, considere usar múltiplos `useManager` para diferentes partes da UI

## Licença

MIT
