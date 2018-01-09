import InfoIcon from 'react-icons/lib/md/info-outline';
import FilesIcon from 'react-icons/lib/md/create';
import GitHubIcon from 'react-icons/lib/go/mark-github';
import RocketIcon from 'react-icons/lib/go/rocket';
import SettingsIcon from 'react-icons/lib/go/settings';

export default [
  {
    id: 'info',
    name: 'Project Info',
    Icon: InfoIcon,
  },
  {
    id: 'files',
    name: 'Files',
    Icon: FilesIcon,
  },
  {
    id: 'github',
    name: 'GitHub',
    Icon: GitHubIcon,
  },
  {
    id: 'deploy',
    name: 'Deployment',
    Icon: RocketIcon,
  },
  {
    id: 'config',
    name: 'Configurations',
    Icon: SettingsIcon,
  },
];
