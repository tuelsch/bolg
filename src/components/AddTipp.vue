<template>
  <div class="add-tipp floating-form" @keydown.esc="cancel">
    <textarea
      id="tipptext"
      class="add-tipp__text"
      name="tipptext"
      rows="2"
      placeholder="Reisetipp"
      v-model="tipp.text"
      v-validate="'required'"
    ></textarea>
    <p class="error" v-bind:key="error.id" v-for="error in errors.collect('tipptext')">{{error}}</p>
    <input
      name="tippname"
      type="text"
      placeholder="Name"
      v-model="tipp.name"
      v-validate="'required'"
    >
    <p class="error" v-bind:key="error.id" v-for="error in errors.collect('tippname')">{{error}}</p>
    <input
      name="tippemail"
      type="email"
      placeholder="Email (optional)"
      v-model="tipp.email"
      v-validate="'email'"
      data-vv-validate-on="blur"
    >
    <p class="error" v-bind:key="error.id" v-for="error in errors.collect('tippemail')">{{error}}</p>
    <p class="error" v-if="error">{{error}}</p>
    <div class="floating-form__controls">
      <button @mousedown="cancel" @click="cancel">Abbräche</button>
      <button
        @click="send"
        :disabled="loading || errors.any()"
      >Schicke</button>
    </div>
  </div>
</template>

<script>
  import Tipp from 'src/models/Tipp';
  import axios from 'axios';

  /* global google */

  export default {
    data() {
      return {
        loading: false,
        error: false,
        tipp: new Tipp(),
      };
    },

    props: {
      location: Object,
      map: Object,
    },

    methods: {
      send() {
        this.error = false;
        this.loading = true;
        this.tipp.lat = this.location.lat();
        this.tipp.lng = this.location.lng();

        axios
          .post('/api/tipp', this.tipp.normalize())
          .then(() => {
            this.addTemporaryTipp();
            this.loading = false;
            this.error = false;
            this.tipp = new Tipp();
            this.$emit('tipp-add-success');
          })
          .catch((err) => {
            this.loading = false;
            this.error = err.message;
          });
      },
      addTemporaryTipp() {
        return new google.maps.Marker({
          title: this.tipp.title(),
          position: this.location,
          map: this.map,
          icon: {
            url: '/img/inuksuk-map.svg',
            size: new google.maps.Size(36, 34),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(18, 17),
          },
        });
      },
      cancel() {
        this.$emit('close-add-tipp');
      },
    },

    mounted() {
      document.getElementById('tipptext').focus();
    },
  }
</script>

<style lang="scss">
  .add-tipp__text {
    border-top: 1px solid lightgrey;
  }
</style>

