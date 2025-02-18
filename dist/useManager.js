var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useCallback, useReducer, useRef } from "react";
function setNestedProperty(obj, path, value) {
    var _a, _b;
    if (!path)
        return value;
    var pathParts = path.replace(/\[(\w+)\]/g, ".$1").split(".");
    var key = pathParts[0];
    if (pathParts.length === 1) {
        return __assign(__assign({}, obj), (_a = {}, _a[key] = value, _a));
    }
    var currentValue = obj[key] !== undefined
        ? Array.isArray(obj[key])
            ? __spreadArray([], obj[key], true) : __assign({}, obj[key])
        : pathParts[1].match(/^\d+$/)
            ? []
            : {};
    return __assign(__assign({}, obj), (_b = {}, _b[key] = setNestedProperty(currentValue, pathParts.slice(1).join("."), value), _b));
}
function reducer(state, action) {
    var _a;
    switch (action.type) {
        case "UPDATE": {
            var key = action.key, value = action.value;
            var newValue = typeof value === "function"
                ? value(state[key])
                : value;
            if (state[key] === newValue) {
                return state;
            }
            return __assign(__assign({}, state), (_a = {}, _a[key] = newValue, _a));
        }
        case "DEEP_UPDATE": {
            var path = action.path, value = action.value;
            var newValue = typeof value === "function"
                ? value(getNestedValue(state, path))
                : value;
            if (getNestedValue(state, path) === newValue) {
                return state;
            }
            return setNestedProperty(state, path, newValue);
        }
        case "BULK_UPDATE": {
            var hasChanged = false;
            var updates = action.updates;
            for (var key in updates) {
                if (Object.prototype.hasOwnProperty.call(updates, key) &&
                    state[key] !== updates[key]) {
                    hasChanged = true;
                    break;
                }
            }
            if (!hasChanged) {
                return state;
            }
            return __assign(__assign({}, state), updates);
        }
        case "RESET": {
            var initialState = state;
            if (action.newState) {
                return __assign(__assign({}, initialState), action.newState);
            }
            return __assign({}, initialState);
        }
        default:
            return state;
    }
}
function getNestedValue(obj, path) {
    if (!path)
        return obj;
    var pathParts = path.replace(/\[(\w+)\]/g, ".$1").split(".");
    var current = obj;
    for (var _i = 0, pathParts_1 = pathParts; _i < pathParts_1.length; _i++) {
        var part = pathParts_1[_i];
        if (current === null || current === undefined)
            return undefined;
        current = current[part];
    }
    return current;
}
export function useManager(initialState) {
    var initialStateRef = useRef(initialState);
    var _a = useReducer((reducer), initialState), state = _a[0], dispatch = _a[1];
    var updateState = useCallback(function (key, value) {
        dispatch({
            type: "UPDATE",
            key: key,
            value: value,
        });
    }, []);
    var deepUpdateState = useCallback(function (path, value) {
        dispatch({
            type: "DEEP_UPDATE",
            path: path,
            value: value,
        });
    }, []);
    var resetState = useCallback(function (newState) {
        dispatch({
            type: "RESET",
            newState: newState,
        });
    }, []);
    var bulkUpdate = useCallback(function (updates) {
        dispatch({
            type: "BULK_UPDATE",
            updates: updates,
        });
    }, []);
    var getState = useCallback(function () { return state; }, [state]);
    return {
        state: state,
        updateState: updateState,
        deepUpdateState: deepUpdateState,
        resetState: resetState,
        bulkUpdate: bulkUpdate,
        getState: getState,
    };
}
//# sourceMappingURL=useManager.js.map