import StoryModel from '../models/storyModel';

const HomePresenter = {
  async getStories() {
    try {
      const stories = await StoryModel.fetchStories();
      return stories;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
};

export default HomePresenter;
