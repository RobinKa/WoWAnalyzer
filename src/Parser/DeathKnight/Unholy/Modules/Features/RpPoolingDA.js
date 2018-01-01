import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';
import RESOURCE_TYPES from 'common/RESOURCE_TYPES';
import Wrapper from 'common/Wrapper';

import Analyzer from 'Parser/Core/Analyzer';
import Combatants from 'Parser/Core/Modules/Combatants';
import StatisticBox, { STATISTIC_ORDER } from 'Main/StatisticBox';


class RpPoolingDA extends Analyzer {
  static dependencies = {
    combatants: Combatants,
  };
  on_initialized() {
    this.active = this.combatants.selected.hasTalent(SPELLS.DARK_ARBITER_TALENT.id);
  }
  // used to track how many stacks a target has
  targets = {};

  totalRunicPowerPooled = 0;
  totalDarkArbiterCasts = 0;
  averageRpPooled = 0;
  currentRP = 0;
  maxRP = 0;
  
  
  on_toPlayer_energize(event) {
    const runicPowerResource = event.classResources.find(resource => resource.type === RESOURCE_TYPES.RUNIC_POWER);
    if (runicPowerResource) {
      this.currentRP = (runicPowerResource.amount || 0)/10;
      this.maxRP = (runicPowerResource.max || 0)/10;
    }
  }
  
   on_byPlayer_cast(event) {
    const runicPowerResource = event.classResources.find(resource => resource.type === RESOURCE_TYPES.RUNIC_POWER);
    if (runicPowerResource) {
      this.currentRP = (runicPowerResource.amount || 0)/10;
      this.maxRP = (runicPowerResource.max || 0)/10;
    }
  }
   
  on_byPlayer_cast(event){
    const spellId = event.ability.guid;
    if(spellId === SPELLS.DARK_ARBITER_TALENT.id){
		this.totalDarkArbiterCasts++;
		this.totalRunicPowerPooled += this.currentRP;
		this.averageRpPooled = (this.totalRunicPowerPooled / this.totalDarkArbiterCasts).toFixed(0);
		}
	}
	
   get suggestionThresholds() {
    return {
      actual: (this.totalRunicPowerPooled/this.totalDarkArbiterCasts).toFixed(1),
      isLessThan: {
        minor: (this.maxRP-20),
        average: (this.maxRP-30),
        major: (this.maxRP-40),
      },
      style: 'number',
      suffix: 'Runic Power',
    };
  }

  suggestions(when) {
    when(this.suggestionThresholds.actual).isLessThan(this.suggestionThresholds.isLessThan.minor)
 		  .addSuggestion((suggest, actual, recommended) => {
			return suggest(<Wrapper> You are casting <SpellLink id={SPELLS.DARK_ARBITER_TALENT.id}/> without enough runic power. Make sure to pool some runic power before you cast <SpellLink id={SPELLS.DARK_ARBITER_TALENT.id}/>.</Wrapper>)
				.icon(SPELLS.DARK_ARBITER_TALENT.icon)
				.actual(`${this.averageRpPooled} of runic power were pooled on average`)
				.recommended(`>${(recommended)} is recommended`)
				.regular(recommended - 20).major(recommended - 40);
        });
  }

  statistic() {
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.DARK_ARBITER_TALENT.id} />}
        value={`${this.averageRpPooled}/${this.maxRP}`}
        label={'Average Runic Power Pooled before Dark Arbiter'}
		tooltip={`A total amount of ${this.totalRunicPowerPooled} runic power was pooled for ${this.totalDarkArbiterCasts} casts of Dark Arbiter`}
      />
    );
  }

  statisticOrder = STATISTIC_ORDER.CORE(6);
}

export default RpPoolingDA;
