import callApi from '../services/api';

export const REQUEST_USER = 'REQUEST_USER';
export const REQUEST_USER_SUCCESS = 'REQUEST_USER_SUCCESS';

export default {
  getUser: () => async (dispatch) => {
    try {
      dispatch({ type: REQUEST_USER });
      const result = await callApi('users/current');
      dispatch({ type: REQUEST_USER_SUCCESS, data: result.data });
    } catch (e) {
      console.error(e);
      // Don't do anything with not logged in users
    }
  },
};
