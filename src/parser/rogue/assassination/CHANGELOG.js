import React from 'react';

import { Tyndi, Zeboot } from 'CONTRIBUTORS';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { change, date } from 'common/changelog';

export default [
  change(date(2020, 10, 25), 'Update Invigorating Shadowdust module', Tyndi),
  change(date(2020, 10, 20), <>Added <SpellLink id={SPELLS.INVIGORATING_SHADOWDUST.id} /> Legendary</>, [Tyndi]),
  change(date(2020, 10, 19), <>Added <SpellLink id={SPELLS.ESSENCE_OF_BLOODFANG.id} /> Legendary</>, [Tyndi]),
  change(date(2020, 10, 18), 'Converted legacy listeners to new event filters', Zeboot),
  change(date(2020, 10, 16), <>Added <SpellLink id={SPELLS.DUSKWALKERS_PATCH.id} /> Legendary</>, [Tyndi]),
  change(date(2020, 10, 2), <>Added <SpellLink id={SPELLS.DASHING_SCOUNDREL.id} /> Legendary</>, [Tyndi]),
  change(date(2020, 9, 29), 'Updated for Shadowlands', [Tyndi]),
];
