import history from '../../utils/history';

export default new (class RouterEffect {
  redirectToDashboard() {
    history.replace('/dashboard/home');
  }

  clearWorkspaceId(): void {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('workspace');
    history.replace({ search: searchParams.toString() });
  }
})();
