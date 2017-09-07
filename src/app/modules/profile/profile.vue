<style>

    .dev-stage {
        margin-top: 50px;
        color: white;
        font-size: 1.5em;
    }

</style>

<template>

    <div class="dev-stage">
      Page's in development stage, sorry
    </div>

</template>

<script type="text/babel">
  import { mapState, mapActions, mapGetters } from 'vuex';
  export default {
    data () {
      return {
        uploadMode: false,
        selected: -1
      }
    },
    components: {
    },
    props: {},
    computed: {
      ...mapGetters({}),
      ...mapState({
        files: state => state.filesComponent.files || [],
        authorities: state => state.auth.authorities || []
      })
    },
    methods: {
      ...mapActions({
      })
    },
    mounted () {
    }
  }
</script>
