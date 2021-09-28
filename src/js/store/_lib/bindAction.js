module.exports = (actions, dispatch) => {
  const bounded = {};
  Object.keys(actions).forEach((key) => {
    const action = actions[key];
    bounded[key] = function (params) {
      dispatch(action(params));
      // const args = Array.prototype.slice.call(arguments)
      // dispatch(action.apply(null, args))
    };
  });
  return bounded;
};
