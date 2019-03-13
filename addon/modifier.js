import Ember from 'ember';

const createHandler = (element, action) => (e) => {
  let path = e.path || (e.composedPath && e.composedPath());

  if (path) {
    path.includes(element) || action(e);
  }
};

export default Ember._setModifierManager(
  () => ({
    createModifier(factory, args) {
      return {
        element: null,
        eventHandler: null,
        action: null
      };
    },

    installModifier(state, element, args) {
      let [action] = args.positional;

      if (action) {
        state.action = action;
        state.element = element;
        state.eventHandler = createHandler(element, action);

        document.addEventListener('click', state.eventHandler);
      }
    },

    updateModifier(state, args) {
      let [action] = args.positional;

      if (state.action) {
        document.removeEventListener('click', state.eventHandler);
      }

      if (action) {
        state.action = action;
        state.eventHandler = createHandler(state.element, action);
        document.addEventListener('click', state.eventHandler);
      }
    },

    destroyModifier(state, element) {
      if (state.action) {
        document.removeEventListener('click', state.eventHandler);
      }
    }
  }),
  class ClickOutsideModifier {}
);
