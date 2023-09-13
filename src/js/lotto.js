const LottoValidator = require('../utils/validate.js')
const { LOTTO_PRICE, PRIZES } = require('./utils/constants.js')
const LottoNumbers = require('./LottoNumbers.js')
const View = require('./view/LottoView.js')

const Lotto = {
    lottos: [],
    prize: PRIZES,
    numLottos: 0,
    profitPercentage: 0,

    getLottoPurchaseAmount(amount) {
        this.amount = LottoValidator.amountValidate(amount)
        this.buyLotto(this.amount);
    },

    buyLotto(purchaseAmount) {
        this.numLottos = Math.floor(purchaseAmount / LOTTO_PRICE);
        this.lottos = LottoNumbers.getNumbers(this.numLottos);
    },

    checkMatch(numMatches, result, lottoNumbers, bonusNumber) {
        switch (numMatches) {
            case 3:
                return result.rank === 5;
            case 4:
                return result.rank === 4;
            case 5:
                return (result.rank === 3 && lottoNumbers.includes(bonusNumber)) || result.rank === 2;
            case 6:
                return result.rank === 1;
            default:
                return false;
        }
    },

    matchedRank(winningNumbers, bonusNumber) {
        this.lottos.forEach(lottoNumbers => {
            const matchedNumbers = lottoNumbers.filter(num => winningNumbers.includes(num));
            const matchedRank = this.prize.find(result => this.checkMatch(matchedNumbers.length, result, lottoNumbers, bonusNumber));
            if (matchedRank) {
                matchedRank.count++;
            }
        });
        View.calculatePrizes(this.lottos, this.prize);
    },
    clearLotto() {
        this.lottos = [];
        this.prize = PRIZES;
        this.numLottos = 0;
        this.profitPercentage = 0;
    }
}
module.exports = Lotto;
