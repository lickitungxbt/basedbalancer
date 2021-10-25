<script setup lang="ts">
import { computed, toRefs } from 'vue';
import useNumbers from '@/composables/useNumbers';
import { InvestMath } from '../composables/useInvestFormMath';
import useWeb3 from '@/services/web3/useWeb3';

/**
 * TYPES
 */
type Props = {
  investMath: InvestMath;
};

/**
 * Props
 */
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'maximize'): void;
  (e: 'optimize'): void;
}>();

/**
 * COMPOSABLES
 */
const { fNum } = useNumbers();
const { isWalletReady } = useWeb3();

const {
  fiatTotal,
  hasNoBalances,
  priceImpact,
  highPriceImpact,
  maximized,
  optimized
} = toRefs(props.investMath);

/**
 * COMPUTED
 */
const priceImpactClasses = computed(() => ({
  'bg-red-500 text-white divide-red-400': highPriceImpact.value
}));

const optimizeBtnClasses = computed(() => ({
  'text-gradient': !highPriceImpact.value,
  'text-red-500 px-2 py-1 bg-white rounded-lg': highPriceImpact.value
}));
</script>

<template>
  <div class="data-table">
    <div class="data-table-row total-row">
      <div class="p-2">{{ $t('total') }}</div>
      <div class="data-table-number-col">
        {{ fNum(fiatTotal, 'usd') }}
        <div v-if="isWalletReady && !hasNoBalances" class="text-sm">
          <span v-if="maximized" class="text-gray-400 dark:text-gray-600">
            {{ $t('maxed') }}
          </span>
          <span
            v-else
            class="text-blue-500 cursor-pointer"
            @click="emit('maximize')"
          >
            {{ $t('max') }}
          </span>
        </div>
      </div>
    </div>
    <div :class="['data-table-row price-impact-row', priceImpactClasses]">
      <div class="p-2">{{ $t('priceImpact') }}</div>
      <div class="data-table-number-col">
        <div>
          {{ fNum(priceImpact, 'percent') }}

          <BalTooltip :text="$t('customAmountsTip')">
            <template v-slot:activator>
              <BalIcon
                v-if="highPriceImpact"
                name="alert-triangle"
                size="xs"
                class="-mb-px ml-1"
              />
              <BalIcon
                v-else
                name="info"
                size="xs"
                class="text-gray-400 -mb-px ml-1"
              />
            </template>
          </BalTooltip>
        </div>

        <div
          v-if="isWalletReady && !hasNoBalances"
          class="text-sm font-semibold"
        >
          <span v-if="optimized" class="text-gray-400 dark:text-gray-600">
            {{ $t('optimized') }}
          </span>
          <div
            v-else
            :class="['cursor-pointer', optimizeBtnClasses]"
            @click="emit('optimize')"
          >
            {{ $t('optimize') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.data-table {
  @apply border dark:border-gray-700 rounded-lg divide-y dark:divide-gray-700;
}

.data-table-row {
  @apply grid grid-cols-4 divide-x dark:divide-gray-700;
}

.data-table-number-col {
  @apply col-span-3 p-2 flex items-center justify-between;
}

.total-row {
  @apply text-lg font-bold;
}

.price-impact-row {
  @apply text-sm rounded-b-lg;
}
</style>