import { useCallback, useReducer, useRef } from "react";

type StateConfig<T> = {
  [K in keyof T]: T[K];
};

type UpdateAction<T> = {
  type: "UPDATE";
  key: keyof T;
  value: any;
};

type DeepUpdateAction = {
  type: "DEEP_UPDATE";
  path: string;
  value: any;
};

type BulkUpdateAction<T> = {
  type: "BULK_UPDATE";
  updates: Partial<T>;
};

type ResetAction<T> = {
  type: "RESET";
  newState?: Partial<T>;
};

type Action<T> =
  | UpdateAction<T>
  | BulkUpdateAction<T>
  | ResetAction<T>
  | DeepUpdateAction;

function setNestedProperty(obj: any, path: string, value: any): any {
  if (!path) return value;

  const pathParts = path.replace(/\[(\w+)\]/g, ".$1").split(".");
  const key = pathParts[0];

  if (pathParts.length === 1) {
    return {
      ...obj,
      [key]: value,
    };
  }

  const currentValue =
    obj[key] !== undefined
      ? Array.isArray(obj[key])
        ? [...obj[key]]
        : { ...obj[key] }
      : pathParts[1].match(/^\d+$/)
      ? []
      : {};

  return {
    ...obj,
    [key]: setNestedProperty(currentValue, pathParts.slice(1).join("."), value),
  };
}

function reducer<T>(state: T, action: Action<T>): T {
  switch (action.type) {
    case "UPDATE": {
      const { key, value } = action;
      const newValue =
        typeof value === "function"
          ? (value as (prev: any) => any)(state[key])
          : value;

      if (state[key] === newValue) {
        return state;
      }

      return {
        ...state,
        [key]: newValue,
      };
    }
    case "DEEP_UPDATE": {
      const { path, value } = action;
      const newValue =
        typeof value === "function"
          ? (value as (prev: any) => any)(getNestedValue(state, path))
          : value;

      if (getNestedValue(state, path) === newValue) {
        return state;
      }

      return setNestedProperty(state, path, newValue);
    }
    case "BULK_UPDATE": {
      let hasChanged = false;
      const updates = action.updates;

      for (const key in updates) {
        if (
          Object.prototype.hasOwnProperty.call(updates, key) &&
          state[key as keyof T] !== updates[key as keyof T]
        ) {
          hasChanged = true;
          break;
        }
      }

      if (!hasChanged) {
        return state;
      }

      return { ...state, ...updates };
    }
    case "RESET": {
      const initialState = state;
      if (action.newState) {
        return { ...initialState, ...action.newState };
      }
      return { ...initialState };
    }
    default:
      return state;
  }
}

function getNestedValue(obj: any, path: string): any {
  if (!path) return obj;

  const pathParts = path.replace(/\[(\w+)\]/g, ".$1").split(".");
  let current = obj;

  for (const part of pathParts) {
    if (current === null || current === undefined) return undefined;
    current = current[part];
  }

  return current;
}

export function useManager<T extends Record<string, any>>(
  initialState: StateConfig<T>
) {
  const initialStateRef = useRef(initialState);

  const [state, dispatch] = useReducer(reducer<T>, initialState);

  const updateState = useCallback(
    <K extends keyof T>(key: K, value: T[K] | ((prevValue: T[K]) => T[K])) => {
      dispatch({
        type: "UPDATE",
        key,
        value,
      } as UpdateAction<T>);
    },
    []
  );

  const deepUpdateState = useCallback(
    (path: string, value: any | ((prevValue: any) => any)) => {
      dispatch({
        type: "DEEP_UPDATE",
        path,
        value,
      } as DeepUpdateAction);
    },
    []
  );

  const resetState = useCallback((newState?: Partial<T>) => {
    dispatch({
      type: "RESET",
      newState,
    });
  }, []);

  const bulkUpdate = useCallback((updates: Partial<T>) => {
    dispatch({
      type: "BULK_UPDATE",
      updates,
    });
  }, []);

  const getState = useCallback(() => state, [state]);

  return {
    state,
    updateState,
    deepUpdateState,
    resetState,
    bulkUpdate,
    getState,
  };
}
