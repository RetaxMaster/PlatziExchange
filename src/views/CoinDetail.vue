<template>
  <div class="flex-col">
      <!-- Este template forma parte de la explicación de los slots, practicamente es para que si no existe el id que no se muestre nada de html, si estuviera en un div si se mostraria solo el div -->
    <template v-if="asset.id">
      <div class="flex flex-col sm:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <img 
          :src="`https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`"
          class="w-20 h-20 mr-5"
          :alt="asset.name"
          />
          <h1 class="text-5xl">
              {{ asset.name }}
            <small class="sm:mr-2 text-gray-500">{{ asset.symbol }}</small>
          </h1>
        </div>

        <div class="my-10 flex flex-col">
          <ul>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Ranking</b>
              <span>#{{ asset.rank }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
              <span>{{ dollar(asset.priceUsd) }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
              <span>{{ dollar(min) }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
              <span>{{ dollar(max) }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
              <span>{{ dollar(avg) }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
              <span>{{ percent( asset.changePercent24Hr) }}</span>
            </li>
          </ul>
        </div>

        <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
          <button
            @click="toggleConverter"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >{{ fromUsd ? `USD a ${asset.symbol}` : `${asset.symbol} a USD` }}</button>

          <div class="flex flex-row my-5">
            <label class="w-full" for="convertValue">
              <input
                v-model="convertValue"
                id="convertValue"
                type="number"
                class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                :placeholder="`Valor en ${ fromUsd ? 'USD' : asset.symbol }`"
              />
            </label>
          </div>

          <span class="text-xl">{{ convertResult }} {{ fromUsd ? asset.symbol : "USD" }}</span>
        </div>
      </div>

      <h3 class="text-xl my-10">Mejores Ofertas de Cambio</h3>
      <table>
        <tr v-for="m in markets" :key="`${m.exchange}-${m.priceUsd}`" class="border-b">
          <td>
            <b>{{ m.exchangeId }}</b>
          </td>
          <td>{{ dollar(m.priceUsd) }}</td>
          <td>{{ m.baseSymbol }} / {{ m.quoteSymbol }}</td>
          <td>

            <px-button
            v-if="!m.url"
            @click="getWebsite(m)">
              <p v-if="m.isLoading || false">Cargando...</p>
              <slot v-else>Obtener Link</slot>
            </px-button>
            <a v-else class="hover:underline text-green-600" target="_blanck">{{ m.url }}</a>
          </td>
        </tr>
      </table>

    </template>
  </div>
</template>

<script>

import api from "@/api";
import PxButton from "@/components/PxButton";
import { dollarFilter, percentFilter } from "@/filters";

export default {


    name: "CoinDetail",

    components: {
      PxButton
    },

    data() {
        return {
            asset: {},
            history: [],
            markets: [],
            fromUsd: true,
            convertValue: null
        }
    },

    created() {
        // Llama al metodo getCoin
        this.getCoin();
    },

    methods: {

        toggleConverter() {
          this.fromUsd = !this.fromUsd;
        },

        getWebsite(exchange) {

          exchange.isLoading = true;
          
          return api.getExchange(exchange.exchangeId).
            then(res => {
              exchange.url = res.exchangeUrl

              // Los problemas de reactividad solo los podemos tener en objetos o arrays y solamente cuando queremos agregar propiedades que no existen desde el principio, que es cuando Vue no las tarckea (Aunque al parecer se arreglo en Vue 3)

            }).finally(() => exchange.isLoading = false);
        },

        getCoin() {

            const id = this.$route.params.id;

            Promise.all([
              api.getAsset(id),
              api.getAssetHistory(id),
              api.getMarkets(id)
            ])
            .then(([asset, history, markets]) => {
              this.asset = asset;
              this.history = history;
              this.markets = markets;
            });

            


        },

        dollar(value) {
            return dollarFilter(value);
        },

        percent(value) {
            return percentFilter(value);
        }

    },

    computed: {

      convertResult() {

        if(!this.convertValue)
          return 0;

        const result = this.fromUsd ? this.convertValue / this.asset.priceUsd : this.convertValue * this.asset.priceUsd;
        return result.toFixed(4);

      },

      min() {

        return Math.min(
          ...this.history.map(h => parseFloat(h.priceUsd).toFixed(2))
        );

      },

      max() {

        return Math.max(
          ...this.history.map(h => parseFloat(h.priceUsd).toFixed(2))
        );

      },

      avg() {
        return (this.history.reduce((a, b) => a + parseFloat(b.priceUsd), 0) / this.history.length).toFixed(2)
      }

    },

    watch: {

      // Cuando el parámetro de la ruta cambia, pero la vista se mantiene, el componente no se vuelve a cargar, por tanto, created no se vuelve a llamar y los datos no se actualizan, así que para solucionar eso cramos un watcher que detecte los cambios en la ruta
      $route() {
        this.getCoin();
      }

    }
    
}

</script>

<style scoped>
td {
  padding: 10px;
  text-align: center;
}
</style>

