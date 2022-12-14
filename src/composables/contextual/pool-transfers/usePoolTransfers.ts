import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

// Composables
import usePoolQuery from '@/composables/queries/usePoolQuery';
import { isStablePhantom } from '@/composables/usePool';
import useTokens from '@/composables/useTokens';
import { includesAddress } from '@/lib/utils';
import { Pool } from '@/services/pool/types';

/**
 * STATE
 */
const useNativeAsset = ref(false);
const transfersAllowed = ref(true);

export default function usePoolTransfers() {
  const route = useRoute();
  const id = ref<string>(route.params.id as string);

  /**
   * COMPOSABLES
   */
  const { prices } = useTokens();

  /**
   * QUERIES
   */
  const poolQuery = usePoolQuery(id.value);

  /**
   * COMPUTED
   */
  const pool = computed((): Pool | undefined => {
    return poolQuery.data.value;
  });

  const poolQueryLoading = computed(
    (): boolean =>
      (poolQuery.isLoading.value as boolean) ||
      (poolQuery.isIdle.value as boolean) ||
      (poolQuery.error.value as boolean)
  );

  const loadingPool = computed(
    (): boolean => poolQueryLoading.value || !pool.value
  );

  const tokenAddresses = computed(() => {
    if (pool.value) {
      if (isStablePhantom(pool.value.poolType)) {
        return pool.value.mainTokens || [];
      }
      return pool.value?.tokensList || [];
    }
    return [];
  });

  const missingPrices = computed(() => {
    const tokensWithPrice = Object.keys(prices.value).map(t => t.toLowerCase());
    return !tokenAddresses.value.every(token =>
      includesAddress(tokensWithPrice, token)
    );
  });

  return {
    pool,
    loadingPool,
    useNativeAsset,
    missingPrices,
    transfersAllowed,
  };
}
