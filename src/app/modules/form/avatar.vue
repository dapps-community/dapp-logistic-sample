<style>
  .user__icon {
    fill: white;
  }
</style>
<template>
  <svg class="user__icon" :style="{ 
                    'width': `${size}px`,
                    'height': `${size}px` }">
    <defs>
      <clipPath :id="imkey">
        <circle :cx="size / 2" :cy="size / 2" :r="size / 2" />
      </clipPath>
    </defs>
    <g>
    <image :xlink:href="link"
          class="icon-avatar"
          preserveAspectRatio="xMidYMid slice"
          :height="size" :width="size"
          :clip-path="`url(#${imkey})`"/>
    </g>
  </svg>
</template>
<script type="text/babel">
  export default {
    props: {
      imkey: {
        type: String, 
        required: true
      },
      size: {
        type: Number,
        default: 55
      },
      link: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdFZkrfa3z_quNYsloqbAG4iqhcF1KKPqEv5l2HqlCTzDGsTII'
      }
    },
    data() {
      return {
      };
    },
    methods: {
    },
    components: {
    },
    mounted() {
    }
  };
</script>