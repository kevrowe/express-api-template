const path = {
  build: {
    api: (path: string) => {
      if (path.startsWith("/")) {
        return `/api/${path.slice(1)}`;
      }
      return `/api/${path}`;
    },
  },
};

export { path };
