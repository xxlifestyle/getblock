<template>
  <div class="xs:px-4 flex-col flex" v-if="!isLoading">
    <div class="w-[90%] mb-14 leading-4">
      <h1 class="text-5xl mb-4">Crypto Exchange</h1>
      <p class="text-lg">Exchange fast and easy</p>
    </div>
    <div
      class="justify-center md:flex-row xs:flex-col items-end sm:items-end md:items-end flex-row flex"
    >
      <div class="flex md:w-96 xs:w-[100%]">
        <input
          v-if="!show_items_list_1"
          class="w-[70%] pl-4 border-y border-l focus:outline-none border-[#E3EBEF] text-lg h-12 bg-[#F6F7F8] rounded-l-md"
          type="number"
          placeholder="Search"
          v-model="amount_holder_1"
        />
        <div
          :class="
            show_items_list_1 ? 'md:w-96 xs:w-[100%]' : 'w-[30%]' + ' relative'
          "
        >
          <input
            v-model="curr_selected_1.ticker"
            @blur="onBlur"
            @focus="onFocus"
            :class="
              show_items_list_1
                ? ` bg-[url('${curr_selected_1.image}')] w-[100%] focus:outline-none pl-4 border-t-[#C1D9E6] border border-b-[#E3EBEF] rounded-t-md border-x-[#C1D9E6] text-lg h-12 bg-[#F6F7F8]`
                : ' ' +
                  ` bg-[url('${curr_selected_2.image}')] w-[100%] focus:outline-none pl-4 border-y border-r rounded-r-md border-[#E3EBEF] text-lg h-12 bg-[#F6F7F8]`
            "
          />
          <div
            v-show="show_items_list_1"
            class="z-50 absolute border-x-[#C1D9E6] border-b-[#C1D9E6] rounded-b-md border md:w-96 xs:w-[100%] items-list absolute max-h-36 overflow-y-auto overflow-x-hidden"
          >
            <div
              @click="selectFirst(item)"
              :key="item.id"
              class="pl-5 gap-4 hover:bg-[#EAF1F7] bg-[#F6F7F8] cursor-pointer flex items-center h-12 pointer"
              v-for="item in filteredCurriencies"
            >
              <img :src="item.image" alt="" />
              <span> {{ item.ticker.toUpperCase() }}</span>
              <span class="text-[#80A2B6] text-lg">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        @click="swapPositions"
        class="w-14 h-12 flex align-center justify-center cursor-pointer"
      >
        <img src="./assets/swap.svg" alt="" />
      </div>
      <div class="flex md:w-96 xs:w-[100%]">
        <input
          v-if="!show_items_list_2"
          class="pl-4 border-y border-l focus:outline-none border-[#E3EBEF]-500 xs:w-[70%] text-lg h-12 bg-[#F6F7F8] rounded-l-md"
          readonly
          placeholder="Search"
          v-model="amount_holder_2"
        />
        <div :class="show_items_list_2 ? 'w-[100%]' : 'w-[30%]' + ' relative'">
          <input
            v-model="curr_selected_2.ticker"
            @focus="onFocusSecond"
            :class="
              show_items_list_2
                ? ` bg-[url('${curr_selected_2.image}')] xs:w-[100%] w-[100%] focus:outline-none pl-4 border-t-[#C1D9E6] border border-b-[#E3EBEF] rounded-t-md border-x-[#C1D9E6] text-lg h-12 bg-[#F6F7F8]`
                : ' ' +
                  ` bg-[url('${curr_selected_2.image}')] w-[100%] focus:outline-none pl-4 border-y border-r rounded-r-md border-[#E3EBEF] text-lg h-12 bg-[#F6F7F8]`
            "
          />
          <div
            v-show="show_items_list_2"
            class="border-x-[#C1D9E6] border-b-[#C1D9E6] rounded-b-md border md:w-96 xs:w-[100%] items-list absolute max-h-36 overflow-y-auto overflow-x-hidden"
          >
            <div
              @click="selectSecond(item)"
              :key="item.id"
              class="pl-5 gap-4 hover:bg-[#EAF1F7] bg-[#F6F7F8] cursor-pointer flex items-center h-12 pointer"
              v-for="item in filteredCurrienciesSecond"
            >
              <img
                class="w-5 h-5"
                style="
                  color: blue;
                  width: 20px !important;
                  height: 20px !important;
                "
                :src="item.image"
                alt=""
              />
              <span> {{ item.ticker.toUpperCase() }}</span>
              <span class="text-[#80A2B6] text-lg">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <span class="mb-2 mt-8">Your Ethereum address</span>
      <div class="flex-col lg:flex-row flex gap-8 justify-between items-start">
        <input
          class="lg:w-[70%] w-[100%] pl-4 border focus:outline-none border-[#E3EBEF]-500 text-lg h-12 bg-[#F6F7F8] rounded-md"
        />
        <div
          class="lg:w-[30%] w-[100%] flex flex-col justify-center items-center"
        >
          <button
            :disabled="isFetching"
            @click="exchange"
            class="disabled:opacity-50 h-12 hover:bg-[#0095E0] bg-[#11B3FE] text-white rounded-md w-[100%] h-12"
          >
            EXCHANGE
          </button>
          <span class="mt-1 text-[#E03F3F]">{{ error_text }} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "./plugins/axios";
export default {
  name: "App",
  components: {},
  data() {
    return {
      testInput: "",
      isLoading: true,
      currencies_data: [],
      show_items_list_1: false,
      show_items_list_2: false,
      curr_selected_1: null,
      curr_selected_2: null,
      amount_holder_1: "",
      amount_holder_2: "",
      error_text: "",
      isFetching: false,
    };
  },
  computed: {
    filteredCurriencies() {
      return this.currencies_data.filter(
        (item) =>
          item.ticker.indexOf(this.curr_selected_1.ticker.toUpperCase()) !== -1
      );
    },
    filteredCurrienciesSecond() {
      return this.currencies_data.filter(
        (item) =>
          item.ticker.indexOf(this.curr_selected_2.ticker.toUpperCase()) !== -1
      );
    },
  },
  watch() {},
  methods: {
    async swapPositions() {
      [
        this.curr_selected_1,
        this.curr_selected_2,
        this.amount_holder_1,
        this.amount_holder_2,
      ] = [
        this.curr_selected_2,
        this.curr_selected_1,
        this.amount_holder_2,
        this.amount_holder_1,
      ];
    },
    onFocus() {
      this.show_items_list_2 = false;
      this.show_items_list_1 = true;
    },
    onFocusSecond() {
      this.show_items_list_1 = false;
      this.show_items_list_2 = true;
    },
    // onBlur(){
    //   this.show_items_list = false
    // },
    selectFirst(item) {
      this.curr_selected_1 = item;
      this.requestTotalInfo();
      this.show_items_list_1 = false;
    },
    selectSecond(item) {
      this.curr_selected_2 = item;
      this.requestTotalInfo();
      this.show_items_list_2 = false;
    },
    requestMinAmount() {
      api(
        `exchange/min-amount?fromCurrency=${this.curr_selected_1.ticker}&toCurrency=${this.curr_selected_2.ticker}&fromNetwork=${this.curr_selected_1.network}&toNetwork=${this.curr_selected_2.network}&flow=standard`
      ).then(({ data }) => {
        this.amount_holder_1 = data.minAmount;
      });
    },
    async requestTotalInfo() {
      this.isFetching = true;
      await api(
        `exchange/min-amount?fromCurrency=${this.curr_selected_1.ticker}&toCurrency=${this.curr_selected_2.ticker}&fromNetwork=${this.curr_selected_1.network}&toNetwork=${this.curr_selected_2.network}&flow=standard`
      ).then(({ data }) => {
        this.amount_holder_1 = data.minAmount;
      });
      await api(
        `exchange/estimated-amount?fromCurrency=${this.curr_selected_1.ticker}&toCurrency=${this.curr_selected_2.ticker}&fromAmount=${this.amount_holder_1}&toAmount=&fromNetwork=${this.curr_selected_1.network}&toNetwork=${this.curr_selected_2.network}&flow=standard&type=direct&useRateId=false`
      )
        .then(({ data }) => {
          this.amount_holder_2 = data.toAmount;
        })
        .finally(() => {
          this.error_text = "";
          this.isFetching = false;
        });
    },
    exchange() {
      this.isFetching = true;
      api(
        `exchange/estimated-amount?fromCurrency=${this.curr_selected_1.ticker}&toCurrency=${this.curr_selected_2.ticker}&fromAmount=${this.amount_holder_1}&toAmount=&fromNetwork=${this.curr_selected_1.network}&toNetwork=${this.curr_selected_2.network}&flow=standard&type=direct&useRateId=false`
      )
        .then(({ data }) => {
          this.error_text = "";
          this.amount_holder_2 = data.toAmount;
        })
        .catch((error) => {
          console.log();
          if (error.response.data.error === "pair_is_inactive") {
            this.error_text = "This pair is disabled now";
          }
          if (
            error.response.data.error ===
            ("deposit_too_small" || "fiat_estimate_error")
          ) {
            this.error_text = "Deposit too small";
            this.amount_holder_2 = "-";
          }
        })
        .finally(() => {
          this.isFetching = false;
        });
    },
  },
  async mounted() {
    await api("exchange/currencies").then(({ data }) => {
      this.currencies_data = data.map((item, index) => ({
        ...item,
        id: index,
        ticker: item.ticker.toUpperCase(),
      })); //пришлось делать id для каждой валюты ради :key для v-for, страница грузится дольше из-за этого
      this.curr_selected_1 = data[0];
      this.curr_selected_2 = data[1];
    });
    await api(
      `exchange/min-amount?fromCurrency=${this.curr_selected_1.ticker}&toCurrency=${this.curr_selected_2.ticker}&fromNetwork=${this.curr_selected_1.network}&toNetwork=${this.curr_selected_2.network}&flow=standard`
    ).then(({ data }) => {
      this.amount_holder_1 = data.minAmount;
    });
    await api(
      `exchange/estimated-amount?fromCurrency=${this.curr_selected_1.ticker}&toCurrency=${this.curr_selected_2.ticker}&fromAmount=${this.amount_holder_1}&toAmount=&fromNetwork=${this.curr_selected_1.network}&toNetwork=${this.curr_selected_2.network}&flow=standard&type=direct&useRateId=false`
    )
      .then(({ data }) => {
        this.amount_holder_2 = data.toAmount;
      })
      .finally(() => {
        this.isLoading = false;
      });
  },
};
</script>

<style>
@import "./assets/base.css";

img {
  height: 20px;
  width: 20px;
}
.items-list {
  scroll-behavior: smooth;
}
</style>
