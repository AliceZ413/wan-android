<template>
  <div class="org-picker__container">
    <group :title="'机构选择'" class="list-title">
      <cell
        :title="title1"
        is-link
        :border-intent="false"
        :arrow-direction="'right'"
        @click.native="showPicker001"></cell>

      <cell
        :title="title2"
        is-link
        :border-intent="false"
        :arrow-direction="'right'"
        @click.native="showPicker002"></cell>

      <cell
        :title="title3"
        is-link
        :border-intent="false"
        :arrow-direction="'right'"
        @click.native="showPicker003"></cell>
      <cell
        :title="title4"
        is-link
        :border-intent="false"
        :arrow-direction="'right'"
        @click.native="showPicker004"></cell>
      <cell
        :title="title5"
        is-link
        :border-intent="false"
        :arrow-direction="'right'"
        @click.native="showPicker005"></cell>
      <cell
        :title="title6"
        is-link
        :border-intent="false"
        :arrow-direction="'right'"
        @click.native="showPicker006"></cell>
    </group>
    <org-picker v-model="showPicker" @onPickup="confirmOrg1"></org-picker>
    <org-picker v-model="showPicker2" @onPickup="confirmOrg2" :show-root="showRoot2"></org-picker>

    <org-picker
      v-model="showPicker3"
      @onPickup="confirmOrg3"
      :show-root="false"
      :provinces="permitProvinces">
    </org-picker>

    <org-picker
      v-model="showPicker4"
      @onPickup="confirmOrg4"
      :show-root="true"
      :provinces="permitProvinces2">
    </org-picker>

    <org-picker
      v-model="showPicker5"
      @onPickup="confirmOrg5"
      :show-root="false"
      :provinces="permitProvinces2"
      :cities="permitCities"
    >
    </org-picker>

    <org-picker
      v-model="showPicker6"
      @onPickup="confirmOrg6"
      :show-root="true"
      :provinces="permitProvinces3"
    >
    </org-picker>
  </div>
</template>

<script>
  import orgPicker from "@/../components/service/org-picker"
  import { Cell, Group } from 'vux'

  export default {
    name: 'demo-org-picker',
    components: {
      orgPicker,
      Cell,
      Group
    },
    data () {
      return {
        showPicker: false,
        showPicker2: false,
        showPicker3: false,
        showPicker4: false,
        showPicker5: false,
        showPicker6: false,

        showRoot: false,
        showRoot2: false,

        title1: '默认机构选择',
        title2: '不展示根结点',
        title3: '限制广东、广西省份',
        title4: '仅广东',
        title5: '仅广州市',
        title6: '传入未知职级的机构代码',

        permitProvinces: [],
        permitProvinces2: ['09'],
        permitCities: ['0901'],
        permitProvinces3: []
      }
    },
    mounted () {

    },
    methods: {

      showPicker001 () {
        this.showPicker = true;
      },

      showPicker002 () {
        this.showPicker2 = true;
      },

      showPicker003 () {
        this.permitProvinces = ['09','10'];
        this.showPicker3 = true;
      },
      showPicker004 () {
        this.showPicker4 = true;
      },
      showPicker005 () {
        this.showPicker5 = true;
      },
      showPicker006 () {
        this.permitProvinces3 = ['0901'];
        this.showPicker6 = true;
      },

      confirmOrg1 (data) {
        console.dir(data)
        this.title1 = data.orgName;
      },
      confirmOrg2 (data) {
        console.dir(data)
        this.title2 = data.orgName;
      },
      confirmOrg3 (data) {
        console.dir(data)
        this.title3 = data.orgName;
      },
      confirmOrg4 (data) {
        console.dir(data)
        this.title4 = data.orgName;
      },
      confirmOrg5 (data) {
        console.dir(data)
        this.title5 = data.orgName;
      },
      confirmOrg6 (data) {
        console.dir(data)
        this.title6 = data.orgName;
      },
    }
  }
</script>

<style scoped lang="scss">

</style>
