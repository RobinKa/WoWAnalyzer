import React from 'react';

import SPELLS from 'common/SPELLS';

import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events, { ApplyBuffEvent, HealEvent } from 'parser/core/Events';
import { Options } from 'parser/core/Module';

import Statistic from 'interface/statistics/Statistic';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import STATISTIC_CATEGORY from 'interface/others/STATISTIC_CATEGORY';
import ConduitSpellText from 'interface/statistics/components/ConduitSpellText';
import ItemHealingDone from 'interface/ItemHealingDone';
import { RESONANT_WORDS_RANKS } from 'parser/priest/holy/constants';

class ResonantWords extends Analyzer {
  totalResonantWords = 0;
  wastedResonantWords = 0;
  bonusHealing = 0;
  healingMultiplier = RESONANT_WORDS_RANKS[0];

  conduitRank: number = 0;
  conduitIncrease: number = 0;
  bonusRadianceHealing: number = 0;

  constructor(options: Options) {
    super(options);

    this.conduitRank = this.selectedCombatant.conduitRankBySpellID(SPELLS.RESONANT_WORDS.id);
    if (!this.conduitRank) {
      this.active = false;
      return;
    }
    this.healingMultiplier = RESONANT_WORDS_RANKS[this.conduitRank];

    this.addEventListener(Events.applybuff.by(SELECTED_PLAYER).spell(SPELLS.RESONANT_WORDS_BUFF), this.onResonantWordsApply);

    this.addEventListener(Events.heal.by(SELECTED_PLAYER).spell(SPELLS.FLASH_HEAL), this.onFlashHeal);

    this.addEventListener(Events.cast.by(SELECTED_PLAYER).spell(SPELLS.HOLY_WORD_CHASTISE), this.onHolyWordCast);
    this.addEventListener(Events.cast.by(SELECTED_PLAYER).spell(SPELLS.HOLY_WORD_SANCTIFY), this.onHolyWordCast);
    this.addEventListener(Events.cast.by(SELECTED_PLAYER).spell(SPELLS.HOLY_WORD_SERENITY), this.onHolyWordCast);
    this.addEventListener(Events.cast.by(SELECTED_PLAYER).spell(SPELLS.HOLY_WORD_SALVATION_TALENT), this.onHolyWordCast);
  }

  onResonantWordsApply(event: ApplyBuffEvent) {
    this.totalResonantWords += 1;
  }

  onFlashHeal(event: HealEvent) {
    if (this.selectedCombatant.hasBuff(SPELLS.RESONANT_WORDS_BUFF.id)) {
      const eventBonusAmount = event.amount / (1 + (this.healingMultiplier / 100));
      this.bonusHealing += eventBonusAmount;
    }
  }

  onHolyWordCast() {
    if (this.selectedCombatant.hasBuff(SPELLS.RESONANT_WORDS_BUFF.id)) {
      this.wastedResonantWords += 1;
    }
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.OPTIONAL(13)}
        size="flexible"
        category={STATISTIC_CATEGORY.COVENANTS}
        tooltip={`${this.wastedResonantWords}/${this.totalResonantWords} wasted resonant word buffs.`}
      >
        <ConduitSpellText spell={SPELLS.RESONANT_WORDS} rank={this.conduitRank}>
          <ItemHealingDone amount={this.bonusHealing} />
        </ConduitSpellText>
      </Statistic>
    );
  }

}

export default ResonantWords;
