const resolvers = {
  Settings: {
    __resolveType(settings) {
      if (settings._id === 'site') {
        return 'SiteSettings';
      } else if (settings._id === 'social') {
        return 'SocialSettings';
      }
      return null;
    },
  },
  SiteSettings: {
    id(settings) {
      return settings._id;
    },
  },
  SocialSettings: {
    id(settings) {
      return settings._id;
    },
  },
  Query: {
    settings(root, { id }, { Settings }) {
      return Settings.findOneById(id);
    },
  },
  Mutation: {
    async updateSiteSettings(root, { id, input }, { Settings }) {
      await Settings.updateById(id, input);
      return Settings.findOneById(id);
    },
    async updateSocialSettings(root, { id, input }, { Settings }) {
      await Settings.updateById(id, input);
      return Settings.findOneById(id);
    },
  },
};

export default resolvers;
