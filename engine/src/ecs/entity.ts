import { OrNull } from "../common";
import type { Component } from "./types";

export class Entity {
  components: Set<Component>;
  name: string;

  constructor(name: string, initialComponents: Component[]) {
    this.components = new Set<Component>(initialComponents);
    this.name = name;
  }

  addComponent = (component: Component) => {
    this.components.add(component);
  };

  checkIfEntityContainsAllComponents = (componentSymbols: symbol[]) => {
    let allSymbolsMatch = true;

    for (const symbol of componentSymbols) {
      let symbolMatched = false;

      for (const component of this.components) {
        if (component.name === symbol) {
          symbolMatched = true;
          break;
        }
      }

      if (!symbolMatched) {
        allSymbolsMatch = false;
        break;
      }
    }

    if (allSymbolsMatch) {
      return true;
    }

    return false;
  };

  getComponent = <T extends Component>(componentName: symbol): OrNull<T> => {
    for (const component of this.components) {
      if (component.name === componentName) {
        return component as T;
      }
    }

    return null;
  };

  getComponents = <T extends Component>(componentNames: symbol[]): OrNull<T>[] => {
    return componentNames.map(this.getComponent<T>);
  };

  removeComponent = (component: Component) => {
    this.components.delete(component);
  };
}

export const filterEntitiesByComponents = (
  entities: Set<Entity>,
  componentSymbols: symbol[]
): Entity[] => {
  
  // TODO: performance - cache these look ups if possible

  const result: Entity[] = [];

  for (const entity of entities) {
    if (entity.checkIfEntityContainsAllComponents(componentSymbols)) {
      result.push(entity);
    }
  }

  return result;
};

export const getComponentsFromEntities = <T extends Component>(
  name: symbol,
  entites: Entity[]
): OrNull<T>[] => {
  const components = entites.map((entity) => entity.getComponent<T>(name));

  return components;
};
