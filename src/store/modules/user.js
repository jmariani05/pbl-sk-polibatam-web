const user = {
  state: {
    isLoading: false,
    optionsTable: {
      page: 1,
      itemsPerPage: 10,
      search: "",
    },
  },
  mutations: {
    SET_OPTIONS_TABLE_USER(state, payload) {
      state.optionsTable = Object.assign({}, payload);
    },
  },
};

export default user;
