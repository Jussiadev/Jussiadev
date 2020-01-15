<template>
  <div class="d-inline">
    <slot name="button">
      <b-button v-b-modal="modalId" :variant="variant" :size="btnSize">{{title}}</b-button>
    </slot>
    <b-modal
      :id="modalId"
      class="modal-fullscreen"
      :title="title"
      :header-bg-variant="modalHeader"
      :header-text-variant="modalHeaderText"
      @hidden="handleHidden"
      @ok="handleOk">
      <slot>
      </slot>
    </b-modal>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String
    },
    btnSize: {
      type: String,
      default: ''
    },
    variant: {
      type: String,
      default: 'outline-primary'
    },
    modalId: {
      type: String
    },
    modalHeader: {
      type: String,
      default: 'light'
    },
    modalHeaderText: {
      type: String,
      default: 'dark'
    }
  },
  data () {
    return {
      name: '',
      address: '',
      accounts: ''
    }
  },
  methods: {
    handleOk () {
      this.$emit('handleOk')
    },
    handleHidden () {
      this.$emit('handleHidden')
    }
  }
}
</script>
<style>
  .modal-fullscreen .modal {
    padding: 0 !important;
  }
  .modal-fullscreen .modal-dialog {
    max-width: 100%;
    height: 100%;
    margin: 0;
  }
  .modal-fullscreen .modal-content {
    border: 0;
    border-radius: 0;
    min-height: 100%;
    height: auto;
  }
</style>
