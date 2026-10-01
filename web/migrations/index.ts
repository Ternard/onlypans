import * as migration_20261001_125925_initial from './20261001_125925_initial';
import * as migration_20261001_130000_seed_menu_services from './20261001_130000_seed_menu_services';

export const migrations = [
  {
    up: migration_20261001_125925_initial.up,
    down: migration_20261001_125925_initial.down,
    name: '20261001_125925_initial'
  },
  {
    up: migration_20261001_130000_seed_menu_services.up,
    down: migration_20261001_130000_seed_menu_services.down,
    name: '20261001_130000_seed_menu_services'
  },
];
